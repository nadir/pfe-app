import { Picker } from "@react-native-picker/picker";
import { Input } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { AppState, FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useModules } from "../../services/useModules";
import { useFormStore } from "../../stores/useFormStore";
import { useNotes } from "./useNotes";
import { Note, publishNotes } from "./publishNotes";
import Toast from "react-native-toast-message";
import { mergeNotes } from "./mergeNotes";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";

const Notes = ({ navigation }: { navigation: any }) => {
  const [selectedClass, setSelectedClass] = useState<number>();
  const [selectedModule, setSelectedModule] = useState<number>();
  const token = useFormStore((state) => state.token);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError, error } = useModules(token);

  const {
    data: noteData,
    isError: bruh,
    isSuccess,
    refetch,
  } = useNotes(token, selectedClass, selectedModule);

  useRefreshOnFocus(refetch);

  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {}, [isSuccess, noteData]);

  useFocusEffect(
    useCallback(() => {
      const saveDraftNotes = async () => {
        if (selectedClass && selectedModule) {
          await AsyncStorage.setItem(
            `notes:${selectedClass}:${selectedModule}`,
            JSON.stringify(notes)
          );
        }
      };

      const appStateSub = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "background") {
            saveDraftNotes();
          }
        }
      );

      const blurUnsubscribe = navigation.addListener("blur", () => {
        saveDraftNotes();
      });

      return () => {
        blurUnsubscribe();
        appStateSub.remove();
      };
    }, [navigation, notes, selectedClass, selectedModule])
  );

  const getDraftNotes = async (
    selectedClass: number,
    selectedModule: number
  ) => {
    const draftNotes = await AsyncStorage.getItem(
      `notes:${selectedClass}:${selectedModule}`
    );
    return draftNotes;
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedClass && selectedModule) {
        getDraftNotes(selectedClass, selectedModule).then((draftNotes) => {
          if (draftNotes && isSuccess) {
            const mergedNotes = mergeNotes(noteData, JSON.parse(draftNotes));
            setNotes(mergedNotes);
          } else {
            setNotes(noteData);
          }
        });
      }
    }, [isSuccess, noteData, selectedClass, selectedModule])
  );

  const modules = data?.filter((module) => module.class_id === selectedClass);

  console.log(selectedClass, selectedModule);

  useEffect(() => {
    if (modules?.length === 1) {
      setSelectedModule(modules[0].id);
    }
  }, [modules]);

  const classes = data?.map((module) => {
    return {
      name: module.class_name,
      id: module.class_id,
    };
  });

  const handleNoteChange = (id: number, field: keyof Note, value: string) => {
    const cleanedText = value.replace(/[^0-9]/g, "");

    // Insert a dot every two digits
    const newValue = cleanedText.replace(/(\d{2})(?=\d)/g, "$1.");

    // if value bigger than 20, make it 20
    if (parseFloat(newValue) > 20) {
      return;
    }
    if (filteredNotes.length > 0) {
      setFilteredNotes((prevNotes) => {
        const index = prevNotes.findIndex((note) => note.id === id);
        const updatedNote = {
          ...prevNotes[index],
          [field]: newValue,
          updated_at: new Date().toISOString(),
        };
        const updatedNotes = [...prevNotes];
        updatedNotes[index] = updatedNote;
        return updatedNotes;
      });
    }
    setNotes((prevNotes) => {
      const index = prevNotes.findIndex((note) => note.id === id);
      const updatedNote = {
        ...prevNotes[index],
        [field]: newValue,
        updated_at: new Date().toISOString(),
      };
      const updatedNotes = [...prevNotes];
      updatedNotes[index] = updatedNote;
      return updatedNotes;
    });
  };

  const ListHeaderComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#c5c5c5",
          alignItems: "center",
          borderBottomEndRadius: 10,
          padding: 20,
        }}
      >
        <Text
          style={[
            {
              width: 150,
            },
            styles.noteLabel,
          ]}
        >
          Student
        </Text>
        <Text style={styles.noteLabel}>Evaluation</Text>
        <Text style={styles.noteLabel}>Test</Text>

        <Text style={styles.noteLabel}>Exam</Text>
      </View>
    );
  };

  const renderStudent = ({ item, index }: { item: Note; index: number }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#d8d8d8",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: 10,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontFamily: "SourceSansPro-SemiBold",
            fontSize: 14,
            marginHorizontal: 10,
            width: 140,
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Input
            keyboardType="numeric"
            renderErrorMessage={false}
            placeholder="00.0"
            maxLength={5}
            value={item.evaluation}
            style={styles.input}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={(value) =>
              handleNoteChange(item.id, "evaluation", value)
            }
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Input
            keyboardType="numeric"
            renderErrorMessage={false}
            placeholder="00.0"
            maxLength={5}
            style={styles.input}
            value={item.test}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={(value) => handleNoteChange(item.id, "test", value)}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Input
            keyboardType="numeric"
            renderErrorMessage={false}
            placeholder="00.0"
            maxLength={5}
            style={styles.input}
            value={item.exam}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.inputContainerStyle}
            onChangeText={(value) => handleNoteChange(item.id, "exam", value)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#c5c5c5",
          alignItems: "center",
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <View
          style={{
            flex: 0.5,
            borderRightWidth: 1,
            borderRightColor: "#c5c5c5",
          }}
        >
          <Picker
            selectedValue={selectedClass}
            placeholder="Select a class"
            onValueChange={(itemValue: number, itemIndex) =>
              setSelectedClass(itemValue)
            }
          >
            {classes?.map((item) => {
              return (
                <Picker.Item
                  style={{
                    fontSize: 14,
                  }}
                  key={item.id}
                  label={item.name}
                  value={item.id}
                />
              );
            })}
          </Picker>
        </View>
        <View
          style={{
            flex: 0.5,
          }}
        >
          <Picker
            selectedValue={selectedModule}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedModule(itemValue)
            }
          >
            <Picker.Item label={"Select module"} enabled={false} value={""} />
            {modules?.map((item) => {
              return (
                <Picker.Item
                  style={{
                    fontSize: 14,
                  }}
                  key={item.id}
                  label={item.name}
                  value={item.id}
                />
              );
            })}
          </Picker>
        </View>

        <Button
          disabled={loading}
          loading={loading}
          onPress={async () => {
            setLoading(true);

            try {
              if (selectedClass && selectedModule) {
                await publishNotes(token, notes, selectedClass, selectedModule);

                Toast.show({
                  type: "success",
                  text1: "Success",
                  text2: "Notes published successfully",
                });
              }
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Error publishing notes",
              });
            } finally {
              setLoading(false);
            }
          }}
          style={{
            marginHorizontal: 10,
          }}
          icon={"upload"}
          buttonColor="#03e587"
          mode="contained"
        >
          Publish
        </Button>
      </View>
      <Searchbar
        placeholder="Search"
        onChangeText={(text) => {
          setSearchQuery(text);
          setFilteredNotes(
            notes.filter((item) => {
              return item.name.toLowerCase().includes(text.toLowerCase());
            })
          );
        }}
        value={searchQuery}
        style={{
          margin: 10,
          backgroundColor: "#ffffff",
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#e3e3e3",
        }}
      />
      <FlatList
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "SourceSansPro-SemiBold",
                  fontSize: 16,
                }}
              >
                {!selectedModule ? "Select a module" : "No notes found"}
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={ListHeaderComponent}
        data={
          filteredNotes.length > 0 ? filteredNotes : !searchQuery ? notes : null
        }
        renderItem={renderStudent}
      />
      <StatusBar style="dark" backgroundColor="white" />
    </SafeAreaView>
  );
};

export default Notes;

const styles = StyleSheet.create({
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c5c5c5",
    fontFamily: "SourceSansPro-Regular",
    fontSize: 12,
    paddingHorizontal: 10,
  },
  inputContainer: {
    margin: 0,
    padding: 0,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  noteLabel: {
    fontFamily: "SourceSansPro-SemiBold",
    fontSize: 14,
  },
});

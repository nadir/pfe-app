import { Icon } from "@rneui/base";
import { StyleSheet, Text, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  TextInput,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { API_URL } from "../../config/constants";
import Toast from "react-native-toast-message";
import { useFormStore } from "../../stores/useFormStore";
import { formatDistanceToNow } from "date-fns";
import { FlatList } from "react-native-gesture-handler";
import { useState } from "react";

type QuestionsProps = {
  primaryColor: string;
  secondaryColor: string;
  moduleId: number;
};

interface Question {
  question_id: number;
  question: string;
  answer?: string;
  answered_at: string;
  created_at: string;
  module_id: number;
  asked_by_full_name: string;
  answered_by_full_name: string;
}

const useQuestions = (moduleId: number, token: string) => {
  return useQuery<Question[]>(
    ["modules", moduleId, "questions"],
    async () => {
      try {
        const response = await fetch(
          `${API_URL}/modules/${moduleId}/questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        return data.results;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    },
    {
      enabled: !!moduleId,
    }
  );
};

const formatDate = (date: string) => {
  let formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true,
  }).replace("about ", "");

  return formattedDate;
};

const Quetions = ({
  moduleId,
  primaryColor,
  secondaryColor,
}: QuestionsProps) => {
  const token = useFormStore((state) => state.token);
  const user_type = useFormStore((state) => state.loggedInUser.user_type);

  const { data: questions, isLoading, refetch } = useQuestions(moduleId, token);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<
    {
      question_id: number;
      answer: string;
    }[]
  >([]);

  const renderQuestions = ({ item }: { item: Question }) => {
    return (
      <View
        style={{
          alignSelf: "stretch",
          backgroundColor: "white",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#e3e3e3",
          padding: 20,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar.Text
                size={40}
                label={"HY"}
                color="white"
                style={{
                  backgroundColor: "#c3c2ff",
                }}
              />
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ fontFamily: "SourceSansPro-SemiBold" }}>
                    {item.asked_by_full_name}
                  </Text>
                </View>
                {/* Verfied icon */}
                <Text
                  style={{ fontFamily: "SourceSansPro-Regular", color: "gray" }}
                >
                  Asked {formatDate(item.created_at)}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "SourceSansPro-Regular",
                fontSize: 14,
                color: "black",
                marginTop: 20,
              }}
            >
              {item.question}
            </Text>
          </View>
        </View>
        {item.answer ? (
          <>
            <Divider style={{ marginVertical: 20 }} />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="checkmark-circle" size={40} color="green" />
              <View style={{ marginLeft: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                  }}
                >
                  <Text style={{ fontFamily: "SourceSansPro-SemiBold" }}>
                    {item.answered_by_full_name}
                  </Text>
                </View>
                {/* Verfied icon */}
                <Text
                  style={{ fontFamily: "SourceSansPro-Regular", color: "gray" }}
                >
                  Answered {formatDate(item.answered_at)}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: "SourceSansPro-Regular",
                fontSize: 14,
                color: "black",
                marginTop: 20,
              }}
            >
              {item.answer}
            </Text>
          </>
        ) : user_type === "teacher" ? (
          <View>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={1}
              maxLength={200}
              outlineColor="#e3e3e3"
              style={{
                backgroundColor: "white",
              }}
              outlineStyle={{
                borderWidth: 0,
              }}
              activeOutlineColor="#c2c2c2"
              value={
                answers.find(
                  (answer) => answer.question_id === item.question_id
                )?.answer
              }
              onChange={(e) => {
                const answer = e.nativeEvent.text;
                const newAnswers = answers.filter(
                  (answer) => answer.question_id !== item.question_id
                );
                newAnswers.push({
                  question_id: item.question_id,
                  answer,
                });
                setAnswers(newAnswers);
              }}
              placeholder="Type answer here..."
            />
            <Button
              mode="contained"
              icon={"reply"}
              onPress={async () => {
                const answer = answers.find(
                  (answer) => answer.question_id === item.question_id
                )?.answer;

                if (!answer) return;

                try {
                  const response = await fetch(
                    `${API_URL}/modules/questions/${item.question_id}/answer`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        answer: answer,
                      }),
                    }
                  );
                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.message);
                  }

                  refetch();
                } catch (error) {
                  Toast.show({
                    text1: "Error",
                    text2: (error as Error).message,
                    type: "error",
                  });
                }
              }}
              style={{
                alignSelf: "flex-end",
                marginTop: 10,
                backgroundColor: primaryColor,
              }}
            >
              Reply
            </Button>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {user_type === "parent" && (
        <View
          style={{
            alignSelf: "stretch",
            backgroundColor: "white",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#e3e3e3",
            padding: 15,
            justifyContent: "space-between",
          }}
        >
          <TextInput
            mode="outlined"
            multiline
            value={question}
            numberOfLines={3}
            maxLength={200}
            onChange={(e) => setQuestion(e.nativeEvent.text)}
            outlineColor="#e3e3e3"
            style={{
              backgroundColor: "white",
            }}
            outlineStyle={{
              borderWidth: 0,
            }}
            activeOutlineColor="#c2c2c2"
            placeholder="Type your question here..."
          />
          <Button
            mode="contained"
            onPress={async () => {
              try {
                const response = await fetch(
                  `${API_URL}/modules/${moduleId}/question`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      question,
                      module_id: moduleId,
                    }),
                  }
                );
                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.message);
                }

                refetch();
                setQuestion("");
              } catch (error) {
                Toast.show({
                  text1: "Error",
                  text2: (error as Error).message,
                  type: "error",
                });
              }
            }}
            style={{
              marginTop: 10,
              backgroundColor: primaryColor,
            }}
          >
            Ask
          </Button>
        </View>
      )}
      <FlatList
        data={questions}
        contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
        renderItem={renderQuestions}
        keyExtractor={(item) => item.question_id.toString()}
        style={{ marginTop: 20 }}
        refreshing={isLoading}
      />
    </View>
  );
};

export default Quetions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    minHeight: 1000,
    backgroundColor: "#F6F6F6",
  },
});

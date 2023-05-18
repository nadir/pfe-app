import { FC, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox, Button } from "react-native-paper";
import { queryClient } from "../../util/queryClient";
import { produce } from "immer";
import { set } from "lodash";

export const Poll: FC<PollProps & { id: number; token: string }> = ({
  id,
  question,
  options,
  votedOptionId,
  token,
}) => {
  const lastItemId = useRef(id);

  const [checked, setChecked] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [votedOption, setVotedOption] = useState(votedOptionId);

  if (id !== lastItemId.current) {
    lastItemId.current = id;
    setChecked(votedOptionId);
    setLoading(false);
    setVotedOption(votedOptionId);
  }

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "SourceSansPro-SemiBold",
          fontSize: 16,
          marginBottom: 10,
        }}
      >
        {question}
      </Text>
      <View
        style={{
          gap: 10,
        }}
      >
        {/* show no more than 3 options and the rest add a button that says show more */}
        {options.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <Checkbox
              color="#7976FF"
              uncheckedColor="#7976FF"
              disabled={votedOptionId ? true : false}
              status={
                votedOptionId === option.id || checked === option.id
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => setChecked(option.id)}
            />

            <View
              style={{
                flex: 1,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: "SourceSansPro-Regular",
                  fontSize: 14,
                }}
              >
                {option.text}
              </Text>
              {votedOptionId ? (
                <Text
                  style={{
                    fontFamily: "SourceSansPro-Regular",
                    fontSize: 14,
                    color: "#7976FF",
                  }}
                >
                  {option.votes} votes
                </Text>
              ) : null}
            </View>
          </View>
        ))}

        <Button
          loading={loading}
          onPress={async () => {
            setVotedOption(checked);
            setLoading(true);
            await fetch(`http://192.168.100.103:6969/posts/poll/${id}/vote`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                optionId: checked,
              }),
            });

            queryClient.setQueryData(["feed"], (data: any) => ({
              pages: produce(data.pages, (draft: any) => {
                draft.forEach((page: any) => {
                  page.data.forEach((post: any) => {
                    if (post.poll_id === id) {
                      post.votedOption = checked;
                      post.options.forEach((option: any) => {
                        if (option.id === checked) {
                          option.votes++;
                        }
                      });
                    }
                  });
                });
              }),
              pageParams: data.pageParams,
            }));
            setLoading(false);
          }}
          icon={votedOptionId ? "check" : "vote"}
          disabled={votedOptionId ? true : false}
          mode="contained"
          buttonColor="#9e9cff"
        >
          {votedOptionId ? "Thanks for voting" : "Vote"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    backgroundColor: "#FAFAFF",
    borderWidth: 1,
    borderColor: "#D6D6FF",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
});

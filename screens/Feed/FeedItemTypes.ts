import { StyleProp, ViewStyle } from "react-native";

export type FeedItemProps = {
  id: number;
  user: {
    id: string;
    profile_pic: string;
    name: string;
  };
  type: "publication" | "poll";

  commentsCount: number;
  isLiked: boolean;
  likesCount: number;
  created_at: string;
  title?: string;
  text: string;
  image?: string;
  question: string;
  poll_id?: number;
  votedOption?: number;
  options: {
    id: number;
    text: string;
    votes: number;
  }[];
  cardStyle?: StyleProp<ViewStyle>;
};

type PublicationProps = {
  title?: string;
  text: string;
  image?: string;
};

type PollProps = {
  question: string;
  votedOptionId?: number;
  options: {
    id: number;
    text: string;
    votes: number;
  }[];
};

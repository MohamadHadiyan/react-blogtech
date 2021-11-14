interface IProps {
  views?: number | undefined;
  likes?: number | undefined;
  comments?: number | undefined;
  createdAt?: string;
  toComments?: string;
  fullText?: boolean;
}

export const toSummarize = (amount: number, fullText?: boolean) => {
  return amount > 1e9 - 1
    ? Math.floor((amount / 1e9) * 10) / 10 + (fullText ? "Billion" : "B")
    : amount > 1e7 - 1
    ? Math.floor(amount / 1e6) + (fullText ? "Million" : "M")
    : amount > 1e6 - 1
    ? Math.floor((amount / 1e6) * 10) / 10 + (fullText ? "Million" : "M")
    : amount > 9999
    ? Math.floor(amount / 1000) + (fullText ? "Thousand" : "K")
    : amount > 999
    ? Math.floor((amount / 1000) * 10) / 10 + (fullText ? "Thousand" : "K")
    : amount + "";
};

const getBlogInfo = ({
  views,
  likes,
  comments,
  createdAt,
  toComments = "",
  fullText=false
}: IProps) => {
  const menuInfo = {
    views: {
      amount: views ? toSummarize(views,fullText) : "",
      to: "",
    },
    likes: {
      amount: likes ? toSummarize(likes,fullText) : "",
      to: "",
    },
    comments: {
      amount: comments ? toSummarize(comments,fullText) : "",
      to: toComments,
    },
    createdAt:createdAt?createdAt:"",
  };
  return menuInfo;
};

export default getBlogInfo;

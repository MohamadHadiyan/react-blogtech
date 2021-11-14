import React from "react";

type BlockType = "start" | "center" | "nearest" | "end";

interface Iprops<Type = HTMLDivElement> {
  ref: React.RefObject<Type>;
  block?: BlockType;
}

const scrollIntoView = ({ ref, block = "start" }: Iprops) => {
  const card = ref.current;
  if (!card) return;
  let timer = setTimeout(() => {
    card.scrollIntoView({ behavior: "smooth", block });
  }, 10);
  return () => clearTimeout(timer);
};

export default scrollIntoView;

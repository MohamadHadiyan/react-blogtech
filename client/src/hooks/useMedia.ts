import { useEffect, useState } from "react";

export const useMedia = (query: string) => {
  const media = window.matchMedia(query);
  const [matches, setMatches] = useState(media.matches);

  useEffect(() => {
    const listener = () => setMatches(media.matches);

    if (media.matches !== matches) listener();

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, media]);

  return matches;
};

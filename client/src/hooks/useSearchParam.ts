import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface IState {
  value: string;
  currentSearch: string;
}

export const useSearchParam = (
  searchKey: string,
  defaultvalue?: string,
  regex?: string | RegExp
) => {
  const { search } = useLocation();
  const init = { value: "", currentSearch: "" };
  const [state, setState] = useState<IState>(init);

  useEffect(() => {
    const searchParam = new URLSearchParams(search);
    const value = defaultvalue
      ? searchParam.get(searchKey) || defaultvalue
      : searchParam.get(searchKey) || "";

    let currentSearch = "";
    if (regex) {
      currentSearch =
        search.indexOf(`${searchKey}=`) === -1
          ? search.indexOf("?") === -1
            ? search + `?${searchKey}=${value}`
            : search + `&${searchKey}=${value}`
          : search.replace(regex, `${searchKey}=${value}`);
    }

    setState({ value, currentSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultvalue, search, searchKey]);

  return state;
};

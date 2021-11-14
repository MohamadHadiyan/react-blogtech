import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../utils/TypeScript";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { IUserCard } from "../../utils/TypeScript";

export const GET_ALL_USERS = "GET_ALL_USERS";

export interface IGetAllUsersType {
  type: typeof GET_ALL_USERS;
  payload: IUserCard[];
}

import { IUserCard } from "../../utils/TypeScript";
import { GET_ALL_USERS, IGetAllUsersType } from "../types/allUsersType";

const allUsersReducer = (state: IUserCard[] = [], action: IGetAllUsersType) => {
  switch (action.type) {
    case GET_ALL_USERS:
      return action.payload;
    default:
      return state;
  }
};

export default allUsersReducer;

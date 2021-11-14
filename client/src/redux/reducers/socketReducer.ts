import { ISocketType, SOCKET } from "../types/socketType";

export default function socetReducer(state: any = null, action: ISocketType) {
  switch (action.type) {
    case SOCKET:
      return action.payload;
    default:
      return state;
  }
}

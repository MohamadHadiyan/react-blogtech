import { IBlog, ITag } from "../../utils/TypeScript";

export const CREATE_TAG = "CREATE_TAG";
export const UPDATE_TAG = "UPDATE_TAG";
export const DELETE_TAG = "DELETE_TAG";
export const GET_TAGS_NAME = "GET_TAGS_NAME";
export const GET_TAGS_NAME_BY_PAGE = "GET_TAGS_NAME_BY_PAGE";
export const ADD_TAG_CONSUMER = "ADD_TAG_CONSUMER";
export const REMOVE_TAG_CONSUMER = "ADD_TAG_CONSUMER";

export interface ITagsState {
  tagBlogs: IBlog[];
  names: ITag[];
  count: number;
  pages: number[];
}

type GetTagsType = {
  tags: ITag[];
  count: number;
};

export interface IGetTagsNameType {
  type: typeof GET_TAGS_NAME;
  payload: GetTagsType;
}

type UpdateTagsType = {
  tags: ITag[];
  page: number;
};

export interface IUpdateTagsNameType {
  type: typeof GET_TAGS_NAME_BY_PAGE;
  payload: UpdateTagsType;
}

export interface ICreateTagType {
  type: typeof CREATE_TAG;
  payload: ITag[];
}

export interface IUpdateTagType {
  type: typeof UPDATE_TAG;
  payload: ITag;
}

export interface IDeleteTagType {
  type: typeof DELETE_TAG;
  payload: string;
}

type ConsumerType = {
  tag_ids: string[];
  blog_id: string;
};

export interface IAddTagConsumerType {
  type: typeof ADD_TAG_CONSUMER;
  payload: ConsumerType;
}

export interface IRemoveTagConsumerType {
  type: typeof REMOVE_TAG_CONSUMER;
  payload: ConsumerType;
}

export type ITagType =
  | ICreateTagType
  | IUpdateTagType
  | IDeleteTagType
  | IGetTagsNameType
  | IUpdateTagsNameType
  | IAddTagConsumerType
  | IRemoveTagConsumerType;

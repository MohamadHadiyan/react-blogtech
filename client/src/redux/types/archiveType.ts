import { IBlog } from "../../utils/TypeScript";

export const GET_ARCHIVE_DATE = "GET_ARCHIVE_DATE";
export const GET_ARCHIVE_BLOGS = "GET_ARCHIVE_BLOGS";

export type IGetArchiveDate = {
  createdAt: string;
  total: number;
};

export interface IArchiveDate extends IGetArchiveDate {
  monthName: string;
}

export type ArchiveBlogsType = {
  blogs: IBlog[];
  search: string;
  date: string;
};

export interface IArchiveState {
  archiveBlogs: ArchiveBlogsType[];
  dates: IArchiveDate[];
}

export interface IGetArchiveDateType {
  type: typeof GET_ARCHIVE_DATE;
  payload: IArchiveDate[];
}

export interface IGetArchiveBlogsType {
  type: typeof GET_ARCHIVE_BLOGS;
  payload: ArchiveBlogsType;
}

export type IArchiveType = IGetArchiveDateType | IGetArchiveBlogsType;

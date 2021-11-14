import { Dispatch } from "redux";
import { getAPI } from "../../utils/FetchData";
import getMonthName from "../../utils/getMonthName";
import { ALERT, IAlertType } from "../types/alertType";
import * as types from "../types/archiveType";

/**
 * -------------------------------------------------------------
 * Get Blogs Count By CreatedAt Date
 * -------------------------------------------------------------
 */
export const getArchiveDate =
  () => async (dispatch: Dispatch<IAlertType | types.IGetArchiveDateType>) => {
    try {
      const res = await getAPI("archive_dates");

      const data: types.IGetArchiveDate[] = res.data;
      const result: types.IArchiveDate[] = data.map((item) => {
        return { ...item, monthName: getMonthName(item.createdAt).monthName };
      });

      dispatch({ type: types.GET_ARCHIVE_DATE, payload: result });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get List Of Blogs By CreatedAt Date
 * -------------------------------------------------------------
 */
export const getArchiveBlogs =
  (date: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | types.IGetArchiveBlogsType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`archive${search}`);
      const archive: types.ArchiveBlogsType = {
        blogs: res.data,
        search,
        date,
      };

      dispatch({ type: types.GET_ARCHIVE_BLOGS, payload: archive });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

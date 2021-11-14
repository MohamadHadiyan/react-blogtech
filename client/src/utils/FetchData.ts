import axios from "axios";

export const postAPI = async (url: string, post: object, token?: string) => {
  return await axios.post(`/api/${url}`, post, {
    headers: { Authorization: token },
  });
};

export const getAPI = async (
  url: string,
  token?: string,
  downloadProgress?: (progressEvent: any) => void
) => {
  return await axios.get(`/api/${url}`, {
    headers: { Authorization: token || "" },
    onDownloadProgress: downloadProgress,
  });
};

export const patchAPI = async (url: string, data: object, token?: string) => {
  return await axios.patch(`/api/${url}`, data, {
    headers: { Authorization: token },
  });
};

export const deleteAPI = async (url: string, token?: string) => {
  return await axios.delete(`/api/${url}`, {
    headers: { Authorization: token },
  });
};

export const putAPI = async (url: string, data: object, token?: string) => {
  return await axios.put(`/api/${url}`, data, {
    headers: { Authorization: token },
  });
};

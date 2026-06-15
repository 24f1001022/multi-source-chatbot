import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const sendMessage = async (
  question,
  mode
) => {
  const response =
    await axios.post(
      `${API_URL}/chat`,
      {
        question,
        mode
      }
    );

  return response.data;
};

export const uploadFiles = async (
  files
) => {
  const formData =
    new FormData();

  files.forEach((file) => {
    formData.append(
      "files",
      file
    );
  });

  const response =
    await axios.post(
      `${API_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }
    );

  return response.data;
};

export const fetchFiles = async () => {
  const response = await axios.get(`${API_URL}/files`);
  return response.data;
};

export const uploadUrl = async (url) => {
  const response = await axios.post(`${API_URL}/upload-url`, { url });
  return response.data;
};

export const deleteFile = async (name) => {
  const response = await axios.delete(`${API_URL}/files`, {
    params: { name }
  });
  return response.data;
};

export const clearAllFiles = async () => {
  const response = await axios.post(`${API_URL}/clear-all`);
  return response.data;
};
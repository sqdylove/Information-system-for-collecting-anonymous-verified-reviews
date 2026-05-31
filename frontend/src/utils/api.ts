import Cookies from "js-cookie";

export const authorizedFetch = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get("auth_token");

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers });
};

// example:
// import { authorizedFetch } from "../utils/api";

// const sendFeedback = async (uuid: string, text: string) => {
//   try {
//     const response = await authorizedFetch(`http://localhost:8000/box/${uuid}/feedback`, {
//       method: "POST",
//       body: JSON.stringify({ text }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || "Ошибка");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

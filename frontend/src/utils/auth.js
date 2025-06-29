export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

export const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};
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
// Helper function to get userId from localStorage
export function GetIdFromLocalStorage() {
  const userItem = localStorage.getItem("user");
  if (!userItem) return null;
  try {
    const userObj = JSON.parse(userItem);
    return userObj.userId || null;
  } catch (e) {
    return null;
  }
}

const USER_ID = 'userId';

export const getUserId = () => localStorage.getItem(USER_ID);

export const setUserId = (userId: string) => localStorage.setItem(USER_ID, userId);

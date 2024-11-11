import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [
      { id: 1, title: 'New course available', time: '5m ago', isUnread: true },
      { id: 2, title: 'Assignment due', time: '1h ago', isUnread: true },
      { id: 3, title: 'System update', time: '2h ago', isUnread: false },
    ],
  },
  reducers: {
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.isUnread = false;
      });
    },
  },
});

export const { markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;

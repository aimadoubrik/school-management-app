import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isOpen: false,
    items: [
      {
        label: 'Home',
        icon: 'Home',
        href: '/',
        isActive: true,
      },
      {
        label: 'Courses',
        icon: 'BookOpen',
        href: '/courses',
        count: '24',
        badge: 'New',
      },
      {
        label: 'Students',
        icon: 'Users',
        href: '/students',
        count: '892',
      },
      {
        label: 'Schedule',
        icon: 'Calendar',
        href: '/schedule',
        count: '12',
      },
      {
        label: 'Reports',
        icon: 'BarChart',
        href: '/reports',
        count: '4',
      },
      { type: 'divider' },
      {
        label: 'Documents',
        icon: 'FileText',
        href: '/documents',
      },
      {
        label: 'Settings',
        icon: 'Settings',
        href: '/settings',
      },
    ],
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    activateItem: (state, action) => {
      state.items.forEach((item) => {
        item.isActive = item.label === action.payload;
      });
    },
  },
});

export const { toggleSidebar, closeSidebar, activateItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;

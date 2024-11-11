import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  items: [
    {
      label: 'Home',
      icon: 'Home',
      href: '/',
    },
    {
      label: 'Courses',
      icon: 'BookOpen',
      href: '/courses',
      count: 24,
      badge: 'New',
    },
    {
      label: 'Students',
      icon: 'Users',
      href: '/students',
      count: 892,
    },
    {
      label: 'Schedule',
      icon: 'Calendar',
      href: '/schedule',
      count: 12,
    },
    {
      label: 'Reports',
      icon: 'BarChart',
      href: '/reports',
      count: 4,
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
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
  },
});

export const { toggleSidebar, closeSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;

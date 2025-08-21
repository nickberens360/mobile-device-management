import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'engineer' | 'viewer';
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state): boolean => {
      return state.user?.role === 'admin';
    },

    canConfigure: (state): boolean => {
      return state.user?.role === 'admin' || state.user?.role === 'engineer';
    },
  },

  actions: {
    setUser(user: User): void {
      this.user = user;
      this.isAuthenticated = true;
    },

    logout(): void {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
  },
});
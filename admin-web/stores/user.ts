import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as null | {name: string },
        isAuthenticated: false,
    }),
    actions: {
        setUser(userData: {name: string}) {
            this.user = userData;
            this.isAuthenticated = true;
        },
        logout() {
            this.user = null;
            this.isAuthenticated = false;
        },
    },
});

<template>
  <v-toolbar class="navbar">
    <v-btn color="primary" :to="{ path: '/lobby' }">
      <v-icon></v-icon>
      Lobby
    </v-btn>
    <span class="spacer"></span>
    <div class="theme-control">
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ themeIcon }}</v-icon>
      </v-btn>
    </div>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { inject } from 'vue';
import {useThemeService} from "@/api/common/themeService"// 假设你已经创建了 AuthService

const themeService = useThemeService();
// const authService = inject<AuthService>('authService');


if (!themeService) throw new Error('ThemeService is not provided');
// if (!authService) throw new Error('AuthService is not provided');

// const isLoggedIn = computed(() => authService.isLoggedIn());
const themeIcon = computed(() => (themeService.themeSignal.value === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'));

const logout = () => {
  // authService.logout();
};

const toggleTheme = () => {
  themeService.toggleTheme();
};
</script>

<style scoped>
.navbar {
  position: fixed;
  height: 65px;
  z-index: 200;
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.router-link-active {
  color: darkgray !important;
  pointer-events: none;
}

.spacer {
  flex: 1 1 auto;
}

.v-toolbar {
  justify-content: space-between;
  padding: 0 2rem;
}

.theme-control {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
}

#login-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  padding: 5px 20px;
}
</style>

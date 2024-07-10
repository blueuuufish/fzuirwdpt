import {ref} from 'vue'
export function useThemeService() {
  const themeSignal = ref<string>("dark");

  const setTheme = (theme: string) => {
    themeSignal.value = theme;
  };

  const toggleTheme = () => {
    themeSignal.value = themeSignal.value === "dark" ? "light" : "dark";
  };
  
  return{
    themeSignal,
    setTheme,
    toggleTheme
  };
}
import { create } from "zustand";

interface themeModel{
    theme:'light'|'dark';
    toggleTheme:()=> void;
}
const initialTheme = typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';


const useThemeStore = create<themeModel>((set)=>({
theme:initialTheme,
toggleTheme: ()=> set((state)=>{
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme',newTheme);
    return({theme:newTheme})
}) }))
export default useThemeStore;
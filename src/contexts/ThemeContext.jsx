import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
 const [theme, setTheme] = useState(() => {
 // Read from localStorage or default to 'light'
 const savedTheme = localStorage.getItem('findnew-theme');
 return savedTheme || 'light';
 });

 useEffect(() => {
 localStorage.setItem('findnew-theme', theme);
 }, [theme]);

 const toggleTheme = () => {
 setTheme(prev => prev === 'light' ? 'dark' : 'light');
 };

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 );
};

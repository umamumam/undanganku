import React, { createContext, useContext } from 'react';

// Theme definitions matching backend
export const THEMES = {
  adat: {
    id: 'adat',
    name: 'Adat/Traditional',
    description: 'Tema dengan ornamen tradisional Indonesia',
    primaryColor: '#8B4513',
    secondaryColor: '#F5DEB3',
    accentColor: '#D4AF37',
    fontHeading: 'Cinzel',
    fontBody: 'Manrope',
    ornaments: {
      topLeft: '',
      topRight: '',
      bottom: '',
      divider: ''
    },
    backgroundPattern: 'batik',
    gradientStart: '#FDF8F0',
    gradientMid: '#F5E6D3',
    gradientEnd: '#FDF8F0'
  },
  floral: {
    id: 'floral',
    name: 'Floral/Bunga',
    description: 'Tema dengan dekorasi bunga yang elegan',
    primaryColor: '#B76E79',
    secondaryColor: '#F5E6E8',
    accentColor: '#D4AF37',
    fontHeading: 'Playfair Display',
    fontBody: 'Manrope',
    ornaments: {
      topLeft: '',
      topRight: '',
      bottom: '',
      divider: ''
    },
    backgroundPattern: 'floral',
    gradientStart: '#FEFCFB',
    gradientMid: '#F8ECEE',
    gradientEnd: '#FEFCFB'
  },
  modern: {
    id: 'modern',
    name: 'Modern/Minimalist',
    description: 'Tema modern dengan desain minimalis',
    primaryColor: '#2C3E50',
    secondaryColor: '#ECF0F1',
    accentColor: '#C9A962',
    fontHeading: 'Montserrat',
    fontBody: 'Open Sans',
    ornaments: {
      topLeft: '',
      topRight: '',
      bottom: '',
      divider: ''
    },
    backgroundPattern: 'none',
    gradientStart: '#FFFFFF',
    gradientMid: '#F5F7FA',
    gradientEnd: '#FFFFFF'
  }
};

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return THEMES.floral; // default theme
  }
  return context;
};

export const ThemeProvider = ({ theme, children }) => {
  const themeData = THEMES[theme] || THEMES.floral;
  
  return (
    <ThemeContext.Provider value={themeData}>
      <style>
        {`
          :root {
            --theme-primary: ${themeData.primaryColor};
            --theme-secondary: ${themeData.secondaryColor};
            --theme-accent: ${themeData.accentColor};
            --theme-font-heading: '${themeData.fontHeading}', serif;
            --theme-font-body: '${themeData.fontBody}', sans-serif;
            --theme-gradient-start: ${themeData.gradientStart};
            --theme-gradient-mid: ${themeData.gradientMid};
            --theme-gradient-end: ${themeData.gradientEnd};
          }
        `}
      </style>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

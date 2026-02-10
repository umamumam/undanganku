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
      topLeft: 'https://images.unsplash.com/photo-1762111067760-1f0fc2aa2866?w=400',
      topRight: 'https://images.unsplash.com/photo-1761517099247-71400d18ccd8?w=400',
      bottom: 'https://images.unsplash.com/photo-1761515315519-7fa1af1d3e06?w=400',
      divider: 'https://images.unsplash.com/photo-1762111067760-1f0fc2aa2866?w=200'
    },
    backgroundPattern: 'batik',
    gradientStart: '#FDF5E6',
    gradientMid: '#F5DEB3',
    gradientEnd: '#FDF5E6'
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
      topLeft: 'https://images.unsplash.com/photo-1581720848095-2b72764b08a2?w=400',
      topRight: 'https://images.unsplash.com/photo-1581720848209-9721f8fa30ff?w=400',
      bottom: 'https://images.unsplash.com/photo-1762805088436-ffa7b89779a9?w=400',
      divider: 'https://images.unsplash.com/photo-1581720848095-2b72764b08a2?w=200'
    },
    backgroundPattern: 'floral',
    gradientStart: '#FAFAF9',
    gradientMid: '#F5E6E8',
    gradientEnd: '#FAFAF9'
  },
  modern: {
    id: 'modern',
    name: 'Modern/Minimalist',
    description: 'Tema modern dengan desain minimalis',
    primaryColor: '#2C3E50',
    secondaryColor: '#ECF0F1',
    accentColor: '#E74C3C',
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
    gradientMid: '#ECF0F1',
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

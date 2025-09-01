import { useState, useEffect } from 'react';

export interface UseResponsiveGridReturn {
  columns: number;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const useResponsiveGrid = (): UseResponsiveGridReturn => {
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1024; // Default for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Set initial value
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine screen size based on breakpoints
  const getScreenSize = (width: number): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    if (width < 480) return 'xs';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    if (width < 1280) return 'xl';
    return '2xl';
  };

  // Determine number of columns based on screen size
  const getColumns = (width: number): number => {
    if (width < 480) return 1;      // xs: 1 column
    if (width < 768) return 2;      // sm: 2 columns  
    if (width < 1024) return 3;     // md: 3 columns
    return 4;                       // lg+: 4 columns
  };

  const screenSize = getScreenSize(windowWidth);
  const columns = getColumns(windowWidth);

  return {
    columns,
    isSmallScreen: windowWidth < 768,
    isMediumScreen: windowWidth >= 768 && windowWidth < 1024,
    isLargeScreen: windowWidth >= 1024,
    screenSize
  };
};
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Mode } from '../components/organisms/ModeSelector';

export interface UseModeSwitch {
  currentMode: Mode;
  switchMode: (mode: Mode) => void;
  isTransitioning: boolean;
}

export const useModeSwitch = (): UseModeSwitch => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Determine current mode from URL
  const getCurrentModeFromPath = useCallback((pathname: string): Mode => {
    if (pathname.startsWith('/templates')) {
      return 'templates';
    }
    return 'free-conversation';
  }, []);

  const [currentMode, setCurrentMode] = useState<Mode>(() => 
    getCurrentModeFromPath(location.pathname)
  );

  // Update mode when location changes
  useEffect(() => {
    const mode = getCurrentModeFromPath(location.pathname);
    setCurrentMode(mode);
  }, [location.pathname, getCurrentModeFromPath]);

  const switchMode = useCallback(async (newMode: Mode) => {
    if (newMode === currentMode) return;

    setIsTransitioning(true);

    try {
      // Clear any existing state/selections when switching modes
      // This ensures clean state between modes
      
      // Navigate to appropriate route
      switch (newMode) {
        case 'templates':
          navigate('/templates');
          break;
        case 'free-conversation':
        default:
          navigate('/chat');
          break;
      }

      // Brief transition delay for better UX
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);

    } catch (error) {
      console.error('Error switching modes:', error);
      setIsTransitioning(false);
    }
  }, [currentMode, navigate]);

  return {
    currentMode,
    switchMode,
    isTransitioning
  };
};
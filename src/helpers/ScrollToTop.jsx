import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scroll to the top-left corner of the window
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render any UI, it just works in the background
  return null; 
}
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Custom hook to handle Android hardware back button
 * @param backRoutePath - The route to navigate to when back button is pressed
 * @param fallbackRoute - Fallback route if backRoutePath is not provided (defaults to "/")
 */
export const useBackHandler = (backRoutePath?: string, fallbackRoute: string = "/") => {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      // Navigate to backRoutePath if provided, otherwise use fallback route
      const targetRoute = backRoutePath || fallbackRoute;
      router.push(targetRoute as any);
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backRoutePath, fallbackRoute, router]);
};

/**
 * Utility function to handle back navigation programmatically
 * @param router - Router instance from expo-router
 * @param backRoutePath - The route to navigate to
 * @param fallbackRoute - Fallback route if backRoutePath is not provided
 */
export const handleBackNavigation = (
  router: any,
  backRoutePath?: string,
  fallbackRoute: string = "/"
) => {
  const targetRoute = backRoutePath || fallbackRoute;
  router.push(targetRoute as any);
};

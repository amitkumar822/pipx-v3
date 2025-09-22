import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Custom hook to handle Android hardware back button
 * @param backRoutePath - The route to navigate to when back button is pressed
 * @param fallbackRoute - Fallback route if backRoutePath is not provided (defaults to "/")
 * @param currencyAssetId - Currency asset ID to pass when navigating back to agent screen
 */
export const useBackHandler = (backRoutePath?: string, fallbackRoute: string = "/", currencyAssetId?: string) => {
  const router = useRouter();

  console.log("currencyAssetId: ", currencyAssetId, "backRoutePath: ", backRoutePath);

  useEffect(() => {
    const backAction = () => {
      // Navigate to backRoutePath if provided, otherwise use fallback route
      if (backRoutePath === "/agent" && currencyAssetId) {
        router.push({
          pathname: "/agent",
          params: {
            currencyAssetId: currencyAssetId,
          },
        });
      } else {
        const targetRoute = backRoutePath || fallbackRoute;
        router.push(targetRoute as any);
      }
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [backRoutePath, fallbackRoute, currencyAssetId, router]);
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

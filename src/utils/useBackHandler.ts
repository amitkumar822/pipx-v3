import { useEffect, useRef } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * Custom hook to handle Android hardware back button
 * @param backRoutePath - The route to navigate to when back button is pressed
 * @param fallbackRoute - Fallback route if backRoutePath is not provided (defaults to "/")
 * @param currencyAssetId - Currency asset ID to pass when navigating back to agent screen
 */
export const useBackHandler = (backRoutePath?: string, fallbackRoute: string = "/", currencyAssetId?: string) => {
  const router = useRouter();

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
 * Custom hook to handle double tap to exit functionality
 * @param exitTimeout - Timeout in milliseconds for double tap detection (defaults to 500ms)
 */
export const useDoubleTapToExit = (
  exitTimeout: number = 500
) => {
  const backPressedRef = useRef<number>(0);
  const isWaitingForSecondTap = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const backAction = () => {
      const now = Date.now();
      
      if (isWaitingForSecondTap.current && backPressedRef.current && now - backPressedRef.current < exitTimeout) {
        // Double tap detected - show confirmation dialog directly
        isWaitingForSecondTap.current = false;
        backPressedRef.current = 0;
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        Alert.alert(
          "Exit App",
          "Are you sure you want to close this app?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                // Reset state on cancel
                isWaitingForSecondTap.current = false;
                backPressedRef.current = 0;
              }
            },
            {
              text: "Exit",
              style: "destructive",
              onPress: () => {
                // Exit the app
                BackHandler.exitApp();
              }
            }
          ]
        );
        return true;
      } else {
        // First tap - just set timestamp and wait for second tap (no alert)
        isWaitingForSecondTap.current = true;
        backPressedRef.current = now;
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set timeout to reset state if no second tap
        timeoutRef.current = setTimeout(() => {
          isWaitingForSecondTap.current = false;
          backPressedRef.current = 0;
          timeoutRef.current = null;
        }, exitTimeout);
        
        // No alert on first tap - just return true to prevent default back behavior
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      // Clear timeout and reset state when component unmounts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isWaitingForSecondTap.current = false;
      backPressedRef.current = 0;
    };
  }, [exitTimeout]);
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

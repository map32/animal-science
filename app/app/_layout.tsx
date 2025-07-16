import { SplashScreen, Stack, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { Text } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loaded, error] = useFonts({
    'Poppins': require('@/assets/fonts/PoppinsRegular.otf'),
    'PoppinsBold': require('@/assets/fonts/PoppinsBold.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  
  return (
      <Stack
        screenOptions={{
          // Hide the header for all other routes.
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      />
  );
}
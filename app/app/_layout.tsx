import { SplashScreen, Stack, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import { View } from "react-native";
import Text from '@/Text'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image } from "expo-image";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    return <Things />;
  }

  
  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          // Hide the header for all other routes.
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      />
      </GestureHandlerRootView>
  );
}

const Things = () => {
  return <View style={{backgroundColor:'transparent', width: '100%', height: '100%', justifyContent:'center', paddingTop: 300, zIndex:100}}>
    <Image source={require('@/assets/images/adaptive-icon.png')} style={{width:200, height:200, marginBottom: 40}} />
      <Text style={{lineHeight: 24}}>Every whisper counts</Text>
      <Text style={{lineHeight: 24}}>Protect the unheard</Text>
    <Image source={require('@/assets/images/map.png')} style={{width:300, height:150, borderRadius: 20}} />
  </View>
}
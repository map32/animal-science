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
  const [start, setStart] = useState(true)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().then(() => {setStart(false)});
    }
  }, [loaded, error]);

  if (start) {
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
  return <View style={{position: 'absolute', top: 0, left:0, backgroundColor:'transsparent', width: '100%', height: '100%', justifyContent:'center', alignItems:'center', zIndex:100}}>
    <Image source={require('@/assets/images/adaptive-icon.png')} style={{width:200, height:200, marginBottom: 40}} />
      <Text style={{lineHeight: 24}}>Every whisper counts</Text>
      <Text style={{lineHeight: 24}}>Protect the unheard</Text>
    <Image source={require('@/assets/images/map.png')} style={{marginTop: 20, width:300, height:150, borderRadius: 20}} />
  </View>
}
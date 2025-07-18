import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";


export default function Layout () {
    return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <AntDesign name="home" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="speciallog"
        options={{
          title: "Special Log",
          tabBarIcon: ({ color }) => <AntDesign name="book" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <FontAwesome name="map-marker" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="fundraise"
        options={{
          title: "Fundraise",
          tabBarIcon: ({ color }) => <FontAwesome5 name="donate" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={28} color={color} />
        }}
      />
    </Tabs>
  )
}
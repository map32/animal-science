import { Tabs } from "expo-router";


export default function Layout () {
    return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home"
        }}
      />
      <Tabs.Screen
        name="speciallog"
        options={{
          title: "Special Log"
        }}
      />
      <Tabs.Screen
        name="animal"
        options={{
          title: "Animal"
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map"
        }}
      />
      <Tabs.Screen
        name="fundraise"
        options={{
          title: "Fundraise"
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search"
        }}
      />
    </Tabs>
  )
}
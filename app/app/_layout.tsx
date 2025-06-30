import { Stack } from "expo-router";
import { useState } from "react";
import SideNav from "@/components/sidenav";

export default function RootLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
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
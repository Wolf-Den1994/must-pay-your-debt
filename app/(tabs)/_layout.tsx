import { Tabs } from 'expo-router';
import React from 'react';
import TabBarIcon from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type TabIconProps = {
  color: string;
  focused: boolean;
};

const HomeTabIcon = ({ color, focused }: TabIconProps) => (
  <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
);

const SettingsTabIcon = ({ color, focused }: TabIconProps) => (
  <TabBarIcon name={focused ? 'settings-sharp' : 'settings-outline'} color={color} />
);

const TabLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Debts',
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

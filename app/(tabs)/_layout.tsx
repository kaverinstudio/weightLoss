import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { AppleTheme } from '@/constants/appleTheme';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: AppleTheme.text,
                tabBarInactiveTintColor: AppleTheme.tertiaryText,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '700',
                },
                tabBarStyle: {
                    backgroundColor: 'rgba(255,255,255,0.94)',
                    borderTopColor: AppleTheme.separator,
                    height: 66,
                    paddingTop: 8,
                    paddingBottom: 10,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Сегодня',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'today' : 'today-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'История',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Прогресс',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'analytics' : 'analytics-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Профиль',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'person-circle' : 'person-circle-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen name="diary" options={{ href: null }} />
        </Tabs>
    );
}

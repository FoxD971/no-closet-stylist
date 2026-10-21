import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScannerScreen } from '../screens/ScannerScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { ClosetScreen } from '../screens/ClosetScreen';
import { TryOnScreen } from '../screens/TryOnScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { Camera, Sparkles, ShoppingBag } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    const { currentProducts } = useAppStore();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopColor: '#e5e7eb',
                    height: 90,
                    paddingTop: 10,
                    paddingBottom: 30,
                },
                tabBarActiveTintColor: '#00D9FF',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="Scanner"
                component={ScannerScreen}
                options={{
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
                        <View className="items-center justify-center gap-1 w-16">
                            <View className={`p-2 rounded-xl ${focused ? 'bg-[#00D9FF]/10' : 'bg-transparent'}`}>
                                <Camera size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            </View>
                            <Text style={{ color, fontSize: 10, fontWeight: '500' }}>Scanner</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Results"
                component={ResultsScreen}
                listeners={{
                    tabPress: (e: any) => {
                        if (!currentProducts || currentProducts.length === 0) {
                            // e.preventDefault(); 
                        }
                    },
                }}
                options={{
                    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
                        <View className="items-center justify-center gap-1 w-16">
                            <View className={`p-2 rounded-xl ${focused ? 'bg-[#00D9FF]/10' : 'bg-transparent'}`}>
                                <ShoppingBag size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            </View>
                            <Text style={{ color, fontSize: 10, fontWeight: '500' }}>Shop</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Closet"
                component={ClosetScreen}
                options={{
                    tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
                        <View className="items-center justify-center gap-1 w-16">
                            <View className={`p-2 rounded-xl ${focused ? 'bg-[#00D9FF]/10' : 'bg-transparent'}`}>
                                <Sparkles size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                            </View>
                            <Text style={{ color, fontSize: 10, fontWeight: '500' }}>Closet</Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export const AppNavigator = () => {
    const { onboardingCompleted } = useAppStore();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!onboardingCompleted && (
                <Stack.Screen
                    name="Onboarding"
                    component={OnboardingScreen}
                    options={{ animation: 'fade' }}
                />
            )}
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
                name="TryOn"
                component={TryOnScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack.Navigator>
    );
};

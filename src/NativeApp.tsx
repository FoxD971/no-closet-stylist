import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './navigation/AppNavigator';
import { verifyInstallation } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

// Verify NativeWind is working
verifyInstallation();

export default function NativeApp() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" backgroundColor="#000" />
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

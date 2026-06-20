import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function IndexScreen() {
    const router = useRouter();

    const isHydrated = useSelector(
        (state: RootState) => state.user._persist?.rehydrated
    );

    const goal = useSelector(
        (state: RootState) => state.user.goal
    );

    useEffect(() => {
        if (!isHydrated) return;

        if (!goal) {
            router.replace('/onboarding/goal');
        } else {
            router.replace('/(tabs)/home');
        }
    }, [isHydrated, goal, router]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    );
}

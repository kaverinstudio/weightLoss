import {Stack} from 'expo-router';
import {Provider} from 'react-redux';
import {persistor, store} from '@/store';
import {PersistGate} from 'redux-persist/integration/react';
import {useEffect} from "react";
import {AppState} from "react-native";
import {useAppDispatch} from "@/store/hooks";
import {checkNewDay} from "@/store/userSlice";
import {getMsUntilNextLocalDay} from "@/utils/date";

function DayBoundary() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const scheduleNextCheck = () => {
            timeoutId = setTimeout(() => {
                dispatch(checkNewDay());
                scheduleNextCheck();
            }, getMsUntilNextLocalDay());
        };

        dispatch(checkNewDay());
        scheduleNextCheck();

        const subscription = AppState.addEventListener('change', status => {
            if (status === 'active') {
                dispatch(checkNewDay());
            }
        });

        return () => {
            clearTimeout(timeoutId);
            subscription.remove();
        };
    }, [dispatch]);

    return null;
}

export default function RootLayout() {

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <DayBoundary/>
                <Stack screenOptions={{headerShown: false}}>
                    <Stack.Screen name="onboarding"/>
                    <Stack.Screen name="(tabs)"/>
                </Stack>
            </PersistGate>
        </Provider>
    );
}

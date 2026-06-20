import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './userSlice';

const userPersistConfig = {
    key: 'user',
    storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(
    userPersistConfig,
    userReducer
);

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { AppleTheme } from '@/constants/appleTheme';
import { RootState } from '@/store';
import { finishDay } from '@/store/userSlice';

export default function NextActionButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    const meals = useSelector((state: RootState) => state.user.meals);
    const targetCalories = useSelector(
        (state: RootState) => state.user.targetCalories
    );
    const daySaved = useSelector(
        (state: RootState) => state.user.daySaved
    );

    if (!targetCalories) return null;

    if (meals.length === 0) {
        return (
            <Pressable
                style={styles.button}
                onPress={() => router.push('/add-meal')}
            >
                <Ionicons name="restaurant-outline" size={20} color={AppleTheme.accentText} />
                <Text style={styles.text}>Добавить первый приём пищи</Text>
            </Pressable>
        );
    }

    return (
        <Pressable
            style={[styles.finishButton, daySaved && styles.finishButtonSaved]}
            onPress={() => dispatch(finishDay())}
        >
            <Ionicons
                name={daySaved ? 'checkmark-circle' : 'flag-outline'}
                size={22}
                color={daySaved ? AppleTheme.accentText : AppleTheme.text}
            />
            <Text style={styles.finishTitle}>
                {daySaved ? 'День сохранён' : 'Подвести итог дня'}
            </Text>
            <Text style={styles.finishSubtitle}>
                {daySaved ? 'История уже обновлена' : 'Сохраните день в историю питания'}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        backgroundColor: AppleTheme.accentSoft,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    text: {
        fontSize: 15,
        fontWeight: '700',
        color: AppleTheme.accentText,
    },
    finishButton: {
        marginTop: 12,
        backgroundColor: AppleTheme.card,
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 18,
        alignItems: 'center',
        ...AppleTheme.shadow,
    },
    finishButtonSaved: {
        backgroundColor: AppleTheme.accentSoft,
    },
    finishTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: AppleTheme.text,
        marginTop: 6,
    },
    finishSubtitle: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        marginTop: 4,
    },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppleTheme } from '@/constants/appleTheme';
import { useAppSelector } from '@/store/hooks';

export default function ResultScreen() {
    const { targetCalories } = useAppSelector(state => state.user);

    function handleStart() {
        router.replace('/(tabs)/home');
    }

    if (!targetCalories) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <Ionicons name="checkmark-circle-outline" size={36} color={AppleTheme.accentText} />
                </View>

                <Text style={styles.title}>Ваша дневная норма</Text>
                <Text style={styles.calories}>{targetCalories} ккал</Text>

                <Text style={styles.subtitle}>
                    Это ориентир на день. Небольшие колебания нормальны: важнее общий ритм и регулярность.
                </Text>

                <View style={styles.infoBlock}>
                    <Text style={styles.infoText}>Подходит для обычной домашней еды</Text>
                    <Text style={styles.infoText}>Без жёстких запретов и сложных диет</Text>
                    <Text style={styles.infoText}>История и прогресс помогут видеть динамику</Text>
                </View>
            </View>

            <Pressable style={styles.button} onPress={handleStart}>
                <Text style={styles.buttonText}>Перейти к дневнику</Text>
                <Ionicons name="arrow-forward-circle" size={21} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 72,
        justifyContent: 'space-between',
        backgroundColor: AppleTheme.background,
    },
    content: {
        backgroundColor: AppleTheme.card,
        borderRadius: 24,
        padding: 22,
        ...AppleTheme.shadow,
    },
    iconWrap: {
        width: 62,
        height: 62,
        borderRadius: 22,
        backgroundColor: AppleTheme.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        color: AppleTheme.secondaryText,
    },
    calories: {
        fontSize: 48,
        lineHeight: 54,
        fontWeight: '800',
        marginBottom: 16,
        color: AppleTheme.text,
    },
    subtitle: {
        fontSize: 16,
        color: AppleTheme.secondaryText,
        lineHeight: 23,
        marginBottom: 24,
    },
    infoBlock: {
        gap: 10,
    },
    infoText: {
        fontSize: 15,
        color: AppleTheme.text,
        lineHeight: 21,
        fontWeight: '600',
    },
    button: {
        backgroundColor: AppleTheme.darkButton,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },
});

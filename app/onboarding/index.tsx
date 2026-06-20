import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppleTheme } from '@/constants/appleTheme';

export default function OnboardingHeroScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconWrap}>
                    <Ionicons name="leaf-outline" size={34} color={AppleTheme.accentText} />
                </View>
                <Text style={styles.title}>
                    Похудение на обычной домашней еде
                </Text>

                <Text style={styles.subtitle}>
                    Без жёстких диет и сложных правил. Считаем норму, записываем приёмы пищи и смотрим динамику.
                </Text>
            </View>

            <Pressable
                style={styles.button}
                onPress={() => router.push('/onboarding/goal')}
            >
                <Text style={styles.buttonText}>Начать</Text>
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
        fontSize: 32,
        fontWeight: '800',
        lineHeight: 38,
        marginBottom: 16,
        color: AppleTheme.text,
    },
    subtitle: {
        fontSize: 16,
        color: AppleTheme.secondaryText,
        lineHeight: 23,
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

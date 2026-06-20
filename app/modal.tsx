import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppleTheme } from '@/constants/appleTheme';

export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Дополнительный экран</Text>
                <Link href="/" dismissTo style={styles.link}>
                    Вернуться на главную
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: AppleTheme.background,
    },
    card: {
        width: '100%',
        backgroundColor: AppleTheme.card,
        borderRadius: 22,
        padding: 20,
        alignItems: 'center',
        ...AppleTheme.shadow,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 12,
    },
    link: {
        color: AppleTheme.accentText,
        fontSize: 15,
        fontWeight: '800',
        paddingVertical: 10,
    },
});

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppleTheme } from '@/constants/appleTheme';

export default function DiaryScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Ionicons name="book-outline" size={28} color={AppleTheme.tertiaryText} />
                <Text style={styles.title}>Дневник объединён с экраном Сегодня</Text>
                <Text style={styles.text}>
                    Приёмы пищи, дневная норма и итог дня теперь находятся на главном экране.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 56,
        backgroundColor: AppleTheme.background,
        flexGrow: 1,
    },
    card: {
        backgroundColor: AppleTheme.card,
        borderRadius: 22,
        padding: 20,
        gap: 10,
        ...AppleTheme.shadow,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    text: {
        fontSize: 14,
        lineHeight: 21,
        color: AppleTheme.secondaryText,
    },
});

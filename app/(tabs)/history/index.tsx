import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { AppleTheme } from '@/constants/appleTheme';
import DayHistoryCard from '@/components/DayHistoryCard';
import { RootState } from '@/store';

export default function HistoryScreen() {
    const history = useSelector(
        (state: RootState) => state.user.history
    );
    const uniqueHistory = Array.from(
        new Map(history.map(day => [day.date, day])).values()
    ).sort((a, b) => b.date.localeCompare(a.date));

    if (uniqueHistory.length === 0) {
        return (
            <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="calendar-outline" size={28} color={AppleTheme.tertiaryText} />
                </View>
                <Text style={styles.emptyTitle}>История пока пустая</Text>
                <Text style={styles.emptyText}>
                    Завершите первый день, и здесь появится история питания.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={uniqueHistory}
            keyExtractor={item => item.date}
            contentContainerStyle={styles.list}
            ListHeaderComponent={<Text style={styles.title}>История</Text>}
            renderItem={({ item }) => (
                <DayHistoryCard day={item} />
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 24,
        paddingTop: 56,
        backgroundColor: AppleTheme.background,
        flexGrow: 1,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 18,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: AppleTheme.background,
    },
    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 20,
        backgroundColor: AppleTheme.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...AppleTheme.shadow,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
        color: AppleTheme.text,
    },
    emptyText: {
        fontSize: 14,
        color: AppleTheme.secondaryText,
        textAlign: 'center',
        lineHeight: 20,
    },
});

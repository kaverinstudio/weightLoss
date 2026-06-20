import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppleTheme } from '@/constants/appleTheme';
import { DayHistory } from '@/store/userSlice';

type Props = {
    day: DayHistory;
};

const formatDate = (date: string) => {
    const d = new Date(date);

    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
};

const getStatus = (diff: number) => {
    if (diff >= 0) {
        return {
            text: 'В норме',
            color: AppleTheme.accentText,
            backgroundColor: AppleTheme.accentSoft,
        };
    }

    if (diff >= -300) {
        return {
            text: 'Небольшой перебор',
            color: AppleTheme.warningText,
            backgroundColor: AppleTheme.warningSoft,
        };
    }

    return {
        text: 'Перебор',
        color: AppleTheme.danger,
        backgroundColor: AppleTheme.dangerSoft,
    };
};

export default function DayHistoryCard({ day }: Props) {
    const { date, totalCalories, targetCalories, diff } = day;
    const status = getStatus(diff);

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: '/history/[date]',
                    params: { date: day.date },
                })
            }
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.header}>
                <Text style={styles.date}>{formatDate(date)}</Text>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={AppleTheme.tertiaryText}
                />
            </View>

            <Text style={styles.calories}>
                {totalCalories} ккал из {targetCalories}
            </Text>

            <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
                <Text style={[styles.statusText, { color: status.color }]}>
                    {status.text}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: AppleTheme.card,
        borderRadius: 18,
        padding: 18,
        marginBottom: 12,
        ...AppleTheme.shadow,
    },
    cardPressed: {
        opacity: 0.72,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    date: {
        fontSize: 16,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    calories: {
        fontSize: 14,
        color: AppleTheme.secondaryText,
        marginBottom: 10,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
});

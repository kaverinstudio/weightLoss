import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { AppleTheme } from '@/constants/appleTheme';
import DayExplanation from '@/components/DayExplanation';
import { RootState } from '@/store';

const formatDate = (date: string) => {
    const d = new Date(date);

    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
};

const getStatusColors = (diff: number) => {
    if (diff >= 0) {
        return {
            color: AppleTheme.accentText,
            backgroundColor: AppleTheme.accentSoft,
        };
    }

    if (diff >= -300) {
        return {
            color: AppleTheme.warningText,
            backgroundColor: AppleTheme.warningSoft,
        };
    }

    return {
        color: AppleTheme.danger,
        backgroundColor: AppleTheme.dangerSoft,
    };
};

export default function DayDetailsScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const day = useSelector((state: RootState) =>
        state.user.history.find(item => item.date === date)
    );

    if (!day) {
        return (
            <View style={styles.center}>
                <Text style={styles.notFound}>День не найден</Text>
            </View>
        );
    }

    const { meals, totalCalories, targetCalories, diff } = day;
    const statusColors = getStatusColors(diff);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Pressable style={styles.backButton} onPress={() => router.replace('/history')}>
                <Ionicons name="chevron-back" size={18} color={AppleTheme.accentText} />
                <Text style={styles.backText}>История</Text>
            </Pressable>

            <Text style={styles.date}>{formatDate(day.date)}</Text>

            <View style={[styles.summary, { backgroundColor: statusColors.backgroundColor }]}>
                <Text style={[styles.summaryCalories, { color: statusColors.color }]}>
                    {totalCalories} ккал
                </Text>
                <Text style={styles.summaryTarget}>из {targetCalories} ккал</Text>
                <Text style={[styles.summaryDiff, { color: statusColors.color }]}>
                    {diff >= 0
                        ? `Осталось ${diff} ккал`
                        : `Перебор ${Math.abs(diff)} ккал`}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Приёмы пищи</Text>

            {meals.map(meal => (
                <View key={meal.id} style={styles.mealItem}>
                    <View style={styles.mealIcon}>
                        <Ionicons name="restaurant-outline" size={18} color={AppleTheme.tertiaryText} />
                    </View>
                    <View style={styles.mealText}>
                        <Text style={styles.mealTitle}>{meal.title}</Text>
                        <Text style={styles.mealCalories}>
                            {meal.calories} ккал
                        </Text>
                    </View>
                </View>
            ))}

            <DayExplanation diff={diff} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 56,
        paddingBottom: 40,
        backgroundColor: AppleTheme.background,
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppleTheme.background,
    },
    notFound: {
        fontSize: 17,
        fontWeight: '700',
        color: AppleTheme.secondaryText,
    },
    date: {
        fontSize: 30,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 18,
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: AppleTheme.card,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginBottom: 18,
        ...AppleTheme.shadow,
    },
    backText: {
        fontSize: 14,
        color: AppleTheme.accentText,
        fontWeight: '800',
    },
    summary: {
        borderRadius: 22,
        padding: 20,
        marginBottom: 24,
        ...AppleTheme.shadow,
    },
    summaryCalories: {
        fontSize: 38,
        lineHeight: 44,
        fontWeight: '800',
    },
    summaryTarget: {
        fontSize: 14,
        color: AppleTheme.secondaryText,
        fontWeight: '700',
        marginTop: 2,
    },
    summaryDiff: {
        fontSize: 14,
        marginTop: 10,
        fontWeight: '800',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 10,
    },
    mealItem: {
        backgroundColor: AppleTheme.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        ...AppleTheme.shadow,
    },
    mealIcon: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: AppleTheme.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealText: {
        flex: 1,
    },
    mealTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: AppleTheme.text,
    },
    mealCalories: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        marginTop: 4,
    },
});

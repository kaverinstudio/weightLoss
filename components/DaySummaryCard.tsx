import { StyleSheet, Text, View } from 'react-native';
import { AppleTheme } from '@/constants/appleTheme';
import { useAppSelector } from '@/store/hooks';

const DaySummaryCard = () => {
    const { targetCalories, meals } = useAppSelector(state => state.user);

    const consumedCalories = meals.reduce(
        (sum, meal) => sum + meal.calories,
        0
    );
    const remainingCalories = (targetCalories ?? 0) - consumedCalories;
    const status =
        remainingCalories >= 0
            ? {
                label: 'В норме',
                color: AppleTheme.accentText,
                backgroundColor: AppleTheme.accentSoft,
            }
            : remainingCalories >= -300
                ? {
                    label: 'Небольшой перебор',
                    color: AppleTheme.warningText,
                    backgroundColor: AppleTheme.warningSoft,
                }
                : {
                    label: 'Перебор',
                    color: AppleTheme.danger,
                    backgroundColor: AppleTheme.dangerSoft,
                };

    return (
        <>
            <Text style={styles.title}>Сегодня</Text>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.label}>Осталось</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>
                            {status.label}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.remaining, { color: status.color }]}>
                    {remainingCalories} ккал
                </Text>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.smallLabel}>Норма</Text>
                        <Text style={styles.smallValue}>
                            {targetCalories ?? 0} ккал
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.smallLabel}>Съедено</Text>
                        <Text style={styles.smallValue}>
                            {consumedCalories} ккал
                        </Text>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 18,
    },
    card: {
        backgroundColor: AppleTheme.card,
        borderRadius: 22,
        padding: 20,
        marginBottom: 24,
        ...AppleTheme.shadow,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        fontWeight: '700',
    },
    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
    },
    remaining: {
        fontSize: 42,
        lineHeight: 48,
        fontWeight: '800',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallLabel: {
        fontSize: 13,
        color: AppleTheme.tertiaryText,
        marginBottom: 4,
    },
    smallValue: {
        fontSize: 16,
        fontWeight: '700',
        color: AppleTheme.text,
    },
});

export default DaySummaryCard;

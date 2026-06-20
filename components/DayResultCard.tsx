import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AppleTheme } from '@/constants/appleTheme';
import { RootState } from '@/store';

const getResultMeta = (diff: number) => {
    if (diff >= 0) {
        return {
            title: 'День идет по плану',
            description: 'Вы укладываетесь в дневную норму. Можно спокойно продолжать в том же темпе.',
            color: AppleTheme.accentText,
            backgroundColor: AppleTheme.accentSoft,
        };
    }

    if (diff >= -300) {
        return {
            title: 'Небольшой перебор',
            description: 'Это нормально. Чаще всего на это влияют порции или небольшие перекусы в течение дня.',
            color: AppleTheme.warningText,
            backgroundColor: AppleTheme.warningSoft,
        };
    }

    return {
        title: 'Калорий больше нормы',
        description: 'Такое бывает. Посмотрите, какой прием пищи дал основной вклад, и завтра будет проще скорректировать день.',
        color: AppleTheme.danger,
        backgroundColor: AppleTheme.dangerSoft,
    };
};

export default function DayResultCard() {
    const meals = useSelector((state: RootState) => state.user.meals);
    const targetCalories = useSelector(
        (state: RootState) => state.user.targetCalories
    );

    if (!targetCalories || meals.length === 0) {
        return null;
    }

    const totalCalories = meals.reduce(
        (sum, meal) => sum + meal.calories,
        0
    );
    const diff = targetCalories - totalCalories;
    const meta = getResultMeta(diff);

    return (
        <View style={[styles.card, { backgroundColor: meta.backgroundColor }]}>
            <Text style={[styles.title, { color: meta.color }]}>{meta.title}</Text>
            <Text style={styles.text}>{meta.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 18,
        marginTop: 16,
        ...AppleTheme.shadow,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        lineHeight: 21,
        color: AppleTheme.secondaryText,
    },
});

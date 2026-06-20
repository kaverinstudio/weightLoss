import { StyleSheet, Text, View } from 'react-native';
import { AppleTheme } from '@/constants/appleTheme';

const getExplanation = (diff: number) => {
    if (diff >= 0) {
        return {
            title: 'День сбалансирован',
            text: 'Вы укладываетесь в дневную норму. Регулярные приёмы пищи и домашняя еда помогают сохранять спокойный баланс.',
            backgroundColor: AppleTheme.accentSoft,
            color: AppleTheme.accentText,
        };
    }

    if (diff >= -300) {
        return {
            title: 'Небольшой перебор',
            text: 'Сегодня калорий было немного больше, чем запланировано. Чаще всего это связано с порциями или перекусами.',
            backgroundColor: AppleTheme.warningSoft,
            color: AppleTheme.warningText,
        };
    }

    return {
        title: 'Калорий больше нормы',
        text: 'Такое бывает. На результат могли повлиять поздний приём пищи, сладкое, выпечка или пропуск основного приёма еды.',
        backgroundColor: AppleTheme.dangerSoft,
        color: AppleTheme.danger,
    };
};

export default function DayExplanation({ diff }: { diff: number }) {
    const explanation = getExplanation(diff);

    return (
        <View style={[styles.card, { backgroundColor: explanation.backgroundColor }]}>
            <Text style={[styles.title, { color: explanation.color }]}>
                {explanation.title}
            </Text>
            <Text style={styles.text}>{explanation.text}</Text>
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

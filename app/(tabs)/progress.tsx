import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, {
    Circle,
    Defs,
    Line,
    LinearGradient,
    Path,
    Stop,
} from 'react-native-svg';
import { AppleTheme } from '@/constants/appleTheme';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { DayHistory } from '@/store/userSlice';

const CHART_HEIGHT = 176;
const CHART_PADDING = 22;

type ChartPoint = {
    x: number;
    y: number;
};

const formatDateLabel = (date: string) =>
    date.slice(5).split('-').reverse().join('.');

const buildSmoothPath = (points: ChartPoint[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    return points.reduce((path, point, index) => {
        if (index === 0) {
            return `M ${point.x} ${point.y}`;
        }

        const previous = points[index - 1];
        const controlOffset = (point.x - previous.x) * 0.45;

        return `${path} C ${previous.x + controlOffset} ${previous.y}, ${point.x - controlOffset} ${point.y}, ${point.x} ${point.y}`;
    }, '');
};

const getLineColor = (averageCalories: number, averageTarget: number) => {
    const diff = averageCalories - averageTarget;

    if (diff <= 100) return AppleTheme.accent;
    if (diff <= 300) return AppleTheme.warning;

    return AppleTheme.danger;
};

const getProgressSummary = (days: DayHistory[]) => {
    const totalCalories = days.reduce((sum, day) => sum + day.totalCalories, 0);
    const totalTarget = days.reduce((sum, day) => sum + day.targetCalories, 0);
    const averageCalories = Math.round(totalCalories / days.length);
    const averageTarget = Math.round(totalTarget / days.length);
    const daysInRange = days.filter(day => day.diff >= -100).length;

    return {
        averageCalories,
        averageTarget,
        daysInRange,
        lineColor: getLineColor(averageCalories, averageTarget),
    };
};

export default function ProgressScreen() {
    const { width } = useWindowDimensions();
    const history = useSelector((state: RootState) => state.user.history);

    const uniqueDays = Array.from(
        new Map(history.map(day => [day.date, day])).values()
    );
    const lastDays = uniqueDays
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

    if (lastDays.length < 2) {
        return (
            <View style={styles.emptyWrap}>
                <Text style={styles.emptyTitle}>Пока мало данных</Text>
                <Text style={styles.emptyText}>
                    Завершите хотя бы два дня, чтобы увидеть динамику.
                </Text>
            </View>
        );
    }

    const chartWidth = Math.max(width - 80, 280);
    const graphWidth = chartWidth - CHART_PADDING * 2;
    const graphHeight = CHART_HEIGHT - CHART_PADDING * 2;
    const values = lastDays.flatMap(day => [day.totalCalories, day.targetCalories]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = Math.max(maxValue - minValue, 1);
    const yForValue = (value: number) =>
        CHART_PADDING + graphHeight - ((value - minValue) / range) * graphHeight;
    const points = lastDays.map((day, index) => ({
        x: CHART_PADDING + (graphWidth / (lastDays.length - 1)) * index,
        y: yForValue(day.totalCalories),
    }));
    const linePath = buildSmoothPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${CHART_HEIGHT - CHART_PADDING} L ${points[0].x} ${CHART_HEIGHT - CHART_PADDING} Z`;
    const targetY = yForValue(
        Math.round(
            lastDays.reduce((sum, day) => sum + day.targetCalories, 0) / lastDays.length
        )
    );
    const latestDay = lastDays[lastDays.length - 1];
    const { averageCalories, averageTarget, daysInRange, lineColor } =
        getProgressSummary(lastDays);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.screenTitle}>Прогресс</Text>

            <View style={styles.card}>
                <Text style={styles.cardLabel}>Среднее за 7 дней</Text>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.averageValue}>
                            {averageCalories.toLocaleString('ru-RU')}
                        </Text>
                        <Text style={styles.averageUnit}>ккал в день</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {daysInRange}/{lastDays.length} в норме
                        </Text>
                    </View>
                </View>

                <View style={styles.chartFrame}>
                    <Svg width={chartWidth} height={CHART_HEIGHT}>
                        <Defs>
                            <LinearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                                <Stop offset="0" stopColor={lineColor} stopOpacity="0.22" />
                                <Stop offset="1" stopColor={lineColor} stopOpacity="0" />
                            </LinearGradient>
                        </Defs>

                        <Line
                            x1={CHART_PADDING}
                            y1={targetY}
                            x2={chartWidth - CHART_PADDING}
                            y2={targetY}
                            stroke={AppleTheme.tertiaryText}
                            strokeDasharray="5 7"
                            strokeOpacity="0.38"
                            strokeWidth={1.5}
                        />
                        <Path d={areaPath} fill="url(#caloriesGradient)" />
                        <Path
                            d={linePath}
                            fill="none"
                            stroke={lineColor}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={4}
                        />
                        <Circle
                            cx={points[points.length - 1].x}
                            cy={points[points.length - 1].y}
                            r={5}
                            fill="#FFFFFF"
                            stroke={lineColor}
                            strokeWidth={3}
                        />
                    </Svg>

                    <View style={[styles.labelsRow, { width: chartWidth }]}>
                        {lastDays.map(day => (
                            <Text key={day.date} style={styles.dateLabel}>
                                {formatDateLabel(day.date)}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Цель</Text>
                        <Text style={styles.statValue}>
                            {averageTarget.toLocaleString('ru-RU')}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Последний день</Text>
                        <Text style={styles.statValue}>
                            {latestDay.totalCalories.toLocaleString('ru-RU')}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Отклонение</Text>
                        <Text
                            style={[
                                styles.statValue,
                                latestDay.diff < -100 && styles.statValueWarning,
                            ]}
                        >
                            {latestDay.diff >= 0 ? '-' : '+'}
                            {Math.abs(latestDay.diff).toLocaleString('ru-RU')}
                        </Text>
                    </View>
                </View>
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
    screenTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 18,
    },
    emptyWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: AppleTheme.background,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: AppleTheme.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: AppleTheme.secondaryText,
        textAlign: 'center',
        lineHeight: 20,
    },
    card: {
        backgroundColor: AppleTheme.card,
        borderRadius: 22,
        padding: 20,
        ...AppleTheme.shadow,
    },
    cardLabel: {
        fontSize: 13,
        color: AppleTheme.secondaryText,
        fontWeight: '700',
        marginBottom: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
    },
    averageValue: {
        fontSize: 42,
        lineHeight: 48,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    averageUnit: {
        fontSize: 14,
        color: AppleTheme.secondaryText,
        marginTop: 2,
    },
    badge: {
        backgroundColor: AppleTheme.accentSoft,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    badgeText: {
        color: AppleTheme.accentText,
        fontSize: 13,
        fontWeight: '800',
    },
    chartFrame: {
        marginTop: 22,
        alignItems: 'center',
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: CHART_PADDING - 2,
        marginTop: 2,
    },
    dateLabel: {
        color: AppleTheme.tertiaryText,
        fontSize: 11,
        fontWeight: '600',
    },
    statsRow: {
        marginTop: 22,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: AppleTheme.separator,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: AppleTheme.tertiaryText,
        marginBottom: 5,
        fontWeight: '700',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: AppleTheme.text,
    },
    statValueWarning: {
        color: AppleTheme.danger,
    },
});

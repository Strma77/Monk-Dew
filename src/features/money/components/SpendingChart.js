import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Svg, Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors, spacing } from '../../../shared/theme';

const CHART_HEIGHT = 90;
const PAD_LEFT    = 32;
const PAD_RIGHT   = 8;
const PAD_TOP     = 6;
const PAD_BOTTOM  = 18;

const SpendingChart = ({ transactions, month, year }) => {
    const { width } = useWindowDimensions();
    const chartWidth = width - spacing.md * 4;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthStr    = `${year}-${String(month + 1).padStart(2, '0')}`;

    const dailySpend = {};
    for (const t of transactions) {
        if (t.type !== 'expense' || !t.date.startsWith(monthStr)) continue;
        const day = parseInt(t.date.split('-')[2]);
        dailySpend[day] = (dailySpend[day] || 0) + t.amount;
    }

    const maxSpend   = Math.max(...Object.values(dailySpend), 1);
    const innerW     = chartWidth - PAD_LEFT - PAD_RIGHT;
    const innerH     = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
    const barW       = Math.max(2, innerW / daysInMonth - 1);
    const xFor       = (day) => PAD_LEFT + ((day - 1) / daysInMonth) * innerW;
    const barH       = (amt) => (amt / maxSpend) * innerH;
    const maxLabel   = maxSpend >= 1000 ? `${(maxSpend / 1000).toFixed(1)}k` : Math.round(maxSpend).toString();

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={CHART_HEIGHT}>
                <Line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + innerH}
                    stroke={colors.borderColor} strokeWidth={1} />
                <Line x1={PAD_LEFT} y1={PAD_TOP + innerH} x2={PAD_LEFT + innerW} y2={PAD_TOP + innerH}
                    stroke={colors.borderColor} strokeWidth={1} />

                <SvgText x={PAD_LEFT - 3} y={PAD_TOP + 5}
                    fill={colors.textSecondary} fontSize={8} textAnchor="end">{maxLabel}</SvgText>
                <SvgText x={PAD_LEFT - 3} y={PAD_TOP + innerH}
                    fill={colors.textSecondary} fontSize={8} textAnchor="end">0</SvgText>

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const amt = dailySpend[day] || 0;
                    if (amt === 0) return null;
                    const h = barH(amt);
                    return (
                        <Rect
                            key={day}
                            x={xFor(day)}
                            y={PAD_TOP + innerH - h}
                            width={barW}
                            height={h}
                            fill={colors.expenseColor}
                            rx={1}
                        />
                    );
                })}

                {[1, 8, 15, 22, daysInMonth].map(day => (
                    <SvgText
                        key={day}
                        x={xFor(day) + barW / 2}
                        y={PAD_TOP + innerH + 12}
                        fill={colors.textSecondary}
                        fontSize={8}
                        textAnchor="middle"
                    >{day}</SvgText>
                ))}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.sm,
    },
});

export default SpendingChart;

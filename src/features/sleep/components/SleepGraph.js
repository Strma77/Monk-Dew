import React from "react";
import Svg, { Line, Circle, Polyline, Text as SvgText } from "react-native-svg";
import { View, useWindowDimensions } from "react-native";

const GRAPH_HEIGHT = 300;
const PADDING_LEFT = 30;
const PADDING_BOTTOM = 20;

const SleepGraph = ({ entries, currentMonth, currentYear }) => {
  const { width } = useWindowDimensions();
  const graphWidth = width - 32;
  const plotWidth = graphWidth - PADDING_LEFT;
  const plotHeight = GRAPH_HEIGHT - PADDING_BOTTOM;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthEntries = entries
    .filter((e) => {
      const [y, m] = e.date.split("-");
      return parseInt(m) === currentMonth + 1 && parseInt(y) === currentYear;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const points = monthEntries.map((e) => {
    const day = parseInt(e.date.split("-")[2]);
    const totalHours = e.hours + e.minutes / 60;
    const x = PADDING_LEFT + (day / daysInMonth) * plotWidth;
    const y = ((totalHours - 4) / 6) * plotHeight;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <View style={{ marginHorizontal: 16 }}>
      <Svg width={graphWidth} height={GRAPH_HEIGHT}>
        {/* Y-axis labels + horizontal grid lines */}
        {[4, 5, 6, 7, 8, 9, 10].map((hour) => {
          const y = ((hour - 4) / 6) * plotHeight;
          return (
            <React.Fragment key={hour}>
              <Line
                x1={PADDING_LEFT}
                y1={y}
                x2={graphWidth}
                y2={y}
                stroke="#444"
                strokeWidth={1}
              />
              <SvgText
                x={PADDING_LEFT - 4}
                y={y + 4}
                fontSize={10}
                fill="#888"
                textAnchor="end"
              >
                {hour}h
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* X-axis labels + vertical grid lines */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const x = PADDING_LEFT + (day / daysInMonth) * plotWidth;
          const showLabel = day === 1 || day % 5 === 0;
          return (
            <React.Fragment key={day}>
              <Line
                x1={x}
                y1={0}
                x2={x}
                y2={plotHeight}
                stroke="#444"
                strokeWidth={1}
              />
              {showLabel && (
                <SvgText
                  x={x}
                  y={GRAPH_HEIGHT - 4}
                  fontSize={10}
                  fill="#888"
                  textAnchor="middle"
                >
                  {day}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}

        {/* Data */}
        {points.length > 1 && (
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke="#00d09f"
            strokeWidth={2}
          />
        )}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill="#00d09f" />
        ))}
      </Svg>
    </View>
  );
};

export default SleepGraph;

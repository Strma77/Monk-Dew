import Svg, { Line, Circle, Polyline, Text as SvgText } from "react-native-svg";
import { View } from "react-native";

const SleepGraph = ({ entries, currentMonth, currentYear }) => {
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
    const x = (day / daysInMonth) * 300;
    const y = ((totalHours - 4) / 6) * 300;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <View>
      <Svg width={300} height={300}>
        {[4, 5, 6, 7, 8, 9, 10].map((hour) => {
          const y = ((hour - 4) / 6) * 300;
          return (
            <Line
              key={hour}
              x1={0}
              y1={y}
              x2={300}
              y2={y}
              stroke="#444"
              strokeWidth={1}
            />
          );
        })}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const x = (day / daysInMonth) * 300;
          return (
            <Line
              key={day}
              x1={x}
              y1={0}
              x2={x}
              y2={300}
              stroke="#444"
              strokeWidth={1}
            />
          );
        })}
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
import { Colors } from "src/utils/colors";

export const getColorFromIndex = (index: number) => {
  const colors = [
    Colors.purple600,
    Colors.green600,
    Colors.red,
    Colors.yellow700,
    Colors.blue600,
  ];
  if (index >= colors.length) {
    return `rgba(0,0,0,${Math.min(Math.max(0.4, 0.4 + index / 22), 1)})`;
  }
  return colors[index];
};

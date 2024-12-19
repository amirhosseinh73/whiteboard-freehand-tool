export const getRandomColor = function () {
  const COLORS = [
    "red",
    "yellow",
    "khaki",
    "cyan",
    "blue",
    "darkgray",
    "black",
    "violet",
  ];

  const rand = Math.floor(Math.random() * COLORS.length);

  return COLORS[rand];
};

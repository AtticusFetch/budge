export const addOpacityToColor = (colorName, opacity) =>
  colors[colorName].replace(')', `, ${opacity})`).replace('rgb', 'rgba');

export const colors = {
  orange: 'rgb(254, 138, 113)',
  grey: 'rgb(74, 78, 77)',
  blue: 'rgb(14, 154, 167)',
  lightBlue: 'rgb(61, 164, 171)',
  yellow: 'rgb(246, 205, 97)',
  red: 'rgb(255, 111, 105)',
  rouge: 'rgb(255, 32, 78)',
  green: 'rgb(0, 169, 85)',
  purple: 'rgb(76, 47, 111)',
  beige: 'rgb(217, 215, 194)',
  lightPink: 'rgb(247, 198, 194)',
  pink: 'rgb(255, 62, 165)',
  mint: 'rgb(180, 248, 200)',
  brown: 'rgb(164, 92, 64)',
  coffeePot: 'rgb(103, 89, 94)',
  seeThrough: {
    orange: 'rgba(254, 138, 113, 0.1)',
    grey: 'rgba(74, 78, 77, 0.1)',
    blue: 'rgba(14, 154, 167, 0.1)',
    lightBlue: 'rgba(61, 164, 171, 0.1)',
    yellow: 'rgba(246, 205, 97, 0.1)',
    red: 'rgba(255, 111, 105, 0.1)',
    rouge: 'rgba(255, 32, 78, 0.1)',
    green: 'rgba(136, 216, 176, 0.1)',
    purple: 'rgba(76, 47, 111, 0.1)',
    beige: 'rgba(217, 215, 194, 0.1)',
    lightPink: 'rgba(247, 198, 194, 0.1)',
    pink: 'rgba(255, 62, 165, 0.1)',
  },
  dimmed: {
    orange: 'rgba(254, 138, 113, 0.5)',
    grey: 'rgba(74, 78, 77, 0.5)',
    blue: 'rgba(14, 154, 167, 0.5)',
    lightBlue: 'rgba(61, 164, 171, 0.5)',
    yellow: 'rgba(246, 205, 97, 0.5)',
    red: 'rgba(255, 111, 105, 0.5)',
    rouge: 'rgba(255, 32, 78, 0.5)',
    green: 'rgba(136, 216, 176, 0.5)',
    purple: 'rgba(76, 47, 111, 0.5)',
    beige: 'rgba(217, 215, 194, 0.5)',
    lightPink: 'rgba(247, 198, 194, 0.5)',
    pink: 'rgba(255, 62, 165, 0.5)',
  },
};

export const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

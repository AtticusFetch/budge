export const colors = {
  orange: 'rgb(254, 138, 113)',
  grey: 'rgb(74, 78, 77)',
  blue: 'rgb(14, 154, 167)',
  lightBlue: 'rgb(61, 164, 171)',
  yellow: 'rgb(246, 205, 97)',
  red: 'rgb(255, 111, 105)',
  green: 'rgb(0, 169, 85)',
  seeThrough: {
    orange: 'rgba(254, 138, 113, 0.1)',
    grey: 'rgba(74, 78, 77, 0.1)',
    blue: 'rgba(14, 154, 167, 0.1)',
    lightBlue: 'rgba(61, 164, 171, 0.1)',
    yellow: 'rgba(246, 205, 97, 0.1)',
    red: 'rgba(255, 111, 105, 0.1)',
    green: 'rgba(136, 216, 176, 0.1)',
  },
  dimmed: {
    orange: 'rgba(254, 138, 113, 0.5)',
    grey: 'rgba(74, 78, 77, 0.5)',
    blue: 'rgba(14, 154, 167, 0.5)',
    lightBlue: 'rgba(61, 164, 171, 0.5)',
    yellow: 'rgba(246, 205, 97, 0.5)',
    red: 'rgba(255, 111, 105, 0.5)',
    green: 'rgba(136, 216, 176, 0.5)',
  },
};

export const addOpacityToColor = (colorName, opacity) =>
  colors[colorName].replace(')', `, ${opacity})`).replace('rgb', 'rgba');

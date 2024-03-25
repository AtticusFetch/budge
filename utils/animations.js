import { LayoutAnimation } from 'react-native';

export const animateLayout = () => {
  LayoutAnimation.configureNext({
    duration: 700,
    update: { type: 'easeInEaseOut', duration: 250 },
    create: { type: 'linear', property: 'opacity' },
  });
};

import { FontAwesome6, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable } from 'react-native';

import { colors } from '../../utils/colors';

const IconSet = {
  Feather,
  FA6: FontAwesome6,
};

export const BaseBtn = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { index, routeNames } = navigation.getState();
  const { size, iconName, style, iconSet = 'Feather' } = props;
  const IconComp = IconSet[iconSet];
  useEffect(() => {
    const toRoute = props.to.split('/').pop();
    const currentRoute = routeNames[index];
    setIsFocused(toRoute === currentRoute);
  }, [props.to, index, routeNames]);

  useEffect(() => {
    if (isFocused) {
      Animated.spring(jumpAnim, {
        toValue: 1,
        duration: 250,
        delay: 0,
        useNativeDriver: true,
      }).start(() => jumpAnim.setValue(0));
    }
  }, [isFocused]);

  return (
    <Pressable style={style} onPress={props.onPress}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: jumpAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 10, 0],
              }),
            },
          ],
        }}
      >
        <IconComp
          color={isFocused ? colors.red : colors.blue}
          name={iconName}
          size={size || 35}
        />
      </Animated.View>
    </Pressable>
  );
};

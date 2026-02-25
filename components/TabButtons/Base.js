import { FontAwesome6, Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { colors } from '../../utils/colors';

const IconSet = {
  Feather,
  FA6: FontAwesome6,
};

export const BaseBtn = (props) => {
  const isFocused = props.accessibilityState?.selected ?? false;
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const { size, iconName, style, iconSet = 'Feather' } = props;
  const IconComp = IconSet[iconSet];

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

import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { useLoadingContext } from '../../context/Loading';
import { addOpacityToColor } from '../../utils/colors';

export const LoadingOverlay = (props) => {
  const {
    state: { loading },
  } = useLoadingContext();

  const rotationDegree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationDegree, {
        toValue: 360,
        duration: 1000,
        easing: Easing.elastic(),
        useNativeDriver: true,
      }),
    ).start();
  }, [rotationDegree, loading]);
  return loading ? (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <View style={[styles.background, { borderColor: 'white' }]} />

        <Animated.View
          style={[
            styles.progress,
            { borderTopColor: 'white' },
            {
              transform: [
                {
                  rotateZ: rotationDegree.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    backgroundColor: addOpacityToColor('grey', 0.8),
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: 50 / 2,
    borderWidth: 6,
    opacity: 0.25,
  },
  progress: {
    width: '100%',
    height: '100%',
    borderRadius: 50 / 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: 6,
    position: 'absolute',
  },
});

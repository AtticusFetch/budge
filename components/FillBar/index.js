import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from './../../utils/colors';

const getSeparator = (index, isHighlighted, label, style) => (
  <View
    key={index}
    style={[styles.separator, isHighlighted && styles.separatorHighlight]}
  >
    {label ? <Text>{label}</Text> : null}
  </View>
);

const generateSeparators = (labels = [], count, highlightSection) => {
  const separators = new Array(count)
    .fill(0)
    .map((i, index) =>
      getSeparator(index, highlightSection === index, labels[index]),
    );
  return separators;
};

export default function FillBar(props) {
  const { fillValue, separatorCount = 0, highlightSection, labels } = props;
  const fullSize = useRef(new Animated.Value(0.01)).current;
  const emptySize = useRef(new Animated.Value(0.99)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fullSize, {
        toValue: fillValue,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(emptySize, {
        toValue: 1 - fillValue,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fillValue]);
  const filledPercent = fullSize.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const remainingPercent = emptySize.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const fillColor = {
    backgroundColor: fillValue === 1 ? colors.red : colors.green,
  };

  return (
    <View style={styles.bar}>
      <Animated.View
        style={[
          styles.barInner,
          fillColor,
          styles.full,
          { width: filledPercent },
        ]}
      />
      <Animated.View
        style={[styles.barInner, styles.empty, { width: remainingPercent }]}
      />
      {!!separatorCount && (
        <View style={styles.separatorContainer}>
          {generateSeparators(labels, separatorCount, highlightSection)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  separatorContainer: {
    width: '100%',
    height: 40,
    position: 'absolute',
    flexDirection: 'row',
  },
  separator: {
    flex: 1,
    borderColor: colors.grey,
    borderRightWidth: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separatorHighlight: {
    borderColor: colors.red,
    borderRightWidth: 2,
  },
  bar: {
    width: '100%',
    borderWidth: 0.5,
    height: 40,
    borderRadius: 20,
    borderColor: colors.grey,
    flexDirection: 'row',
    marginBottom: 20,
  },
  barInner: {
    borderRadius: 20,
  },
  full: {},
});

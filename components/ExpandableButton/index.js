import { useCallback, useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';

import { ColorButton } from '../ColorButton';

export const ExpandableButton = (props) => {
  const [expanded, setExpanded] = useState(false);

  const onPress = useCallback(() => {
    LayoutAnimation.configureNext({
      duration: 700,
      update: { type: 'spring', springDamping: 0.4 },
      create: { type: 'linear', property: 'opacity' },
    });
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <ColorButton
      onPress={onPress}
      colorName="blue"
      size={expanded ? 'thick' : ''}
      style={styles.button}
      childrenWrapperStyle={styles.itemContainer}
    >
      <View style={styles.mainContent}>{props.mainContent}</View>
      {expanded && (
        <View style={styles.extraContent}>{props.extraContent}</View>
      )}
    </ColorButton>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    paddingBottom: 5,
    alignItems: 'center',
  },
  button: {
    marginVertical: 5,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 20,
  },
  extraContent: {},
});

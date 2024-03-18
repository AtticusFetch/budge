import { useCallback, useState } from 'react';
import { LayoutAnimation, StyleSheet, View } from 'react-native';

import { ColorButton } from '../ColorButton';

export const ExpandableButton = (props) => {
  const [expanded, setExpanded] = useState(false);
  const {
    mainContent,
    extraContent,
    mainContentStyle,
    childrenWrapperStyle,
    style,
    roundDirection = 'right',
    ...restProps
  } = props;

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
      style={[styles.button, expanded && styles.expandedStyle, style]}
      childrenWrapperStyle={[
        styles.itemContainer,
        childrenWrapperStyle,
        styles.round[roundDirection],
      ]}
      {...restProps}
    >
      <View
        style={[
          styles.mainContent,
          expanded && styles.mainExpandedStyle,
          mainContentStyle,
        ]}
      >
        {mainContent}
      </View>
      {expanded && <View style={styles.extraContent}>{extraContent}</View>}
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
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  expandedStyle: {},
  mainExpandedStyle: {
    flex: 0.4,
  },
  round: {
    right: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    },
    left: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
    },
    none: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
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
  extraContent: {
    flex: 1,
  },
});

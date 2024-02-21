import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';
import { ColorButton } from '../ColorButton';

export const FriendListItem = (props) => {
  const { username } = props;

  return (
    <ColorButton colorName="blue" style={styles.button}>
      <View style={styles.mainContent}>
        <Text style={[styles.text]}>{username}</Text>
      </View>
    </ColorButton>
  );
};

const styles = StyleSheet.create({
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
});

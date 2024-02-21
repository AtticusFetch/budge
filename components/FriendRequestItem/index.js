import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Incoming } from './Incoming';
import { Outgoing } from './Outgoing';
import { ColorButton } from '../ColorButton';

export const FriendRequestItem = (props) => {
  const { from, to, confirmed, onAcceptRequest, onDeclineRequest, id } = props;
  const isIncoming = !!from;

  return (
    <ColorButton
      pressable={false}
      colorName="grey"
      style={styles.button}
      childrenWrapperStyle={styles.buttonContent}
    >
      <View style={styles.mainContent}>
        {isIncoming ? (
          <Incoming
            onAcceptRequest={onAcceptRequest}
            onDeclineRequest={onDeclineRequest}
            user={from}
            requestId={id}
          />
        ) : (
          <Outgoing user={to} />
        )}
      </View>
    </ColorButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
  buttonContent: {
    paddingVertical: 0,
  },
  mainContent: {
    flex: 1,
  },
});

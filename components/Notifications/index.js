import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { useNotificationsContext } from '../../context/Notifications';
import { animateLayout } from '../../utils/animations';
import { colors } from '../../utils/colors';

export const Notifications = (props) => {
  const {
    state: { notifications },
  } = useNotificationsContext();

  useEffect(() => {
    animateLayout();
  }, [notifications]);
  return (
    !!notifications?.length && (
      <View
        style={[styles.container, { height: (notifications.length || 1) * 30 }]}
      >
        <View style={[styles.notificationsContainer]}>
          {notifications.map((notification) => (
            <View
              key={notification.id}
              style={[styles.notification, notification.error && styles.error]}
            >
              {!!notification.code && (
                <Text style={styles.notificationText}>{notification.code}</Text>
              )}
              <Text style={styles.notificationText}>
                {notification.message}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 0,
    width: Dimensions.get('screen').width,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsContainer: {
    width: '70%',
  },
  notification: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    backgroundColor: colors.rouge,
  },
  notificationText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
});

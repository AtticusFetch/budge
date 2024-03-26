import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { useErrorsContext } from '../../context/Errors';
import { animateLayout } from '../../utils/animations';

export const ErrorsOverlay = (props) => {
  const {
    state: { errors },
  } = useErrorsContext();

  useEffect(() => {
    animateLayout();
  }, [errors]);
  console.log(errors);
  return (
    !!errors?.length && (
      <View style={styles.container}>
        <View style={styles.errorsContainer}>
          {errors.map((error) => (
            <View key={error.id} style={styles.error}>
              <Text style={styles.errorText}>{error.code}</Text>
              <Text style={styles.errorText}>{error.message}</Text>
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
    top: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorsContainer: {
    top: 80,
    width: '70%',
    position: 'absolute',
    borderWidth: 2,
  },
  error: {
    backgroundColor: 'red',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

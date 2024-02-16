import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ColorButton } from '../components/ColorButton';
import { colors } from '../utils/colors';

export default function AddTransactionModal(props) {
  const [amount, setamount] = useState(0);

  const onAmountChange = useCallback((e) => {
    setamount(e);
  }, []);

  const onSubmit = useCallback(async () => {
    props.onSubmit({ amount });
  }, [amount]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            onChangeText={onAmountChange}
            placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
            value={amount}
            autoFocus
            keyboardType="numeric"
            enablesReturnKeyAutomatically
            textAlign="center"
            autoComplete="off"
            autoCapitalize="none"
            selectionColor={colors.orange}
          />
        </View>
        <ColorButton onPress={onSubmit} text="Go" size="slim" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
  },
  input: {
    height: 60,
    padding: 10,
    width: '100%',
    fontSize: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderColor: 'green',
  },
  container: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 40,
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 55,
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'grey',
    opacity: 0.5,
    zIndex: 99999,
  },
});

import numbro from 'numbro';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { CategoriesList } from '../components/CategoriesList';
import { CategoryListItem } from '../components/CategoryListItem';
import { ColorButton } from '../components/ColorButton';
import { colors } from '../utils/colors';

const deviceWidth = Dimensions.get('window').width;

const STAGES = {
  amount: 1,
  category: 2,
  note: 3,
};

export default function AddTransactionModal(props) {
  const [amount, setamount] = useState('');
  const [note, setnote] = useState('');
  const [category, setcategory] = useState(null);
  const [stage, setstage] = useState(STAGES.amount);

  const slideOutAnim = useRef(new Animated.Value(0)).current;

  const slideOutStyle = {
    transform: [{ translateX: slideOutAnim }],
  };

  const animateSlide = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideOutAnim, {
        toValue: -(stage * deviceWidth),
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stage]);

  const onInputChange = useCallback(
    (value) => {
      switch (stage) {
        case STAGES.amount:
          setamount(value);
          break;
        case STAGES.category:
          setcategory(value);
          break;
        case STAGES.note:
          setnote(value);
          break;
      }
    },
    [stage],
  );

  const onSubmitInput = useCallback(() => {
    const isLastStage = stage === STAGES.note;
    if (isLastStage) {
      props.onSubmit({ amount, category, note });
    }
    setstage(stage + 1);
    animateSlide();
  }, [stage, amount, category, note]);

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.animatedWrapper, slideOutStyle]}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={onInputChange}
              placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
              value={amount}
              autoFocus
              keyboardType="numeric"
              enablesReturnKeyAutomatically
              enterKeyHint="next"
              returnKeyType="next"
              textAlign="center"
              autoComplete="off"
              autoCapitalize="none"
              selectionColor={colors.orange}
            />
          </View>
          <ColorButton onPress={onSubmitInput} text="Next" size="slim" />
          <ColorButton onPress={onCancel} text="Cancel" size="slim" />
        </KeyboardAvoidingView>
      </Animated.View>
      <Animated.View style={[styles.animatedWrapper, slideOutStyle]}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <CategoriesList
            categories={props.categories}
            onSelectedCategoryChange={onInputChange}
          />
          <ColorButton onPress={onSubmitInput} text="Next" size="slim" />
          <ColorButton onPress={onCancel} text="Cancel" size="slim" />
        </KeyboardAvoidingView>
      </Animated.View>
      <Animated.View style={[styles.animatedWrapper, slideOutStyle]}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={onInputChange}
              placeholder="Note"
              value={note}
              keyboardType="default"
              enterKeyHint="next"
              returnKeyType="next"
              textAlign="center"
              autoComplete="off"
              autoCapitalize="none"
              selectionColor={colors.orange}
            />
          </View>
          <ColorButton onPress={onSubmitInput} text="Create" size="slim" />
          <ColorButton onPress={onCancel} text="Cancel" size="slim" />
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderColor: 'green',
    width: '300%',
  },
  animatedWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: '50%',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 80,
  },
  input: {
    height: 60,
    padding: 10,
    width: '100%',
    fontSize: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 0.5,
    backgroundColor: 'white',
    shadowColor: colors.grey,
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    padding: 40,
    borderWidth: 1,
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

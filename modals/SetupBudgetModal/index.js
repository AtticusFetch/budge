import numbro from 'numbro';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';

import { CarInsuranceStage } from './Stages/CarInsurance';
import { CarPaymentStage } from './Stages/CarPayment';
import { IncomeStage } from './Stages/Income';
import { RentStage } from './Stages/Rent';

const deviceWidth = Dimensions.get('window').width;

const STAGES = {
  income: 1,
  rent: 2,
  carPayment: 3,
  carInsurance: 4,
  //   utilities: 5,
  //   sport: 6,
};

export const SetupBudgetModal = (props) => {
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');
  const [carPayment, setCarPayment] = useState('');
  const [carInsurance, setCarInsurance] = useState('');
  const [stage, setstage] = useState(STAGES.income);

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
    (e) => {
      switch (stage) {
        case STAGES.income:
          setIncome(e);
          break;
        case STAGES.rent:
          setRent(e);
          break;
        case STAGES.carPayment:
          setCarPayment(e);
          break;
        case STAGES.carInsurance:
          setCarInsurance(e);
          break;
      }
    },
    [stage],
  );

  const onSubmitInput = useCallback(
    (finalValue) => {
      const isLastStage = stage === STAGES.sport;
      if (isLastStage) {
        props.onSubmit({});
      }
      console.log(typeof finalValue);
      if (typeof finalValue !== 'undefined') {
        onInputChange(finalValue);
      }
      console.log('increase stage', stage);
      setstage(stage + 1);
      animateSlide();
    },
    [stage, income, rent, carPayment, carInsurance],
  );

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  const stageProps = {
    style: slideOutStyle,
    onSubmitStage: onSubmitInput,
    onCancel,
  };

  return (
    <View style={styles.wrapper}>
      <IncomeStage
        onChange={onInputChange}
        stageProps={stageProps}
        income={income}
      />
      <RentStage onChange={onInputChange} stageProps={stageProps} rent={rent} />
      <CarPaymentStage
        onChange={onInputChange}
        stageProps={stageProps}
        carPayment={carPayment}
      />
      <CarInsuranceStage
        onChange={onInputChange}
        stageProps={stageProps}
        carInsurance={carInsurance}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderColor: 'green',
    width: `${Object.keys(STAGES).length * 100}%`,
  },
});

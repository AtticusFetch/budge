import { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { CarInsuranceStage } from './Stages/CarInsurance';
import { CarPaymentStage } from './Stages/CarPayment';
import { IncomeStage } from './Stages/Income';
import { RentStage } from './Stages/Rent';
import { SportStage } from './Stages/Sport';
import { UtilitiesStage } from './Stages/Utilities';

const deviceWidth = Dimensions.get('window').width;

const STAGES = {
  income: 1,
  rent: 2,
  carPayment: 3,
  carInsurance: 4,
  utilities: 5,
  sport: 6,
};

export const SetupBudgetModal = (props) => {
  const [income, setIncome] = useState('3500');
  const [rent, setRent] = useState('2445');
  const [utilities, setUtilities] = useState('200');
  const [carPayment, setCarPayment] = useState('519');
  const [carInsurance, setCarInsurance] = useState('250');
  const [sport, setSport] = useState('290');
  const [savedSplitAmount, setSavedSplitAmount] = useState(null);
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
        case STAGES.utilities:
          setUtilities(e);
          break;
        case STAGES.sport:
          setSport(e);
          break;
      }
    },
    [stage],
  );

  const onSubmitInput = useCallback(
    (finalValue, splitAmount) => {
      const isLastStage = stage === STAGES.sport;
      setSavedSplitAmount(splitAmount);
      if (isLastStage) {
        props.onSubmit({
          rent,
          sport,
          income,
          carPayment,
          carInsurance,
          utilities,
        });
      }
      if (typeof finalValue !== 'undefined') {
        onInputChange(finalValue);
      }
      setstage(stage + 1);
      animateSlide();
    },
    [stage, income, rent, carPayment, carInsurance, utilities, sport],
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
      <RentStage
        savedSplitAmount={savedSplitAmount}
        onChange={onInputChange}
        stageProps={stageProps}
        rent={rent}
      />
      <CarPaymentStage
        onChange={onInputChange}
        savedSplitAmount={savedSplitAmount}
        stageProps={stageProps}
        carPayment={carPayment}
      />
      <CarInsuranceStage
        onChange={onInputChange}
        savedSplitAmount={savedSplitAmount}
        stageProps={stageProps}
        carInsurance={carInsurance}
      />
      <UtilitiesStage
        onChange={onInputChange}
        savedSplitAmount={savedSplitAmount}
        stageProps={stageProps}
        utilities={utilities}
      />
      <SportStage
        onChange={onInputChange}
        savedSplitAmount={savedSplitAmount}
        stageProps={stageProps}
        sport={sport}
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

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { CarInsuranceStage } from './Stages/CarInsurance';
import { CarPaymentStage } from './Stages/CarPayment';
import { IncomeStage } from './Stages/Income';
import { RentStage } from './Stages/Rent';
import { SportStage } from './Stages/Sport';
import { UtilitiesStage } from './Stages/Utilities';
import { DismissKeyboard } from '../../components/DismissKeyboard';

const deviceWidth = Dimensions.get('window').width;

export const BUDGET_STAGES = {
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
  const [stage, setStage] = useState(props.stage || BUDGET_STAGES.income);

  const slideOutAnim = useRef(new Animated.Value(0)).current;

  const slideOutStyle = {
    transform: [{ translateX: slideOutAnim }],
  };

  useEffect(() => {
    if (props.stage) {
      setStage(props.stage);
    }
  }, [props.stage]);

  useEffect(() => {
    const targetStageShift = stage - 1;
    Animated.parallel([
      Animated.timing(slideOutAnim, {
        toValue: -(targetStageShift * deviceWidth),
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [stage, props.stage]);

  const onInputChange = useCallback(
    (e) => {
      switch (stage) {
        case BUDGET_STAGES.income:
          setIncome(e);
          break;
        case BUDGET_STAGES.rent:
          setRent(e);
          break;
        case BUDGET_STAGES.carPayment:
          setCarPayment(e);
          break;
        case BUDGET_STAGES.carInsurance:
          setCarInsurance(e);
          break;
        case BUDGET_STAGES.utilities:
          setUtilities(e);
          break;
        case BUDGET_STAGES.sport:
          setSport(e);
          break;
      }
    },
    [stage, props.stage],
  );

  const onSubmitInput = useCallback(
    (finalValue, splitAmount) => {
      const isLastStage = stage === BUDGET_STAGES.sport;
      setSavedSplitAmount(splitAmount);
      if (props.singleStage) {
        props.onSubmit(finalValue);
        return;
      }
      if (isLastStage) {
        props.onSubmit({
          rent,
          sport,
          income,
          carPayment,
          carInsurance,
          utilities,
        });
        return;
      }
      if (typeof finalValue !== 'undefined') {
        onInputChange(finalValue);
      }
      setStage(stage + 1);
    },
    [
      stage,
      props.stage,
      income,
      rent,
      carPayment,
      carInsurance,
      utilities,
      sport,
      props.singleStage,
    ],
  );

  const onCancel = useCallback(() => {
    props.onClose();
  }, []);

  const stageProps = {
    style: slideOutStyle,
    onSubmitStage: onSubmitInput,
    submitLabel: 'Done',
    onCancel,
  };

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      style={styles.modal}
      transparent
      onRequestClose={props.onRequestClose}
    >
      <DismissKeyboard>
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
      </DismissKeyboard>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: `${Object.keys(BUDGET_STAGES).length * 100}%`,
  },
});

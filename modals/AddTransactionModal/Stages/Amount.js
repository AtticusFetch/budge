import numbro from 'numbro';
import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { CategoryStage } from './Category';
import { NoteStage } from './Note';
import { ColorButton } from '../../../components/ColorButton';
import { DatePicker } from '../../../components/DatePicker';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { StageTextInput } from '../../../components/TextInput';
import { colors } from '../../../utils/colors';
import { getTipAmount } from '../../../utils/getTipAmount';
import FriendsSplitModal from '../../FriendsSplitModal';
import TipsModal from '../../TipsModal';

export const AmountStage = (props) => {
  const { onChange, friends } = props;
  const [isSplitModalVisible, setisSplitModalVisible] = useState(false);
  const [isTipsModalVisible, setisTipsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [tipsAmount, setTipsAmount] = useState(0);

  const onSplitModalClose = useCallback(() => {
    setisSplitModalVisible(false);
  }, []);

  const onSplitModalShow = useCallback(() => {
    setisSplitModalVisible(true);
  }, []);

  const onSplitModalDone = useCallback((selectedFriends) => {
    props.setSplitWith(selectedFriends);
    onSplitModalClose();
  }, []);

  const onTipsModalClose = useCallback(() => {
    setisTipsModalVisible(false);
  }, []);

  const onTipsModalShow = useCallback(() => {
    setisTipsModalVisible(true);
  }, []);

  const onCategoryModalClose = useCallback(() => {
    setIsCategoryModalVisible(false);
  }, []);

  const onCategoryModalShow = useCallback(() => {
    setIsCategoryModalVisible(true);
  }, []);

  const onNoteModalClose = useCallback(() => {
    setIsNoteModalVisible(false);
  }, []);

  const onNoteModalShow = useCallback(() => {
    setIsNoteModalVisible(true);
  }, []);

  const onTipsModalDone = useCallback((tips) => {
    props.setTips(tips);
    onTipsModalClose();
  }, []);

  useEffect(() => {
    const tipAmount = getTipAmount(props.tips, props.amount);
    setTipsAmount(tipAmount);
  }, [props.tips, props.amount]);

  return (
    <StageWrapper {...props.stageProps}>
      <StageTextInput
        onChange={onChange}
        value={props.amount}
        placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
        autoFocus
        keyboardType="numeric"
        enterKeyHint="next"
        returnKeyType="next"
      />
      <View style={styles.textContainer}>
        {!!props.splitWith.length && (
          <Text style={styles.secondaryText}>
            Split amount:{' '}
            {numbro(
              (numbro(props.amount) + numbro(tipsAmount)) /
                (props.splitWith.length + 1),
            ).formatCurrency({
              mantissa: 2,
            })}
          </Text>
        )}
        {!!props.tips && (
          <Text style={styles.secondaryText}>
            Tips: {numbro(tipsAmount).formatCurrency({ mantissa: 2 })}
          </Text>
        )}
      </View>
      <View style={styles.modifierButtonsContainer}>
        {!!friends?.length && (
          <ColorButton
            colorName="blue"
            childrenWrapperStyle={styles.modifierBtnContent}
            onPress={onSplitModalShow}
            style={[styles.modifierBtn, styles.splitBtn]}
            text="Split"
          />
        )}
        <ColorButton
          colorName="blue"
          childrenWrapperStyle={styles.modifierBtnContent}
          onPress={onTipsModalShow}
          style={[styles.modifierBtn, styles.tipsBtn]}
          text="Tips"
        />
        <DatePicker value={props.date} onChange={props.onDateChange} />
        <ColorButton
          colorName="yellow"
          childrenWrapperStyle={styles.modifierBtnContent}
          onPress={onCategoryModalShow}
          style={[styles.modifierBtn, styles.categoryBtn]}
          text="Category"
        />
        <ColorButton
          colorName="yellow"
          childrenWrapperStyle={styles.modifierBtnContent}
          onPress={onNoteModalShow}
          style={[styles.modifierBtn, styles.noteBtn]}
          text="Note"
        />
      </View>
      <Modal
        animationType="slide"
        visible={isSplitModalVisible}
        transparent
        onRequestClose={onSplitModalClose}
      >
        <FriendsSplitModal
          friends={friends}
          selectedFriends={props.splitWith}
          onDone={onSplitModalDone}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={isTipsModalVisible}
        transparent
        onRequestClose={onTipsModalClose}
      >
        <TipsModal
          onClose={onTipsModalClose}
          tips={props.tips}
          onDone={onTipsModalDone}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={isCategoryModalVisible}
        transparent
        onRequestClose={onCategoryModalClose}
      >
        <CategoryStage
          stageProps={{
            onSubmit: onCategoryModalClose,
            onCancel: onCategoryModalClose,
            cancelLabel: 'Done',
          }}
          onChange={props.onCategoryChange}
          categories={props.categories}
          category={props.category}
        />
      </Modal>
      <Modal
        animationType="slide"
        visible={isNoteModalVisible}
        transparent
        onRequestClose={onNoteModalClose}
      >
        <NoteStage
          stageProps={{
            onSubmit: onNoteModalClose,
            onCancel: onNoteModalClose,
            cancelLabel: 'Done',
          }}
          rememberCheckboxVisible={props.rememberCheckboxVisible}
          setShouldRememberNote={props.setShouldRememberNote}
          onChange={props.onNoteChange}
          notes={props.notes}
          note={props.note}
        />
      </Modal>
    </StageWrapper>
  );
};

const styles = StyleSheet.create({
  modifierButtonsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modifierBtn: {
    height: 40,
    width: '30%',
  },
  splitBtn: {},
  modifierBtnContent: {
    padding: 0,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  secondaryText: {
    color: colors.grey,
    fontSize: 12,
  },
});

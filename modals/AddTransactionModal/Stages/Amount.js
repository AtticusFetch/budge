import numbro from 'numbro';
import { useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { CategoryStage } from './Category';
import { NoteStage } from './Note';
import { ColorButton } from '../../../components/ColorButton';
import { DatePicker } from '../../../components/DatePicker';
import { Icon } from '../../../components/Icon';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { StageTextInput } from '../../../components/TextInput';
import { colors } from '../../../utils/colors';
import { getTipAmount } from '../../../utils/getTipAmount';
import { globalStyles } from '../../../utils/globalStyles';
import FriendsSplitModal from '../../FriendsSplitModal';
import TipsModal from '../../TipsModal';

/**
 * ***************************************
 * ***************************************
 * ***************************************
 * Refactor, this is no longer a "stage"
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 */

export const AmountStage = (props) => {
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

  const onCategoryChange = useCallback((e) => {
    props.onCategoryChange(e);
    onCategoryModalClose();
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
    <StageWrapper
      {...props.stageProps}
      contentWrapperStyle={styles.contentWrapperStyle}
    >
      <StageTextInput
        onChange={props.onChange}
        value={props.amount}
        containerStyle={{ flex: 0 }}
        placeholder={numbro(0).formatCurrency({ mantissa: 2 })}
        autoFocus
        keyboardType="numeric"
        enterKeyHint="next"
        returnKeyType="next"
      />
      <View style={styles.textContainer}>
        {!!props.splitWith?.length && (
          <Text style={styles.secondaryText}>
            Split amount:{' '}
            {numbro(
              (numbro(props.amount) + numbro(tipsAmount || 0)) /
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
        <View style={[globalStyles.row, styles.btnRow]}>
          {!!props.friends?.length && (
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
        </View>
        <View style={[globalStyles.row, styles.btnRow]}>
          <ColorButton
            colorName="yellow"
            childrenWrapperStyle={styles.categoryBtnContent}
            onPress={onCategoryModalShow}
            style={[styles.modifierBtn, styles.categoryBtn]}
          >
            <Icon
              size={25}
              style={styles.categoryIcon}
              name={props.category?.icon}
            />
            <Text style={styles.categoryName}>
              {props.category?.name || 'Choose Category'}
            </Text>
          </ColorButton>
        </View>
        <View style={[globalStyles.row, styles.btnRow]}>
          <DatePicker value={props.date} onChange={props.onDateChange} />
        </View>
        <View style={[globalStyles.row, styles.btnRow]}>
          <ColorButton
            colorName="yellow"
            childrenWrapperStyle={styles.categoryBtnContent}
            onPress={onNoteModalShow}
            style={[styles.modifierBtn, styles.noteBtn]}
            text="Note"
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={isSplitModalVisible}
        transparent
        onRequestClose={onSplitModalClose}
      >
        <FriendsSplitModal
          friends={props.friends}
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
          onChange={onCategoryChange}
          userCategories={props.userCategories}
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
    width: '100%',
    flex: 1,
  },
  contentWrapperStyle: {
    flex: 0.55,
  },
  modifierBtn: {
    height: 40,
    width: '30%',
    marginHorizontal: 20,
  },
  categoryBtn: {
    flex: 1,
  },
  splitBtn: {},
  modifierBtnContent: {
    padding: 0,
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
  },
  btnRow: {
    justifyContent: 'center',
  },
  categoryBtnContent: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: colors.seeThrough.grey,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    flex: 0,
  },
  secondaryText: {
    color: colors.grey,
    fontSize: 12,
  },
});

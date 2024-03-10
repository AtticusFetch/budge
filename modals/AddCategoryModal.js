import { useCallback, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { CategoriesList } from '../components/CategoriesList';
import { Icon } from '../components/Icon';
import { StageWrapper } from '../components/ModalStageWrapper';
import { StageTextInput } from '../components/TextInput';
import { colors } from '../utils/colors';
import { iconsList } from '../utils/iconsList';

const iconsObj = iconsList.map((n) => ({ icon: n }));

const icons = [...iconsObj.slice(0, 150)];

export default function AddCategoryModal(props) {
  const { visible, onSubmit, onClose } = props;
  const [categoryName, setCategoryName] = useState('');
  const [isIconsModalVisible, setIsIconsModalVisible] = useState(false);
  const [icon, setIcon] = useState(null);

  const onInputChange = useCallback((e) => {
    setCategoryName(e);
  }, []);

  const onSubmitInput = useCallback(() => {
    onSubmit({
      name: categoryName,
      icon,
    });
  }, [categoryName, icon]);

  const onCancel = useCallback(() => {
    onClose();
  }, []);

  const onShowIconsModal = useCallback(() => {
    setIsIconsModalVisible(true);
  }, []);

  const onHideIconsModal = useCallback(() => {
    setIsIconsModalVisible(false);
  }, []);

  const onSetIcon = useCallback((data) => {
    setIcon(data.icon);
    setIsIconsModalVisible(false);
  }, []);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.wrapper}>
        <StageWrapper
          submitLabel="Create"
          onSubmitStage={onSubmitInput}
          onCancel={onCancel}
          style={styles.container}
          contentWrapperStyle={styles.contentWrapper}
        >
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              onPress={onShowIconsModal}
              style={styles.iconWrapper}
            >
              <Icon size={30} color={colors.grey} name={icon} />
            </TouchableOpacity>
            <StageTextInput
              onChange={onInputChange}
              value={categoryName}
              autoFocus
              placeholder="Category Name"
              keyboardType="default"
              textAlign="start"
            />
          </View>
        </StageWrapper>
      </View>

      <Modal
        animationType="slide"
        visible={isIconsModalVisible}
        transparent
        onRequestClose={onHideIconsModal}
      >
        <SafeAreaView style={styles.iconsListWrapper}>
          <CategoriesList
            categories={icons}
            onSelectedCategoryChange={onSetIcon}
            btnStyle={styles.iconBtnStyle}
            columns={6}
            btnContainerStyle={styles.iconBtnContainerStyle}
            btnContentStyle={styles.iconBtnContentStyle}
          />
        </SafeAreaView>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.seeThrough.grey,
    borderRadius: 10,
    width: '20%',
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconsModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconsModalContent: {
    shadowOpacity: 0,
    flex: 1,
  },
  iconsListWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconBtnStyle: {
    borderWidth: 0,
  },
  iconBtnContainerStyle: {
    maxWidth: '15%',
  },
  iconBtnContentStyle: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 0,
  },
});

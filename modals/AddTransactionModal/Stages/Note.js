import { StyleSheet, Text } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { CategoriesList } from '../../../components/CategoriesList';
import { StageWrapper } from '../../../components/ModalStageWrapper';
import { StageTextInput } from '../../../components/TextInput';
import { colors } from '../../../utils/colors';

export const NoteStage = (props) => {
  return (
    <StageWrapper {...props.stageProps}>
      <StageTextInput
        onChange={props.onChange}
        value={props.note}
        placeholder="Note"
        keyboardType="default"
        enterKeyHint="next"
        returnKeyType="next"
      />
      {props.rememberCheckboxVisible && (
        <BouncyCheckbox
          size={25}
          fillColor={colors.blue}
          unfillColor="white"
          style={styles.noteCheckbox}
          textComponent={<Text style={styles.noteCheckboxLabel}>Remember</Text>}
          onPress={props.setShouldRememberNote}
        />
      )}
      {props.notes?.length && (
        <CategoriesList
          categories={props.notes}
          onSelectedCategoryChange={props.onChange}
        />
      )}
    </StageWrapper>
  );
};

const styles = StyleSheet.create({
  noteCheckboxLabel: {
    color: colors.grey,
    marginLeft: 10,
  },
  noteCheckbox: {
    marginTop: 20,
    marginBottom: 40,
  },
});

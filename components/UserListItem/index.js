import { ColorButton } from '../ColorButton';

const colorRoulette = ['orange', 'blue', 'yellow', 'lightBlue'];

export const UserListItem = (props) => {
  const { id, name, onPress, index } = props;
  const colorIndex = index % colorRoulette.length;

  return (
    <ColorButton
      colorName={colorRoulette[colorIndex]}
      onPress={() => onPress(id)}
      text={name}
    />
  );
};

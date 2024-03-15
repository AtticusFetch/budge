import { ColorButton } from '../ColorButton';

export const colorRoulette = [
  'orange',
  'grey',
  'yellow',
  'blue',
  'red',
  'green',
];

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

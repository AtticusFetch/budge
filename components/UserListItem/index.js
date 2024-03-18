import { ColorButton } from '../ColorButton';

// TODO need more colors
export const colorRoulette = [
  'orange',
  'yellow',
  'blue',
  'green',
  'purple',
  'lightPink',
  'pink',
  'beige',
  'red',
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

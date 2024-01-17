import { ColorButton } from "../ColorButton";

export const UserListItem = (props) => {
  const { id, name, onPress } = props;

  return (
    <ColorButton
      onPress={() => onPress(id)}
      text={name}
    />
  );
};

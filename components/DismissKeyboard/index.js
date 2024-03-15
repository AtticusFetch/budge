import { Keyboard, Pressable } from 'react-native';

export const DismissKeyboard = (props) => (
  <Pressable
    style={[{ flex: 1, width: '100%' }, props.style]}
    onPress={Keyboard.dismiss}
  >
    {props.children}
  </Pressable>
);

import { StyleSheet, Text, View } from 'react-native';

export const Outgoing = (props) => {
  const { user } = props;

  return (
    <View style={styles.container}>
      <Text>To: {user.username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
  },
});

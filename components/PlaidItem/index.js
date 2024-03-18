import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/colors';

export const PlaidItem = (props) => {
  const { item } = props;
  return (
    <Pressable key={item.institution?.institution_id}>
      <View style={styles.container}>
        <Text style={styles.institutionName}>{item.institution?.name}</Text>
        {item.accounts?.map((account) => (
          <View key={account.account_id} style={styles.account}>
            <Text style={styles.accountName}>{account.name}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 16,
    padding: 10,
    borderColor: colors.yellow,
    backgroundColor: colors.seeThrough.yellow,
    marginVertical: 15,
  },
  institutionName: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
  },
  accountName: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  account: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 8,
    marginVertical: 5,
  },
});

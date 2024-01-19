import { Text } from 'react-native';

import { ColorButton } from '../ColorButton';

export const TransactionListItem = (props) => {
  const { name, amount, iso_currency_code } = props;
  const text = `${name} ${amount} ${iso_currency_code}`;
  const colorName = parseFloat(amount) < 0 ? 'green' : 'red';

  return (
    <ColorButton colorName={colorName}>
      <Text>{text}</Text>
    </ColorButton>
  );
};

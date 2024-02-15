import { Text, View } from 'react-native';

import { ColorButton } from '../ColorButton';
import { useCallback, useState } from 'react';

export const TransactionListItem = (props) => {
  const [expanded, setExpanded] = useState(false);
  const {
    name,
    amount,
    iso_currency_code,
    category,
    date,
    personal_finance_category,
  } = props;
  const text = `${name} ${amount} ${iso_currency_code}`;
  const colorName = parseFloat(amount) < 0 ? 'green' : 'red';
  const onPress = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <ColorButton
      onPress={onPress}
      colorName={colorName}
      size={expanded ? 'thick' : ''}
    >
      <Text>{text}</Text>
      {expanded && (
        <View>
          <Text>Categories: {category.join(', ')}</Text>
          <Text>{date}</Text>
          <Text>{JSON.stringify(personal_finance_category)}</Text>
        </View>
      )}
    </ColorButton>
  );
};

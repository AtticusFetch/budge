import numbro from 'numbro';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';

import { ColorButton } from '../ColorButton';

export const TransactionListItem = (props) => {
  const [expanded, setExpanded] = useState(false);
  const { name, amount, category, date, personal_finance_category, id } = props;
  const text = `${name} ${numbro(amount).formatCurrency({ mantissa: 2 })}`;
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

import DateTimePicker from '@react-native-community/datetimepicker';
import { useCallback } from 'react';

export const DatePicker = (props) => {
  const { value, onChange } = props;
  const onDateChange = useCallback(
    (event, newDate) => {
      if (event.type === 'set') {
        console.log('onChange', newDate);
        onChange(newDate);
      }
    },
    [onChange, value],
  );

  return (
    <DateTimePicker
      value={value.toDate ? value.toDate() : value}
      mode="date"
      is24Hour
      onChange={onDateChange}
    />
  );
};

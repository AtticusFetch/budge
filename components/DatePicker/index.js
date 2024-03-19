import DateTimePicker from '@react-native-community/datetimepicker';
import { useCallback } from 'react';

export const DatePicker = (props) => {
  const { value, onChange } = props;
  const onDateChange = useCallback(
    (event, value) => {
      if (event.type === 'set') {
        onChange(value);
      }
    },
    [onChange, value],
  );

  return (
    <DateTimePicker
      value={value.toDate()}
      mode="date"
      is24Hour
      timeZoneName="Universal"
      onChange={onDateChange}
    />
  );
};

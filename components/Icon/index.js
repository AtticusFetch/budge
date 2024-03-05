import * as IconSets from '@expo/vector-icons';

export const Icon = (props) => {
  const { name, ...rest } = props;
  if (!name) {
    return null;
  }
  const iconName = name?.split('/')[1] || name;
  const Icon = IconSets[name?.split('/')[0]] || IconSets.Feather;

  return <Icon name={iconName} {...rest} />;
};

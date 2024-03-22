import * as IconSets from '@expo/vector-icons';

export const Icon = (props) => {
  const { name, ...rest } = props;
  if (!name) {
    return null;
  }
  if (name?.includes('/')) {
    const [iconFamily, iconName] = name?.split('/');
    const Icon = IconSets[iconFamily] || IconSets.Feather;

    return <Icon name={iconName} {...rest} />;
  }

  return <IconSets.Feather name={name} {...rest} />;
};

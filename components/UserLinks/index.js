import { FlatList, StyleSheet } from 'react-native';

import { LinkItem } from './LinkItem';

export const UserLinks = (props) => {
  const { links, categories, budget, onDelete } = props;

  return (
    <FlatList
      data={links}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <LinkItem
          onDelete={onDelete}
          budget={budget}
          categories={categories}
          item={item}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {},
});

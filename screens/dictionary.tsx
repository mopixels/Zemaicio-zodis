import React, { useDeferredValue, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import PaperBackground from '../components/paperBackground';
import Flag from '../components/flag';
import { setSearchField, setInputLanguage } from '../actions/actions';
import { colors, fonts } from '../theme';
import { words, wordText, copyToClipboard, stripAccents, capitalize } from '../utils';
import type { RootState } from '../App';
import type { Word } from '../types';

interface Entry {
  word: Word;
  head: string;  // text in the search language, shown as the headword
  sub: string;   // the translation
  key: string;   // head without accents, used for matching
  pos: number[]; // index in head of each character of key
}

interface Row {
  entry: Entry;
  match: number; // index of the query in key, or -1
  len: number;   // length of the query that produced match
}

const buildEntries = (isZmt: boolean): Entry[] =>
  words.map(word => {
    const head = (isZmt ? word.title : word.meaning).normalize('NFC');
    const sub = (isZmt ? word.meaning : word.title).normalize('NFC');
    // A few headwords keep combining marks after NFC, so key can be shorter than head.
    let key = '';
    const pos: number[] = [];
    for (let i = 0; i < head.length; i++) {
      const stripped = stripAccents(head[i]);
      key += stripped;
      for (let j = 0; j < stripped.length; j++) pos.push(i);
    }
    return { word, head, sub, key, pos };
  });

// Both lists are sorted once here, so filtering never has to sort (localeCompare is slow).
const collator = new Intl.Collator('lt');
const sortedEntries = (isZmt: boolean) =>
  buildEntries(isZmt).sort((a, b) => collator.compare(a.head, b.head));
const zmtEntries = sortedEntries(true);
const ltEntries = sortedEntries(false);
const allZmtRows: Row[] = zmtEntries.map(entry => ({ entry, match: -1, len: 0 }));
const allLtRows: Row[] = ltEntries.map(entry => ({ entry, match: -1, len: 0 }));

const DictionaryRow = React.memo(function DictionaryRow({ row }: { row: Row }) {
  const { entry, match, len } = row;
  const head = capitalize(entry.head);
  const start = entry.pos[match];
  const keyEnd = match + len;
  const end = keyEnd < entry.pos.length ? entry.pos[keyEnd] : head.length;
  return (
    <Pressable
      onPress={() => copyToClipboard(wordText(entry.word))}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.head}>
        {match >= 0 ? (
          <>
            {head.slice(0, start)}
            <Text style={styles.highlight}>{head.slice(start, end)}</Text>
            {head.slice(end)}
          </>
        ) : head}
      </Text>
      <Text style={styles.sub}>{entry.sub}</Text>
    </Pressable>
  );
});

const renderItem = ({ item }: { item: Row }) => <DictionaryRow row={item} />;

export default function Dictionary() {

  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.displayLanguage.language);
  const searchField = useSelector((state: RootState) => state.searchDictionary.searchField);
  const isZmt = useSelector((state: RootState) => state.inputLanguage.isZmt);
  const lt = language == 'lt';

  // Deferred so typing stays responsive while the list recomputes.
  const query = useDeferredValue(stripAccents(searchField.trim()));

  const rows = useMemo<Row[]>(() => {
    const entries = isZmt ? zmtEntries : ltEntries;
    if (!query) return isZmt ? allZmtRows : allLtRows;
    // Entries are already sorted, so keep prefix matches first and the rest after, in order.
    const prefix: Row[] = [];
    const inner: Row[] = [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const match = entry.key.indexOf(query);
      if (match < 0) continue;
      (match === 0 ? prefix : inner).push({ entry, match, len: query.length });
    }
    return prefix.concat(inner);
  }, [query, isZmt]);

  return (
    <PaperBackground>
      <View style={styles.header}>
        <Text style={styles.title}>{lt ? 'Žodynėlis' : 'Žuodīnielis'}</Text>

        <View style={styles.searchField}>
          <Feather name="search" size={20} color={colors.muted} />
          <TextInput
            style={styles.input}
            value={searchField}
            onChangeText={text => dispatch(setSearchField(text))}
            placeholder={lt ? 'Paieška' : 'Ėiškuosėna'}
            placeholderTextColor={colors.placeholder}
            underlineColorAndroid="transparent"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchField.length > 0 && (
            <Pressable
              onPress={() => dispatch(setSearchField(''))}
              style={styles.clear}
              accessibilityRole="button"
              hitSlop={6}
            >
              <Feather name="x" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>

        <View style={styles.directionRow}>
          <Pressable
            onPress={() => dispatch(setInputLanguage(!isZmt))}
            style={styles.direction}
            accessibilityRole="button"
            accessibilityLabel={isZmt ? 'Žemaitiu → lietuvių' : 'Lietuvių → žemaitiu'}
          >
            <Flag language={isZmt ? 'zmt' : 'lt'} />
            <Feather name="repeat" size={16} color={colors.accent} />
            <Flag language={isZmt ? 'lt' : 'zmt'} />
          </Pressable>
        </View>
      </View>

      <FlatList
        style={styles.list}
        data={rows}
        keyExtractor={item => item.entry.word.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={<Text style={styles.empty}>{lt ? 'Nieko nerasta' : 'Nieka nier'}</Text>}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
  },
  searchField: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border25,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 14,
    paddingRight: 6,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
    paddingVertical: 0,
  },
  clear: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionRow: {
    flexDirection: 'row',
  },
  direction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border20,
    backgroundColor: colors.card,
  },
  list: {
    flex: 1,
  },
  row: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border09,
    backgroundColor: colors.rowBg,
  },
  rowPressed: {
    backgroundColor: colors.accentTint05,
  },
  head: {
    fontFamily: fonts.bodyMedium,
    fontSize: 19,
    lineHeight: 19 * 1.3,
    color: colors.ink,
  },
  highlight: {
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  sub: {
    fontFamily: fonts.bodyItalic,
    fontSize: 15,
    lineHeight: 15 * 1.35,
    color: colors.muted,
  },
  empty: {
    paddingVertical: 48,
    paddingHorizontal: 28,
    textAlign: 'center',
    fontFamily: fonts.bodyItalic,
    fontSize: 17,
    color: colors.muted,
  },
});

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ExternalStorageModule} from '../nativeModules/AndroidNativeModules';
import useGlobalState from '../stateManagment/useGlobalState';
import RenderItems from '../components/RenderItems';

type RenderItemType = {
  item: {isHidden: boolean; path: string; name: string; type: string};
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const {numberColumn} = useGlobalState();

  const [searchedItems, setSearchedItems] = useState([]);

  const inputRef = useRef<TextInput>(null);

  const searchItems = async (quary: string) => {
    try {
      const result = await ExternalStorageModule?.searchFilesAndFolders(
        quary?.toLocaleLowerCase(),
      );
      setSearchedItems(result);
      console.log(result, 'result');
    } catch (error) {
      console.log(error, 'search error');
    }
  };

  const handleOnchange = (quary: string) => {
    setInputValue(quary);
    if (quary?.length > 3) {
      searchItems(quary);
    } else {
      setSearchedItems([]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation?.goBack();
          }}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../assets/back.webp')}
          />
        </TouchableOpacity>
        <View style={{marginStart: '3%', width: '80%'}}>
          <TextInput
            cursorColor="black"
            ref={inputRef}
            value={inputValue}
            onChangeText={handleOnchange}
            style={{width: '100%', paddingStart: '3%'}}
            placeholder="Search..."
          />
        </View>
      </View>
      <View>
        <FlatList
          data={searchedItems}
          key={numberColumn}
          numColumns={numberColumn}
          renderItem={({item}: RenderItemType) => (
            <RenderItems
              path={item?.path}
              folderName={item?.name}
              type={item?.type}
              navigateToFile={() => {}}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '10%',
    paddingStart: '3%',
    borderBottomWidth: 0.3,
    borderBottomColor: '#bdbcbb',
    paddingBottom: '3%',
    width: '100%',
  },
});

export default SearchScreen;

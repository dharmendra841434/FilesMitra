import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import menu from '../assets/menu.png';
import list from '../assets/list.png';
import close from '../assets/x.png';
import useGlobalState from '../stateManagment/useGlobalState';
import {useNavigation} from '@react-navigation/native';
import useFolderPath from '../stateManagment/useFolderPath';
import {ExternalStorageModule} from '../nativeModules/AndroidNativeModules';

type propsType = {
  title: string;
  onBack: () => void;
  isBack: boolean;
  onDelete: () => void;
};

const CustomHeader: FC<propsType> = ({
  title,
  onBack,
  isBack = true,
  onDelete,
}) => {
  const {
    numberColumn,
    setNumberColumn,
    setMoreView,
    setSelectedItems,
    selectedItems,
    isModify,
    setIsModify,
    modifiedItems,
    setModifiedItems,
  } = useGlobalState();
  const {prevFolderPath, setPath, setFolderData, folderData, currentPath} =
    useFolderPath();

  const navigation = useNavigation();

  const handlePaste = async () => {
    try {
      if (isModify === 'copy') {
        for (let i = 0; i < modifiedItems.length; i++) {
          const result = await ExternalStorageModule?.copyFilesToDirectory(
            modifiedItems[i],
            currentPath,
          );
          console.log(result, 'result');
        }
        const files = await ExternalStorageModule.listFilesInPath(currentPath);

        setFolderData(files);
        console.log(modifiedItems, 'copy');
      } else {
        console.log('move');
      }
    } catch (error) {}
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        {selectedItems?.length > 0 ? (
          <View style={styles.container}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: '2%',
                justifyContent: 'space-between',
                width: '35%',
              }}>
              <TouchableOpacity onPress={() => setSelectedItems([])}>
                <Image style={{width: 18, height: 18}} source={close} />
              </TouchableOpacity>
              <Text style={{fontWeight: '500', fontSize: 16}}>
                {selectedItems?.length} Selected
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '20%',
                justifyContent: 'space-between',
                paddingRight: '3%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity activeOpacity={0.7} onPress={onDelete}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../assets/delete.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMoreView(true)}>
                  <Image
                    style={{height: 25, width: 25}}
                    source={require('../assets/more.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            {isModify ? (
              <View style={styles.container}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '45%',
                  }}>
                  <Text style={{fontWeight: '500', fontSize: 16}}>
                    {modifiedItems?.length} Selected
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '40%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('root');
                      setModifiedItems([]);
                      setIsModify('');
                    }}>
                    <Text style={{fontWeight: '600', color: 'black'}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handlePaste}>
                    <Text style={{fontWeight: '600', color: '#4287f5'}}>
                      Paste
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.container}>
                <View style={styles.header}>
                  {isBack && (
                    <TouchableOpacity onPress={onBack}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={require('../assets/back.webp')}
                      />
                    </TouchableOpacity>
                  )}
                  <Text
                    style={{
                      marginStart: isBack ? '5%' : '0%',
                      fontWeight: '600',
                      fontSize: 18,
                    }}>
                    {title}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '35%',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('search')}>
                    <Image
                      style={{height: 20, width: 20}}
                      source={require('../assets/search.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setNumberColumn(numberColumn === 1 ? 3 : 1)}>
                    <Image
                      style={{height: 20, width: 20}}
                      source={numberColumn === 3 ? list : menu}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setMoreView(true)}>
                    <Image
                      style={{height: 25, width: 25}}
                      source={require('../assets/more.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    paddingTop: '13%',
    elevation: 5,
    paddingBottom: '3%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
    justifyContent: 'space-between',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
});

export default CustomHeader;

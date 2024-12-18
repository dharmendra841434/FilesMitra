import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import useGlobalState from '../stateManagment/useGlobalState';
import {useNavigation} from '@react-navigation/native';

type propsType = {
  handleSelectAll: () => void;
  handleGetInfo: () => void;
};

const MoreOption: FC<propsType> = ({handleSelectAll, handleGetInfo}) => {
  const {
    setMoreView,
    setIsOpenModal,
    selectedItems,
    setModifiedItems,
    isModify,
    setIsModify,
    setSelectedItems,
  } = useGlobalState();

  const navigation = useNavigation();

  const handleCopyItems = () => {
    setIsModify('copy');
    console.log(selectedItems, 'asjdajs');

    setModifiedItems(selectedItems);
    setSelectedItems([]);
    setMoreView(false);
    navigation.navigate('root');
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.fullModal}
      onPress={() => {
        setMoreView(false);
      }}>
      <View
        style={{
          top: '10%',
          right: 5,
          position: 'absolute',
        }}>
        {selectedItems?.length > 0 ? (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => console.log('New Window')}
              style={styles.menuItem}>
              <Text>Sort by...</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSelectAll} style={styles.menuItem}>
              <Text>Select all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopyItems} style={styles.menuItem}>
              <Text>Copy to...</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModify('move');
                navigation.navigate('root');
              }}
              style={styles.menuItem}>
              <Text>Move to...</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('Get Info')}
              style={styles.menuItem}>
              <Text>Compress</Text>
            </TouchableOpacity>
            {selectedItems?.length === 1 && (
              <TouchableOpacity onPress={handleGetInfo} style={styles.menuItem}>
                <Text>Get info</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => console.log('New Window')}
              style={styles.menuItem}>
              <Text>New window</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMoreView(false);
                setIsOpenModal(true);
              }}
              style={styles.menuItem}>
              <Text>New folder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('Sort By')}
              style={styles.menuItem}>
              <Text>Sort by...</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSelectAll} style={styles.menuItem}>
              <Text>Select all</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => console.log('Get Info')}
              style={styles.menuItem}>
              <Text>Get info</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => console.log('Show Hidden Files')}
              style={styles.menuItem}>
              <Text>Show hidden files</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
    width: 200,
    borderRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  fullModal: {
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});

export default MoreOption;

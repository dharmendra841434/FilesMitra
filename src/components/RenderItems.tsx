import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {FC} from 'react';
import useGlobalState from '../stateManagment/useGlobalState';
import useFolderPath from '../stateManagment/useFolderPath';
import {addEllipsis, isImageFile} from '../utils/helper';
import doneIcon from '../assets/done.png';
import folderIcon from '../assets/folder2.png';
import fileIcon from '../assets/file.png';

type RenderItemType = {
  path: string;
  folderName: string;
  type: string;
  navigateToFile: (path: string, folderName: string) => void;
};

const RenderItems: FC<RenderItemType> = ({
  path,
  folderName,
  type,
  navigateToFile,
}) => {
  const {numberColumn, setSelectedItems, selectedItems} = useGlobalState();
  const {setCurrentPath} = useFolderPath();

  return (
    <View
      style={{
        margin: numberColumn === 3 ? '4%' : '0%',
        paddingStart: numberColumn !== 3 ? '2%' : '0%',
        borderWidth: 1,
        borderColor: selectedItems?.includes(path) ? 'black' : 'white',
      }}>
      <TouchableOpacity
        onLongPress={() => {
          setSelectedItems([]);
          setSelectedItems((prev: any) => [...prev, path]);
        }}
        onPress={() => {
          if (selectedItems?.length === 0) {
            setCurrentPath(`${path}/`);
            navigateToFile(path, folderName);
          } else {
            setSelectedItems((prevItems: any) => {
              if (prevItems.includes(path)) {
                // If the item exists, remove it
                return prevItems.filter((i: any) => i !== path);
              } else {
                // If the item doesn't exist, add it
                return [...prevItems, path];
              }
            });
          }
        }}
        activeOpacity={0.6}
        style={{
          flexDirection: numberColumn === 3 ? 'column' : 'row',
          alignItems: numberColumn === 3 ? 'center' : 'center',
          position: 'relative',
          borderBottomColor: numberColumn === 1 ? '#bdbcbb' : 'rgba(0,0,0,0)',
          borderBottomWidth: numberColumn === 1 ? 0.3 : 0,
        }}>
        {type === 'file' ? (
          <View>
            {isImageFile(folderName) ? (
              <Image
                source={{uri: `file://${path}`}}
                style={{height: 90, width: 90}}
              />
            ) : (
              <Image source={fileIcon} style={{height: 90, width: 90}} />
            )}
          </View>
        ) : (
          <Image
            source={folderIcon}
            style={{
              height: numberColumn === 3 ? 95 : 50,
              width: numberColumn === 3 ? 95 : 50,
            }}
          />
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            width: '100%',
            textAlign: numberColumn === 3 ? 'center' : 'left',
            marginStart: numberColumn === 3 ? '0%' : '2%',
          }}>
          {addEllipsis(folderName, numberColumn === 3 ? 15 : 40)}
        </Text>

        {selectedItems.includes(path) && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setSelectedItems((prevItems: any) => {
                if (prevItems.includes(path)) {
                  // If the item exists, remove it
                  return prevItems.filter((i: any) => i !== path);
                } else {
                  // If the item doesn't exist, add it
                  return [...prevItems, path];
                }
              });
            }}
            style={{
              position: 'absolute',
              paddingHorizontal: '7%',
              paddingVertical: '4%',
              borderRadius: 10,
              top: numberColumn === 3 ? '28%' : '5%',
            }}>
            <Image source={doneIcon} style={{height: 30, width: 30}} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RenderItems;

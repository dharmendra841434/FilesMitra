import {View, Text, FlatList, TextInput} from 'react-native';
import React, {FC, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getPrevFolderPath, removeWordFromPath} from '../utils/helper';
import {ExternalStorageModule} from '../nativeModules/AndroidNativeModules';
import CustomHeader from '../components/CustomHeader';
import useFolderPath from '../stateManagment/useFolderPath';
import useGlobalState from '../stateManagment/useGlobalState';
import CustomModal from '../components/CustomModal';
import AddNewFolder from '../components/AddNewFolder';
import MoreOption from '../components/MoreOption';
import RenderItems from '../components/RenderItems';

type RenderItemType = {
  item: {isHidden: boolean; path: string; name: string; type: string};
};

const OpenFolder: FC = () => {
  const route = useRoute();
  const {prevFolderPath, setPath, setFolderData, folderData, currentPath} =
    useFolderPath();
  const {
    numberColumn,
    moreView,
    setIsOpenModal,
    isOpenModal,
    setSelectedItems,
    selectedItems,
    setMoreView,
  } = useGlobalState();
  const [newFolderName, setNewFolderName] = useState('');
  const inputRef = useRef<TextInput>();
  // console.log(currentPath, 'jkashfks');

  const handCreatefolder = async () => {
    try {
      const result = await ExternalStorageModule?.createNewFolder(
        currentPath,
        newFolderName,
      );
      const files = await ExternalStorageModule.listFilesInPath(currentPath);
      console.log(result);
      setIsOpenModal(false);
      setNewFolderName('');
      setFolderData(files);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      for (let i = 0; i < selectedItems.length; i++) {
        await ExternalStorageModule?.deleteItemAtPath(selectedItems[i]);
      }
      setSelectedItems([]);
      const files = await ExternalStorageModule.listFilesInPath(currentPath);
      setFolderData(files);
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = useNavigation();
  const navigateToFile = async (path: string, folder: string) => {
    try {
      const files = await ExternalStorageModule.listFilesInPath(path);
      setPath(removeWordFromPath(path, folder));
      setFolderData(files);
      navigation.push('open', {
        folderName: folder,
      });
      //setAllFiles(files);
    } catch (error: any) {
      console.log('Error', error.message);
    }
  };

  const handleGoBack = async () => {
    try {
      setSelectedItems([]);
      const files = await ExternalStorageModule.listFilesInPath(prevFolderPath);
      console.log(prevFolderPath, 'prevpath');
      setPath(getPrevFolderPath(prevFolderPath));
      setFolderData(files);
      navigation.goBack();
      //setAllFiles(files);
    } catch (error: any) {
      console.log('Error', error.message);
    }
  };

  const handleSelectAll = async () => {
    for (let i = 0; i < folderData.length; i++) {
      setSelectedItems((prevItems: any) => {
        if (prevItems.includes(folderData[i]?.path)) {
          // If the item exists, remove it
          return prevItems.filter((i: any) => i !== folderData[i]?.path);
        } else {
          // If the item doesn't exist, add it
          return [...prevItems, folderData[i]?.path];
        }
      });
    }
    setMoreView(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <CustomModal
        visible={isOpenModal}
        onClose={() => setIsOpenModal(!isOpenModal)}>
        <AddNewFolder
          onCancel={() => setIsOpenModal(!isOpenModal)}
          onChange={(text: any) => setNewFolderName(text)}
          onCreate={handCreatefolder}
        />
      </CustomModal>
      <CustomHeader
        title={route?.params?.folderName}
        onBack={handleGoBack}
        isBack={true}
        onDelete={handleDelete}
      />
      {folderData?.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{textAlign: 'center', fontSize: 20}}>
            Folder is Epmty
          </Text>
        </View>
      ) : (
        <FlatList
          data={folderData}
          key={numberColumn}
          numColumns={numberColumn}
          renderItem={({item}: RenderItemType) => (
            <RenderItems
              path={item?.path}
              folderName={item?.name}
              type={item?.type}
              navigateToFile={navigateToFile}
            />
          )}
        />
      )}

      {moreView && <MoreOption handleSelectAll={handleSelectAll} />}
    </View>
  );
};

export default OpenFolder;

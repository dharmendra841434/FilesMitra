import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  PermissionModule,
  ExternalStorageModule,
} from '../nativeModules/AndroidNativeModules';
import {request, PERMISSIONS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import {getPrevFolderPath, sortObjectsByName} from '../utils/helper';
import useFolderPath from '../stateManagment/useFolderPath';
import CustomHeader from '../components/CustomHeader';
import useGlobalState from '../stateManagment/useGlobalState';
import CustomModal from '../components/CustomModal';
import AddNewFolder from '../components/AddNewFolder';
import MoreOption from '../components/MoreOption';
import RenderItems from '../components/RenderItems';
import SelectedOptions from '../components/SelectedOptions';

type RenderItemType = {item: {path: string; folderName: string; type: string}};
type NavigateFunction = (
  screenName: string,
  params?: {
    folderName: string;
    data: File[]; // Adjust the File type as needed
  },
) => void;
const RootFolder: FC = () => {
  const [allFiles, setAllFiles] = useState([]);
  const {
    numberColumn,
    moreView,
    setIsOpenModal,
    isOpenModal,
    setSelectedItems,
    selectedItems,
    setMoreView,
  } = useGlobalState();
  const {setPath, setFolderData, currentPath, setCurrentPath} = useFolderPath();
  const [newFolderName, setNewFolderName] = useState('');

  const navigation = useNavigation<NavigateFunction>();

  const checkPermission = () => {
    request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
      .then(status => {
        console.log(status);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const listFiles = async () => {
    try {
      const files = await ExternalStorageModule.listFiles();
      //console.log(getPrevFolderPath(files[0]?.path));
      setCurrentPath(`${getPrevFolderPath(files[0]?.path)}/`);
      setAllFiles(sortObjectsByName(files));
    } catch (error: any) {
      console.log('Error', error.message);
    }
  };

  const navigateToFile = async (path: string, folder: string) => {
    setSelectedItems([]);
    setPath(path);
    try {
      const files = await ExternalStorageModule.listFilesInPath(path);
      console.log(files, 'new files and folders');
      setFolderData(files);
      navigation?.push('open', {
        folderName: folder,
      });
      //setAllFiles(files);
    } catch (error: any) {
      console.log('Error', error.message);
    }
  };

  const handleDelete = async () => {
    try {
      for (let i = 0; i < selectedItems.length; i++) {
        await ExternalStorageModule?.deleteItemAtPath(selectedItems[i]);
      }
      setSelectedItems([]);
      listFiles();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = async () => {
    for (let i = 0; i < allFiles.length; i++) {
      setSelectedItems((prevItems: any) => {
        if (prevItems.includes(allFiles[i]?.path)) {
          // If the item exists, remove it
          return prevItems.filter((i: any) => i !== allFiles[i]?.path);
        } else {
          // If the item doesn't exist, add it
          return [...prevItems, allFiles[i]?.path];
        }
      });
    }

    setMoreView(false);
  };

  const handCreatefolder = async () => {
    try {
      const result = await ExternalStorageModule?.createNewFolder(
        currentPath,
        newFolderName,
      );
      console.log(result?.length);
      setIsOpenModal(false);
      setNewFolderName('');
      listFiles();
    } catch (error) {
      Alert.alert('No Permissions', 'Allow file permissions', [
        {
          text: 'Open App Seeting',
          onPress: () => {
            PermissionModule.requestFileAccessSilently()
              ?.then((grant: any) => {
                console.log(grant, 'media permissions');
              })
              .catch((error: any) => {
                console.log(error);
              });
          },
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    checkPermission();
    listFiles();
  }, []);

  const handGetInfo = async () => {
    try {
      const result = await ExternalStorageModule?.createNewFolder(
        currentPath,
        newFolderName,
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <CustomModal
        visible={isOpenModal}
        onClose={() => setIsOpenModal(!isOpenModal)}>
        <AddNewFolder
          onCancel={() => setIsOpenModal(!isOpenModal)}
          onChange={(text: any) => setNewFolderName(text)}
          onCreate={handCreatefolder}
        />
      </CustomModal>
      <View style={{position: 'relative'}}>
        <CustomHeader
          title="File Manager"
          isBack={false}
          onBack={() => {}}
          onDelete={handleDelete}
        />
      </View>
      <View style={{width: '100%', height: '90%'}}>
        <FlatList
          data={allFiles}
          key={numberColumn}
          numColumns={numberColumn}
          renderItem={({item}: RenderItemType) => (
            <RenderItems
              path={item?.path}
              folderName={item?.folderName}
              type={item?.type}
              navigateToFile={navigateToFile}
            />
          )}
        />
      </View>

      {moreView && (
        <MoreOption
          handleGetInfo={() => {
            setMoreView(false);
            navigation.navigate('info', {
              path: selectedItems[0],
            });
          }}
          handleSelectAll={handleSelectAll}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  counter: {
    fontSize: 32,
    marginBottom: 20,
  },
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

export default RootFolder;

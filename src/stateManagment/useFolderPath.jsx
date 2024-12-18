import {create} from 'zustand';

const useFolderPath = create(set => ({
  prevFolderPath: '',
  folderData: [],
  currentPath: '',
  setFolderData: data => set({folderData: data}),
  setCurrentPath: path => set({currentPath: path}),
  setPath: path => set({prevFolderPath: path}), // Update state correctly
}));

export default useFolderPath;

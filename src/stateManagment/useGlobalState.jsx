import {create} from 'zustand';

const useGlobalState = create(set => ({
  numberColumn: 3,
  moreView: false,
  isOpenModal: false,
  selectedItems: [],
  isModify: '',
  modifiedItems: [],
  setNumberColumn: data => set({numberColumn: data}),
  setMoreView: data => set({moreView: data}),
  setIsOpenModal: data => set({isOpenModal: data}),
  setSelectedItems: updater =>
    set(state => ({
      selectedItems:
        typeof updater === 'function' ? updater(state.selectedItems) : updater,
    })),
  setIsModify: payload => set({isModify: payload}),
  setModifiedItems: data => set({modifiedItems: data}),
}));

export default useGlobalState;

import React, {FC, ReactNode} from 'react';
import {Modal, View, StyleSheet, TouchableWithoutFeedback} from 'react-native';
type propsType = {
  onClose: () => void;
  visible: boolean;
  children: ReactNode;
};

const CustomModal: FC<propsType> = ({visible, onClose, children}) => {
  return (
    <>
      {visible && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 30,
          }}>
          {/* Overlay to close modal when clicking outside */}
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
              {/* Modal Content */}
              <TouchableWithoutFeedback>
                <View style={styles.content}>{children}</View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});

export default CustomModal;

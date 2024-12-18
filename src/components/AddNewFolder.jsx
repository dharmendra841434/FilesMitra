import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const AddNewFolder = ({onCancel, onCreate, onChange}) => {
  return (
    <View style={styles.conatiner}>
      <View style={{width: '100%'}}>
        <Text>Create new folder</Text>
        <TextInput
          onChangeText={onChange}
          style={{
            borderWidth: 0.5,
            borderColor: '#bdbcbb',
            margin: '5%',
            borderRadius: 10,
            paddingStart: '5%',
          }}
          placeholder="Enter folder name"
          placeholderTextColor="#d4d3d2"
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '80%',
          //backgroundColor: 'red',
        }}>
        <TouchableOpacity activeOpacity={0.7} onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCreate} activeOpacity={0.7}>
          <Text>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    alignItems: 'center',
  },
});

export default AddNewFolder;

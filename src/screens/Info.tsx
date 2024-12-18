import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ExternalStorageModule} from '../nativeModules/AndroidNativeModules';
import CustomHeader from '../components/CustomHeader';
import {convertDate} from '../utils/helper';

const Info = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const [details, setdetails] = useState(null);

  const getGetails = async () => {
    const result = await ExternalStorageModule?.getItemDetails(
      router?.params?.path,
    );
    setdetails(result);
    console.log(result, 'item result');
  };

  useEffect(() => {
    getGetails();
  }, []);

  return (
    <View>
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

        <Text
          style={{
            marginStart: '3%',
            fontWeight: '600',
            fontSize: 18,
          }}>
          {details?.name}
        </Text>
      </View>
      <View style={styles.container}>
        <Image
          style={{width: '40%', height: '15%'}}
          source={require('../assets/folder2.png')}
        />
        <View style={{width: '80%', paddingTop: '25%'}}>
          <Text style={{marginVertical: '3%'}}>Name : {details?.name}</Text>
          <Text style={{marginVertical: '3%'}}>Path : {details?.path}</Text>
          <Text style={{marginVertical: '3%'}}>
            IsHidden : {details?.isHidden ? 'Yes' : 'No'}
          </Text>
          <Text style={{marginVertical: '3%'}}>Type : {details?.type}</Text>
          <Text style={{marginVertical: '3%'}}>Size : {details?.size}</Text>
          <Text style={{marginVertical: '3%'}}>
            Last Modified : {convertDate(details?.lastModified)}
          </Text>
          <Text style={{marginVertical: '3%'}}>
            Number of Items : {details?.itemCount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
    position: 'relative',
    paddingTop: '12%',
    backgroundColor: 'white',
    elevation: 2,
    paddingBottom: '4%',
  },
  container: {
    alignItems: 'center',
    height: '100%',
    paddingTop: '15%',
  },
});

export default Info;

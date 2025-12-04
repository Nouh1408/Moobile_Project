import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';

const UseLocation = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [longitude, setLongitude] = useState("")
    const [latitude, setLatitude] = useState("")
    const getUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

            let {coords} = await Location.getCurrentPositionAsync();

            if(coords){
              const {latitude, longitude} = coords;
              console.log("lat and log is ", latitude, longitude);
              setLatitude(latitude.toString());
              setLongitude(longitude.toString());
              let response = await Location.reverseGeocodeAsync({latitude, longitude});
              console.log("response is ", response);
              
            }
          
        }
        useEffect(() => {
            getUserLocation();
          }, [])
        return { latitude, longitude, errorMsg}
      }

export default UseLocation
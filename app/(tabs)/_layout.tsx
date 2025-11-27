import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{headerShown:false, title:"Home"}} />
        <Tabs.Screen name="ReportLostItem" options={{headerShown:false, title:"Report Items"}} />
        <Tabs.Screen name="ReportFoundItem" options={{headerShown:false, title:"Found Items"}} />
        
    </Tabs>
  )
}

export default _layout
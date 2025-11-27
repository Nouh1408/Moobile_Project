import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{headerShown:false, title:"Home"}} />
        <Tabs.Screen name="ReportFoundItem" options={{headerShown:false, title:"Report Item"}} />
        <Tabs.Screen name="ReportlostItem" options={{headerShown:false, title:"Missing Items"}} />
        <Tabs.Screen name="itemCategory" options={{headerShown:false, title:"Item Category"}} />
    </Tabs>
  )
}

export default _layout
import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const ReportlostItem = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="px-2">
        <Text className='font-bold text-4xl'>Report Lost Item</Text>
        <Text className='text-smallText'>Select the category of your lost item</Text>
      </View>
      <View>
        
      </View>
    </SafeAreaView>
  )
}

export default ReportlostItem
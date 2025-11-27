import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryType from '@/components/CategoryType'

const ReportFoundItem = () => {
  return (
      <SafeAreaView className="flex-1 bg-white px-4">
      
      
      <View className="mt-4 mb-6">
        <Text className="font-bold text-4xl">Report Found Item</Text>
        <Text className="text-sm text-slate-600 mt-2">
          Select the category of the item you found
        </Text>
      </View>

      
      <View className="flex-row flex-wrap justify-between">
        
        
        <Pressable className='w-full'>
          <CategoryType iconName="mobile" title="Devices" description="Phones, tablets, laptops" />
        </Pressable>
        <Pressable className='w-full'>
          <CategoryType iconName="wallet" title="Wallets" description="Credit cards, cash, IDs" />
        </Pressable>
        <Pressable className='w-full'>
          <CategoryType iconName="credit-card" title="Ids" description="Identification cards, driver's licenses" />
        </Pressable>

      </View>
    </SafeAreaView>
  )
}

export default ReportFoundItem
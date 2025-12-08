import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryType from '@/components/CategoryType'
import { router, useRouter } from 'expo-router'

const ReportFoundItem = () => {
  const goToForm = () => {
    router.push("/FormFound");
  };
  const route = useRouter();
  return (
      <SafeAreaView className="flex-1 bg-white px-4">
      
      
      <View className="mt-4 mb-6">
        <Text className="font-bold text-4xl">Report Found Item</Text>
        <Text className="text-sm text-slate-600 mt-2">
          Select the category of the item you found
        </Text>
      </View>

      
      <View className="flex-row flex-wrap justify-between">
        
        
        <Pressable className='w-full' onPress={()=>route.push('/FormFound')}>
          <CategoryType iconName="mobile" title="Devices" description="Phones, tablets, laptops" />
        </Pressable>
        <Pressable className='w-full' onPress={()=>route.push('/FormFound')}>
          <CategoryType iconName="wallet" title="Wallets" description="Credit cards, cash, IDs" />
        </Pressable>
        <Pressable className='w-full' onPress={()=>route.push('/FormFound')}>
          <CategoryType iconName="credit-card" title="Ids" description="Identification cards, driver's licenses" />
        </Pressable>
        <Pressable className="w-full" onPress={goToForm}>
              <CategoryType
                iconName="add-to-list"
                title="Other"
                description="Bags, accessories, and other items"
              />
            </Pressable>
        

      </View>
    </SafeAreaView>
  )
}

export default ReportFoundItem
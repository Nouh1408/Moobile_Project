import React, { useState } from 'react'
import { ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
  }

  return (
    <SafeAreaView className='flex-1 p-4'>
      <Text>All Items</Text>
      <TextInput
              placeholder="Search items..."
              clearButtonMode="always"
              autoCapitalize='none'
              autoCorrect={false}
              className="px-5 py-3 border border-gray-400 rounded-2xl border-solid text-base "
              value={searchQuery}
              onChangeText={(query)=>handleSearch(query)}
            />
      <ScrollView>
        <View>
        
        
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Browse
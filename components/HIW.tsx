import { View, Text } from 'react-native'
import React from 'react'

interface CartContent{
    title:string;
    description:string;
    bg?:string;
}

const HIW = ({title, description,bg='white'}:CartContent) => {
  return (
       <View style={{ backgroundColor: bg }} className={`mt-4 p-4 rounded-2xl bg-${bg} shadow-sm border border-gray-200`}>
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-gray-600 leading-relaxed">{description}</Text>
    </View>
  )
}

export default HIW
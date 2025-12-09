import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface ReportFTitleProps {
  text: string;
}

const ReportFTitle = ({text }: ReportFTitleProps) => {
  return (
    <View>
      <Text className="text-2xl font-bold text-gray-800 mb-4">{text}</Text>
    </View>
  )
}

export default ReportFTitle

const styles = StyleSheet.create({})
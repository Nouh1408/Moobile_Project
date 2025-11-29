import { image } from "@/constants/images";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Image, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center pt-8 px-4 bg-white">
      
      <View className="w-full">
        <Image
          source={image.hero}
          className="w-full h-64"
          resizeMode="contain"
        />
      </View>

      
      <View className="flex-row mt-8 gap-3 w-full">
        
        <Pressable 
          className="flex-1 bg-orange-600 py-4 rounded-xl flex-row justify-center items-center"
          onPress={()=>router.push("/ReportLostItem")}
        >
          <SimpleLineIcons name="magnifier" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">Report Lost Item</Text>
        </Pressable>

        
        <Pressable 
          className="flex-1 bg-green-600 py-4 rounded-xl flex-row justify-center items-center"
          onPress={()=>router.push("/ReportFoundItem")}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white font-semibold ml-2">Report Found Item</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

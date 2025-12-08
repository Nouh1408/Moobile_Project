import { image } from "@/constants/images";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Image, Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HIW from "@/components/HIW";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-homeBG">
      <SafeAreaView className="flex-1 items-center pt-8 px-4 ">
      
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
      <View>
          <Text className="text-2xl font-semibold mt-8 text-center">How it Works?</Text>
          <HIW title="1. Report Your Item" description="Lost something? Create a detailed report describing your lost item." bg="#f9ede3"/>
          <HIW title="2. Help Others" description="Found something? Report it to help the owner find it." bg="#e2f1e8"/>
          <HIW title="3. Verify & Recover" description="Answer security questions to prove ownership and recover your item." bg="#e6eefa"/>
        </View>
    </SafeAreaView>
    </ScrollView>
  );
}

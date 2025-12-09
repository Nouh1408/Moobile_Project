import HIW from "@/components/HIW";
import { image } from "@/constants/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../_providers/AuthProvider"; // <-- added

export default function Index() {
  const router = useRouter();
  const { logout } = useAuth(); // <-- added

  return (
    <ScrollView className="flex-1 bg-homeBG">
      <StatusBar backgroundColor={"black"} />
      <SafeAreaView className="flex-1 items-center pt-8 px-4">
        
        {/* TOP BAR WITH LOGOUT */}
        <View className="w-full flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold text-white">Home</Text>

          <Pressable
            onPress={logout}
            className="px-4 py-2 bg-red-600 rounded-lg"
          >
            <Text className="text-white font-semibold">Logout</Text>
          </Pressable>
        </View>

        {/* HERO IMAGE */}
        <View className="w-full">
          <Image
            source={image.hero}
            className="w-full h-64"
            resizeMode="contain"
          />
        </View>

        {/* ACTION BUTTONS */}
        <View className="flex-row mt-8 gap-3 w-full">
          <Pressable
            className="flex-1 bg-orange-600 py-4 rounded-xl flex-row justify-center items-center"
            onPress={() => router.push("/ReportLostItem")}
          >
            <SimpleLineIcons name="magnifier" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">
              Report Lost Item
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-green-600 py-4 rounded-xl flex-row justify-center items-center"
            onPress={() => router.push("/ReportFoundItem")}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">
              Report Found Item
            </Text>
          </Pressable>
        </View>

        {/* HOW IT WORKS */}
        <View>
          <Text className="text-2xl font-semibold mt-8 text-center">
            How it Works?
          </Text>
          <HIW
            title="1. Report Your Item"
            description="Lost something? Create a detailed report describing your lost item."
            bg="#f9ede3"
          />
          <HIW
            title="2. Help Others"
            description="Found something? Report it to help the owner find it."
            bg="#e2f1e8"
          />
          <HIW
            title="3. Verify & Recover"
            description="Answer security questions to prove ownership and recover your item."
            bg="#e6eefa"
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

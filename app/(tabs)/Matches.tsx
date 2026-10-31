// app/(tabs)/Matches.tsx
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "../../_providers/AuthProvider";
import { fetchReports, ReportItem } from "@/lib/reports";

type MatchPair = {
  id: string;
  myReport: ReportItem;
  otherReport: ReportItem;
  percentage: number;
  matchReasons: string[];
};

export default function Matches() {
  const router = useRouter();
  const { user } = useAuth();

  const [matches, setMatches] = useState<MatchPair[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const calculateMatches = (allReports: ReportItem[], currentUserId: string): MatchPair[] => {
    const myReports = allReports.filter(
      (r) => r.user_id === currentUserId && r.status !== "returned"
    );
    const otherReports = allReports.filter(
      (r) => r.user_id !== currentUserId && r.status !== "returned"
    );

    const pairs: MatchPair[] = [];

    for (const mine of myReports) {
      for (const other of otherReports) {
        // Only match opposite types: lost <-> found
        const mineType = (mine.type || "lost").toLowerCase();
        const otherType = (other.type || "lost").toLowerCase();
        if (mineType === otherType) continue;

        let score = 0;
        const reasons: string[] = [];

        // 1. Category match (50 points)
        const myCat = (mine.category || "").toLowerCase().trim();
        const otherCat = (other.category || "").toLowerCase().trim();
        if (myCat && otherCat && (myCat === otherCat || myCat.includes(otherCat) || otherCat.includes(myCat))) {
          score += 50;
          reasons.push("Category match");
        }

        // 2. Title & description word overlaps (up to 30 points)
        const mineWords = `${mine.title} ${mine.description || ""}`
          .toLowerCase()
          .split(/[\s,.-]+/)
          .filter((w) => w.length > 2);
        const otherWords = `${other.title} ${other.description || ""}`
          .toLowerCase()
          .split(/[\s,.-]+/)
          .filter((w) => w.length > 2);

        const commonWords = mineWords.filter((w) => otherWords.includes(w));
        if (commonWords.length > 0) {
          const wordBonus = Math.min(30, commonWords.length * 15);
          score += wordBonus;
          reasons.push(`${commonWords.length} keyword match`);
        }

        // 3. Location overlap (20 points)
        const myLoc = (mine.location || "").toLowerCase().trim();
        const otherLoc = (other.location || "").toLowerCase().trim();
        if (myLoc && otherLoc && (myLoc.includes(otherLoc) || otherLoc.includes(myLoc))) {
          score += 20;
          reasons.push("Campus spot match");
        }

        // Keep matches with meaningful similarity (>= 40%)
        if (score >= 40) {
          pairs.push({
            id: `${mine.id}_${other.id}`,
            myReport: mine,
            otherReport: other,
            percentage: Math.min(score, 98),
            matchReasons: reasons,
          });
        }
      }
    }

    return pairs.sort((a, b) => b.percentage - a.percentage);
  };

  const loadMatches = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const all = await fetchReports();
      const calculated = calculateMatches(all, user.id);
      setMatches(calculated);
    } catch (err) {
      console.warn("Failed to calculate matches:", err);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [loadMatches])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const handleDismiss = (matchId: string) => {
    Alert.alert("Dismiss Match", "Do you want to dismiss this match suggestion?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Dismiss",
        style: "destructive",
        onPress: () => setDismissedIds((prev) => [...prev, matchId]),
      },
    ]);
  };

  const visibleMatches = matches.filter((m) => !dismissedIds.includes(m.id));

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={["top"]}>
      <StatusBar style="dark" />

      {/* ================= HEADER ================= */}
      <View className="px-5 py-3.5 bg-white border-b border-[#E4E4E7] flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Suggested Matches
          </Text>
          <Text className="text-xs text-[#71717A] mt-0.5">
            Auto-matched against campus lost & found posts
          </Text>
        </View>

        <View className="bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-[2px]">
          <Text className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">
            {visibleMatches.length} Found
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066FF" />
        }
      >
        {loading ? (
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-8 items-center justify-center my-6">
            <ActivityIndicator size="small" color="#0066FF" />
            <Text className="text-xs text-[#71717A] font-semibold mt-3 uppercase tracking-wider">
              Comparing your reports…
            </Text>
          </View>
        ) : visibleMatches.length === 0 ? (
          <View className="bg-white border border-[#E4E4E7] rounded-[2px] p-8 items-center justify-center my-6">
            <View className="w-14 h-14 bg-[#F4F5F7] rounded-[2px] items-center justify-center mb-3 border border-[#E4E4E7]">
              <Ionicons name="git-compare-outline" size={28} color="#71717A" />
            </View>
            <Text className="text-sm font-bold text-[#1A1A1A]">No matches detected</Text>
            <Text className="text-xs text-[#71717A] text-center mt-1.5 leading-5 max-w-[280px]">
              When someone reports an item that shares keywords, category, or location with your posts, it will appear here.
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/Browse")}
              className="mt-4 bg-[#1A1A1A] px-4 py-2.5 rounded-[2px]"
            >
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                Browse Campus Feed
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            {visibleMatches.map((item) => (
              <View
                key={item.id}
                className="bg-white border border-[#E4E4E7] rounded-[2px] overflow-hidden"
              >
                {/* Match banner */}
                <View className="bg-[#1A1A1A] px-3.5 py-2 flex-row items-center justify-between border-b border-[#2D2D2D]">
                  <View className="flex-row items-center">
                    <Ionicons name="sparkles" size={13} color="#0066FF" />
                    <Text className="text-white text-xs font-bold ml-1.5">
                      {item.percentage}% Confidence Match
                    </Text>
                  </View>
                  <View className="bg-[#262626] border border-[#3D3D3D] px-2 py-0.5 rounded-[2px]">
                    <Text className="text-[#A1A1AA] text-[10px] font-bold uppercase">
                      {item.matchReasons.join(" • ")}
                    </Text>
                  </View>
                </View>

                {/* Side by side items */}
                <View className="p-3.5 flex-row gap-3">
                  {/* Left: My Report */}
                  <View className="flex-1 bg-[#FAFAFA] border border-[#E4E4E7] rounded-[2px] p-2.5">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="bg-[#1A1A1A] px-1.5 py-0.5 rounded-[2px]">
                        <Text className="text-[9px] font-bold text-white uppercase">Your Post</Text>
                      </View>
                      <Text className="text-[10px] font-bold uppercase text-[#71717A]">
                        {item.myReport.type}
                      </Text>
                    </View>
                    {item.myReport.image_url || item.myReport.imageUri ? (
                      <Image
                        source={{ uri: (item.myReport.image_url || item.myReport.imageUri)! }}
                        className="w-full h-20 rounded-[2px] mb-2 border border-[#E4E4E7]"
                      />
                    ) : (
                      <View className="w-full h-20 bg-[#F4F5F7] rounded-[2px] mb-2 items-center justify-center border border-[#E4E4E7]">
                        <Ionicons name="cube-outline" size={24} color="#A1A1AA" />
                      </View>
                    )}
                    <Text className="text-xs font-bold text-[#1A1A1A]" numberOfLines={1}>
                      {item.myReport.title}
                    </Text>
                    <Text className="text-[10px] text-[#71717A] mt-0.5" numberOfLines={1}>
                      {item.myReport.location || "Campus"}
                    </Text>
                  </View>

                  {/* Right: Potential Match */}
                  <View className="flex-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[2px] p-2.5">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="bg-[#16A34A] px-1.5 py-0.5 rounded-[2px]">
                        <Text className="text-[9px] font-bold text-white uppercase">Matched</Text>
                      </View>
                      <Text className="text-[10px] font-bold uppercase text-[#16A34A]">
                        {item.otherReport.type}
                      </Text>
                    </View>
                    {item.otherReport.image_url || item.otherReport.imageUri ? (
                      <Image
                        source={{ uri: (item.otherReport.image_url || item.otherReport.imageUri)! }}
                        className="w-full h-20 rounded-[2px] mb-2 border border-[#E4E4E7]"
                      />
                    ) : (
                      <View className="w-full h-20 bg-white rounded-[2px] mb-2 items-center justify-center border border-[#E4E4E7]">
                        <Ionicons name="cube-outline" size={24} color="#A1A1AA" />
                      </View>
                    )}
                    <Text className="text-xs font-bold text-[#1A1A1A]" numberOfLines={1}>
                      {item.otherReport.title}
                    </Text>
                    <Text className="text-[10px] text-[#71717A] mt-0.5" numberOfLines={1}>
                      {item.otherReport.location || "Campus"}
                    </Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View className="px-3.5 pb-3.5 flex-row gap-2 border-t border-[#E4E4E7] pt-2.5">
                  <Pressable
                    onPress={() => handleDismiss(item.id)}
                    className="flex-1 py-2 border border-[#E4E4E7] rounded-[2px] items-center justify-center active:bg-[#F4F5F7]"
                  >
                    <Text className="text-xs font-bold text-[#71717A] uppercase tracking-wider">
                      Dismiss
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/ReportDetail",
                        params: { id: item.otherReport.id },
                      } as any)
                    }
                    className="flex-1 py-2 bg-[#0066FF] rounded-[2px] items-center justify-center active:opacity-90"
                  >
                    <Text className="text-xs font-bold text-white uppercase tracking-wider">
                      View & Claim
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


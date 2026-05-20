import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import SubscriptionCard from "@/components/SubscriptionCard";
import { icons } from "@/constants/icons";
import { useSubscriptions } from "@/lib/SubscriptionContext";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptions();

  // Filter subscriptions based on search query
  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return subscriptions;
    }

    const query = searchQuery.toLowerCase().trim();
    return subscriptions.filter((subscription) => {
      const nameMatch = subscription.name.toLowerCase().includes(query);
      const categoryMatch = subscription.category
        ?.toLowerCase()
        .includes(query);
      const planMatch = subscription.plan?.toLowerCase().includes(query);

      return nameMatch || categoryMatch || planMatch;
    });
  }, [searchQuery, subscriptions]);

  const handleSubscriptionPress = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCreateSubscription = (newSubscription: Subscription) => {
    addSubscription(newSubscription);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />

      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View className="mb-5">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-3xl font-bold text-foreground">
                  Subscriptions
                </Text>
                <Pressable
                  onPress={() => setModalVisible(true)}
                  className="p-3 border-[0.5px] border-[lightgrey] rounded-full"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Image source={icons.add} className="size-6" />
                </Pressable>
              </View>

              {/* Search Input */}
              <View className="bg-card rounded-lg border border-border">
                <TextInput
                  placeholder="Search subscriptions..."
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  className="px-4 py-3 text-foreground"
                />
              </View>
            </View>

            {/* Results Count */}
            {searchQuery.trim() && (
              <Text className="text-sm text-mutedForeground mb-3">
                Found {filteredSubscriptions.length} of {subscriptions.length}{" "}
                subscriptions
              </Text>
            )}
          </>
        )}
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3">
            <SubscriptionCard
              icon={item.icon}
              name={item.name}
              price={item.price}
              currency={item.currency || "USD"}
              billing={item.billing}
              category={item.category}
              plan={item.plan}
              renewalDate={item.renewalDate}
              startDate={item.startDate}
              paymentMethod={item.paymentMethod}
              status={item.status}
              color={item.color}
              expanded={expandedId === item.id}
              onPress={() => handleSubscriptionPress(item.id)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-lg text-mutedForeground">
              {searchQuery.trim()
                ? "No subscriptions found"
                : "No subscriptions"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;

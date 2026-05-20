import { useSubscriptions } from "@/lib/SubscriptionContext";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const { subscriptions } = useSubscriptions();
  const screenWidth = Dimensions.get("window").width;

  // Calculate analytics
  const analytics = useMemo(() => {
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "active",
    );

    // Total monthly spending
    const monthlySpending = activeSubscriptions.reduce((total, sub) => {
      if (sub.billing === "Monthly") {
        return total + sub.price;
      } else if (sub.billing === "Yearly") {
        return total + sub.price / 12;
      }
      return total;
    }, 0);

    // Total annual spending
    const annualSpending = activeSubscriptions.reduce((total, sub) => {
      if (sub.billing === "Monthly") {
        return total + sub.price * 12;
      } else {
        return total + sub.price;
      }
    }, 0);

    // Spending by category
    const categorySpending: Record<string, number> = {};
    activeSubscriptions.forEach((sub) => {
      const category = sub.category || "Other";
      const monthlyPrice =
        sub.billing === "Monthly" ? sub.price : sub.price / 12;
      categorySpending[category] =
        (categorySpending[category] || 0) + monthlyPrice;
    });

    // Sort categories by spending
    const categoriesSorted = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .map(([name, spending]) => ({
        name,
        spending,
        percentage: (spending / monthlySpending) * 100,
      }));

    // Upcoming renewals (next 30 days)
    const today = dayjs();
    const upcomingRenewals = activeSubscriptions
      .filter((sub) => {
        const renewalDate = dayjs(sub.renewalDate);
        return (
          renewalDate.isAfter(today) &&
          renewalDate.isBefore(today.add(30, "days"))
        );
      })
      .sort(
        (a, b) => dayjs(a.renewalDate).unix() - dayjs(b.renewalDate).unix(),
      );

    // Most expensive subscriptions
    const mostExpensive = [...activeSubscriptions]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);

    return {
      totalActiveSubscriptions: activeSubscriptions.length,
      monthlySpending,
      annualSpending,
      categoriesSorted,
      upcomingRenewals,
      mostExpensive,
      cancelledCount: subscriptions.filter((sub) => sub.status === "cancelled")
        .length,
      pausedCount: subscriptions.filter((sub) => sub.status === "paused")
        .length,
    };
  }, [subscriptions]);

  const StatCard = ({
    label,
    value,
    subtext,
  }: {
    label: string;
    value: string;
    subtext?: string;
  }) => (
    <View className="bg-card rounded-2xl border border-border p-4 mb-3">
      <Text className="text-sm font-sans-medium text-muted-foreground mb-1">
        {label}
      </Text>
      <Text className="text-2xl font-sans-bold text-primary mb-1">{value}</Text>
      {subtext && (
        <Text className="text-xs font-sans-medium text-muted-foreground">
          {subtext}
        </Text>
      )}
    </View>
  );

  const CategoryBar = ({
    name,
    percentage,
    spending,
  }: {
    name: string;
    percentage: number;
    spending: number;
  }) => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-sans-semibold text-primary flex-1">
          {name}
        </Text>
        <Text className="text-sm font-sans-bold text-primary ml-2">
          {formatCurrency(spending)}
        </Text>
      </View>
      <View className="h-2 bg-muted rounded-full overflow-hidden">
        <View
          className="h-full bg-accent rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={[]} // Empty data array for FlatList structure
        keyExtractor={() => "analytics"}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
            {/* Title */}
            <View className="px-5 pt-5 pb-3">
              <Text className="text-3xl font-sans-bold text-primary">
                Analytics
              </Text>
            </View>

            {/* Key Metrics */}
            <View className="px-5 py-3">
              <StatCard
                label="Monthly Spending"
                value={formatCurrency(analytics.monthlySpending)}
                subtext={`${analytics.totalActiveSubscriptions} active subscriptions`}
              />
              <StatCard
                label="Annual Projection"
                value={formatCurrency(analytics.annualSpending)}
                subtext={`Average ${formatCurrency(analytics.monthlySpending)} per month`}
              />
            </View>

            {/* Subscription Status */}
            <View className="px-5 mb-5">
              <Text className="text-lg font-sans-bold text-primary mb-3">
                Subscription Status
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-card rounded-2xl border border-border p-4 items-center">
                  <Text className="text-2xl font-sans-bold text-accent mb-1">
                    {analytics.totalActiveSubscriptions}
                  </Text>
                  <Text className="text-xs font-sans-semibold text-muted-foreground">
                    Active
                  </Text>
                </View>
                <View className="flex-1 bg-card rounded-2xl border border-border p-4 items-center">
                  <Text className="text-2xl font-sans-bold text-primary mb-1">
                    {analytics.pausedCount}
                  </Text>
                  <Text className="text-xs font-sans-semibold text-muted-foreground">
                    Paused
                  </Text>
                </View>
                <View className="flex-1 bg-card rounded-2xl border border-border p-4 items-center">
                  <Text className="text-2xl font-sans-bold text-destructive mb-1">
                    {analytics.cancelledCount}
                  </Text>
                  <Text className="text-xs font-sans-semibold text-muted-foreground">
                    Cancelled
                  </Text>
                </View>
              </View>
            </View>

            {/* Spending by Category */}
            {analytics.categoriesSorted.length > 0 && (
              <View className="px-5 mb-5">
                <Text className="text-lg font-sans-bold text-primary mb-4">
                  Spending by Category
                </Text>
                <View className="bg-card rounded-2xl border border-border p-5">
                  {analytics.categoriesSorted.map((cat) => (
                    <CategoryBar
                      key={cat.name}
                      name={cat.name}
                      percentage={cat.percentage}
                      spending={cat.spending}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Upcoming Renewals */}
            {analytics.upcomingRenewals.length > 0 && (
              <View className="px-5 mb-5">
                <Text className="text-lg font-sans-bold text-primary mb-3">
                  Upcoming Renewals (30 days)
                </Text>
                {analytics.upcomingRenewals.map((sub) => (
                  <View
                    key={sub.id}
                    className="flex-row items-center justify-between bg-card rounded-2xl border border-border p-4 mb-2"
                  >
                    <View className="flex-1">
                      <Text className="font-sans-semibold text-primary">
                        {sub.name}
                      </Text>
                      <Text className="text-xs text-muted-foreground mt-1">
                        {dayjs(sub.renewalDate).format("MMM DD, YYYY")}
                      </Text>
                    </View>
                    <Text className="font-sans-bold text-primary">
                      {formatCurrency(sub.price)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Most Expensive */}
            <View className="px-5 mb-5">
              <Text className="text-lg font-sans-bold text-primary mb-3">
                Most Expensive Subscriptions
              </Text>
              {analytics.mostExpensive.map((sub, index) => (
                <View
                  key={sub.id}
                  className="flex-row items-center bg-card rounded-2xl border border-border p-4 mb-2"
                >
                  <View className="w-8 h-8 rounded-full bg-accent items-center justify-center mr-3">
                    <Text className="text-xs font-sans-bold text-background">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-sans-semibold text-primary">
                      {sub.name}
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-1">
                      {sub.billing}
                    </Text>
                  </View>
                  <Text className="font-sans-bold text-accent">
                    {formatCurrency(sub.price)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Insights & Recommendations */}
            <View className="px-5 mb-5">
              <Text className="text-lg font-sans-bold text-primary mb-3">
                Recommendations
              </Text>
              <View className="bg-accent/10 rounded-2xl border border-accent/30 p-4">
                {analytics.pausedCount > 0 && (
                  <Text className="text-sm font-sans-medium text-primary mb-2">
                    💡 You have {analytics.pausedCount} paused subscription
                    {analytics.pausedCount > 1 ? "s" : ""}. Consider cancelling
                    if you're no longer using them.
                  </Text>
                )}
                {analytics.monthlySpending > 100 && (
                  <Text className="text-sm font-sans-medium text-primary mb-2">
                    📊 Your monthly spend is{" "}
                    {formatCurrency(analytics.monthlySpending)}. Review your
                    subscriptions regularly to optimize costs.
                  </Text>
                )}
                {analytics.categoriesSorted.length > 0 &&
                  analytics.categoriesSorted[0].percentage > 30 && (
                    <Text className="text-sm font-sans-medium text-primary">
                      ⚠️ {analytics.categoriesSorted[0].name} represents{" "}
                      {Math.round(analytics.categoriesSorted[0].percentage)}% of
                      your spending.
                    </Text>
                  )}
                {analytics.upcomingRenewals.length === 0 &&
                  analytics.pausedCount === 0 && (
                    <Text className="text-sm font-sans-medium text-primary">
                      ✅ Great job! Your subscriptions are well organized.
                    </Text>
                  )}
              </View>
            </View>

            {/* Empty State */}
            {analytics.totalActiveSubscriptions === 0 && (
              <View className="px-5 py-10 items-center">
                <Text className="text-base font-sans-medium text-muted-foreground">
                  No active subscriptions yet. Add one to see analytics!
                </Text>
              </View>
            )}
          </>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
};

export default Analytics;

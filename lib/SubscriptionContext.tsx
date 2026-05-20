import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import React, { createContext, ReactNode, useState } from "react";

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
}

export const SubscriptionContext = createContext<
  SubscriptionContextType | undefined
>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = (newSubscription: Subscription) => {
    setSubscriptions((prev) => [newSubscription, ...prev]);
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = React.useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptions must be used within SubscriptionProvider",
    );
  }
  return context;
};

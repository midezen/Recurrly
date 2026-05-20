declare global {
  interface ListHeadingProps {
    title: string;
  }

  interface TabIconProps {
    focused: boolean;
    icon: any;
  }

  interface SubscriptionCardProps {
    name: string;
    price: number;
    currency: string;
    icon: any;
    billing: string;
    color?: string;
    category?: string;
    plan?: string;
    renewalDate?: string;
    expanded?: boolean;
    onPress?: () => void;
    paymentMethod?: string;
    startDate?: string;
    status?: string;
  }
}

export {};

import {
  AppleIcon,
  BeefIcon,
  CakeIcon,
  MilkIcon,
  PackageIcon,
  ShoppingBasketIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StoreIcon,
  UtensilsIcon,
  CoffeeIcon,
  PizzaIcon,
  IceCreamIcon,
  CookieIcon,
  SandwichIcon,
  SoupIcon,
  SaladIcon,
  FishIcon,
  EggIcon,
  ChevronRightIcon,
} from 'lucide-react-native';

export interface IconMapping {
  [key: string]: {
    icon: any;
    color: string;
  };
}

export const ICON_MAPPING: IconMapping = {
  // Default fallback
  default: {
    icon: PackageIcon,
    color: 'text-gray-600',
  },
  // Icon mappings matching API icon_name values
  AppleIcon: {
    icon: AppleIcon,
    color: 'text-green-600',
  },
  BeefIcon: {
    icon: BeefIcon,
    color: 'text-red-600',
  },
  CakeIcon: {
    icon: CakeIcon,
    color: 'text-amber-600',
  },
  MilkIcon: {
    icon: MilkIcon,
    color: 'text-blue-600',
  },
  PackageIcon: {
    icon: PackageIcon,
    color: 'text-purple-600',
  },
  ShoppingBasketIcon: {
    icon: ShoppingBasketIcon,
    color: 'text-emerald-600',
  },
  // Additional icons for future use
  ShoppingBagIcon: {
    icon: ShoppingBagIcon,
    color: 'text-indigo-600',
  },
  ShoppingCartIcon: {
    icon: ShoppingCartIcon,
    color: 'text-slate-600',
  },
  StoreIcon: {
    icon: StoreIcon,
    color: 'text-slate-600',
  },
  UtensilsIcon: {
    icon: UtensilsIcon,
    color: 'text-orange-600',
  },
  CoffeeIcon: {
    icon: CoffeeIcon,
    color: 'text-brown-600',
  },
  PizzaIcon: {
    icon: PizzaIcon,
    color: 'text-red-700',
  },
  IceCreamIcon: {
    icon: IceCreamIcon,
    color: 'text-pink-500',
  },
  CookieIcon: {
    icon: CookieIcon,
    color: 'text-pink-600',
  },
  SandwichIcon: {
    icon: SandwichIcon,
    color: 'text-yellow-600',
  },
  SoupIcon: {
    icon: SoupIcon,
    color: 'text-orange-700',
  },
  SaladIcon: {
    icon: SaladIcon,
    color: 'text-green-500',
  },
  FishIcon: {
    icon: FishIcon,
    color: 'text-blue-500',
  },
  EggIcon: {
    icon: EggIcon,
    color: 'text-yellow-500',
  },
  ChevronRightIcon: {
    icon: ChevronRightIcon,
    color: 'text-gray-400',
  },
};

export function getCategoryIcon(iconName: string) {
  return ICON_MAPPING[iconName] || ICON_MAPPING.default;
}

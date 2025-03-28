
export interface RepairType {
  id: string;
  title: string;
  description: string;
  estimatedPrice: string;
  estimatedTime: string;
  icon: string;
}

export const commonRepairs: RepairType[] = [
  {
    id: "iphone-battery",
    title: "Battery Replacement",
    description: "Replace your iPhone battery to restore battery life and performance.",
    estimatedPrice: "PKR 8,000-16,000",
    estimatedTime: "1-2 hours",
    icon: "battery-charging",
  },
  {
    id: "screen-repair",
    title: "Screen Replacement",
    description: "Fix cracked or damaged screens for any smartphone model.",
    estimatedPrice: "PKR 15,000-45,000",
    estimatedTime: "1-3 hours",
    icon: "phone",
  },
  {
    id: "earpiece-damage",
    title: "Earpiece Replacement",
    description: "Professional treatment for earpiece-damaged devices.",
    estimatedPrice: "PKR 16,000-45,000",
    estimatedTime: "1-3 days",
    icon: "wrench",
  },
  {
    id: "speaker-replacement",
    title: "Speaker Replacement",
    description: "Fix speaker issues with replacement or cleaning.",
    estimatedPrice: "PKR 10,000-15,000",
    estimatedTime: "1-2 hours",
    icon: "battery",
  },
];

export interface DeviceType {
  id: string;
  name: string;
}

export const deviceTypes: DeviceType[] = [
  { id: "iphone", name: "iPhone" },
  { id: "samsung", name: "Samsung" },
  { id: "pixel", name: "Google Pixel" },
  { id: "oneplus", name: "OnePlus" },
  { id: "xiaomi", name: "Xiaomi" },
  { id: "other", name: "Other" },
];

export interface DeviceModel {
  id: string;
  deviceType: string;
  name: string;
}

export const deviceModels: DeviceModel[] = [
  // iPhone models
  { id: "iphone-15-pro", deviceType: "iphone", name: "iPhone 15 Pro / Pro Max" },
  { id: "iphone-15", deviceType: "iphone", name: "iPhone 15 / 15 Plus" },
  { id: "iphone-14-pro", deviceType: "iphone", name: "iPhone 14 Pro / Pro Max" },
  { id: "iphone-14", deviceType: "iphone", name: "iPhone 14 / 14 Plus" },
  { id: "iphone-13-pro", deviceType: "iphone", name: "iPhone 13 Pro / Pro Max" },
  { id: "iphone-13", deviceType: "iphone", name: "iPhone 13 / 13 Mini" },
  { id: "iphone-se", deviceType: "iphone", name: "iPhone SE (All generations)" },
  { id: "iphone-older", deviceType: "iphone", name: "Other iPhone models" },
  
  // Samsung models
  { id: "samsung-s24", deviceType: "samsung", name: "Galaxy S24 Series" },
  { id: "samsung-s23", deviceType: "samsung", name: "Galaxy S23 Series" },
  { id: "samsung-s22", deviceType: "samsung", name: "Galaxy S22 Series" },
  { id: "samsung-fold", deviceType: "samsung", name: "Galaxy Z Fold Series" },
  { id: "samsung-flip", deviceType: "samsung", name: "Galaxy Z Flip Series" },
  { id: "samsung-older", deviceType: "samsung", name: "Other Samsung models" },
  
  // Other manufacturers would follow the same pattern
];

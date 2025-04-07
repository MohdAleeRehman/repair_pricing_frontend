
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
  { id: "iphone-15-pro-max", deviceType: "iphone", name: "iPhone 15 Pro Max" },
  { id: "iphone-15-pro", deviceType: "iphone", name: "iPhone 15 Pro" },
  { id: "iphone-15-plus", deviceType: "iphone", name: "iPhone 15 Plus" },
  { id: "iphone-15", deviceType: "iphone", name: "iPhone 15" },
  { id: "iphone-14-pro-max", deviceType: "iphone", name: "iPhone 14 Pro Max" },
  { id: "iphone-14-pro", deviceType: "iphone", name: "iPhone 14 Pro" },
  { id: "iphone-14-plus", deviceType: "iphone", name: "iPhone 14 Plus" },
  { id: "iphone-14", deviceType: "iphone", name: "iPhone 14" },
  { id: "iphone-13-pro-max", deviceType: "iphone", name: "iPhone 13 Pro Max" },
  { id: "iphone-13-pro", deviceType: "iphone", name: "iPhone 13 Pro" },
  { id: "iphone-13-mini", deviceType: "iphone", name: "iPhone 13 Mini" },
  { id: "iphone-13", deviceType: "iphone", name: "iPhone 13" },
  { id: "iphone-12-pro-max", deviceType: "iphone", name: "iPhone 12 Pro Max" },
  { id: "iphone-12-pro", deviceType: "iphone", name: "iPhone 12 Pro" },
  { id: "iphone-12-mini", deviceType: "iphone", name: "iPhone 12 Mini" },
  { id: "iphone-12", deviceType: "iphone", name: "iPhone 12" },
  { id: "iphone-11-pro-max", deviceType: "iphone", name: "iPhone 11 Pro Max" },
  { id: "iphone-11-pro", deviceType: "iphone", name: "iPhone 11 Pro" },
  { id: "iphone-11", deviceType: "iphone", name: "iPhone 11" },
  { id: "iphone-xr", deviceType: "iphone", name: "iPhone XR" },
  { id: "iphone-xs-max", deviceType: "iphone", name: "iPhone XS Max" },
  { id: "iphone-xs", deviceType: "iphone", name: "iPhone XS" },
  { id: "iphone-x", deviceType: "iphone", name: "iPhone X" },
  { id: "iphone-8-plus", deviceType: "iphone", name: "iPhone 8 Plus" },
  { id: "iphone-8", deviceType: "iphone", name: "iPhone 8" },
  { id: "iphone-7-plus", deviceType: "iphone", name: "iPhone 7 Plus" },
  { id: "iphone-7", deviceType: "iphone", name: "iPhone 7" },
  { id: "iphone-6s-plus", deviceType: "iphone", name: "iPhone 6s Plus" },
  { id: "iphone-6s", deviceType: "iphone", name: "iPhone 6s" },
  { id: "iphone-6-plus", deviceType: "iphone", name: "iPhone 6 Plus" },
  { id: "iphone-6", deviceType: "iphone", name: "iPhone 6" },
  { id: "iphone-se-2020", deviceType: "iphone", name: "iPhone SE (2nd generation)" },
  { id: "iphone-se-2016", deviceType: "iphone", name: "iPhone SE (1st generation)" },
  
  // Samsung models
  { id: "samsung-s24", deviceType: "samsung", name: "Galaxy S24 Series" },
  { id: "samsung-s23", deviceType: "samsung", name: "Galaxy S23 Series" },
  { id: "samsung-s22", deviceType: "samsung", name: "Galaxy S22 Series" },
  { id: "samsung-fold", deviceType: "samsung", name: "Galaxy Z Fold Series" },
  { id: "samsung-flip", deviceType: "samsung", name: "Galaxy Z Flip Series" },
  { id: "samsung-older", deviceType: "samsung", name: "Other Samsung models" },
  
  // Other manufacturers would follow the same pattern
];

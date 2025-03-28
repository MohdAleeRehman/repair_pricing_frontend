
import { cn } from '@/lib/utils';
import { RepairType } from '@/lib/repairTypes';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  BatteryLow, 
  Settings, 
  Wrench 
} from 'lucide-react';

interface SuggestionButtonProps {
  repair: RepairType;
  onClick: (repair: RepairType) => void;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<unknown>> = {
  'phone': Phone,
  'phone-call': PhoneCall,
  'phone-off': PhoneOff,
  'battery': Battery,
  'battery-charging': BatteryCharging,
  'battery-full': BatteryFull,
  'battery-low': BatteryLow,
  'settings': Settings,
  'wrench': Wrench,
};

const SuggestionButton = ({ repair, onClick, className }: SuggestionButtonProps) => {
  const IconComponent = iconMap[repair.icon as keyof typeof iconMap] || Phone;

  return (
    <button
      onClick={() => onClick(repair)}
      className={cn(
        'bg-white border border-gray-200 rounded-xl py-4 px-5 flex flex-col items-center text-center',
        'hover:shadow-md hover:bg-gray-50 hover:border-blue-200 transition-all duration-300',
        'group w-full',
        className
      )}
      type="button"
    >
      <div className="p-3 rounded-full bg-blue-100 mb-3 group-hover:bg-blue-200 transition-colors">
        <IconComponent className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="font-medium text-sm mb-1">{repair.title}</h3>
      <p className="text-xs text-muted-foreground">{repair.estimatedPrice}</p>
    </button>
  );
};

export default SuggestionButton;

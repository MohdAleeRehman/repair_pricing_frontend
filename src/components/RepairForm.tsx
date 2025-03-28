
import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { 
  deviceTypes, 
  deviceModels, 
  DeviceType, 
  DeviceModel 
} from '@/lib/repairTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RepairFormProps {
  initialIssue?: string;
  className?: string;
  onComplete?: () => void;
}

const RepairForm = ({ initialIssue = '', className, onComplete }: RepairFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    deviceType: '',
    deviceModel: '',
    issueDescription: initialIssue,
    name: '',
    email: '',
    phone: '',
  });
  
  const steps = [
    { title: 'Device Type', description: 'Select your device manufacturer' },
    { title: 'Device Model', description: 'Select your specific model' },
    { title: 'Issue Details', description: 'Describe the problem in detail' },
    { title: 'Contact Information', description: 'How we can reach you' },
    { title: 'Review & Submit', description: 'Confirm your repair request' },
  ];
  
  const filteredModels = deviceModels.filter(
    model => !formData.deviceType || model.deviceType === formData.deviceType
  );
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectDeviceType = (deviceType: DeviceType) => {
    setFormData(prev => ({ ...prev, deviceType: deviceType.id, deviceModel: '' }));
    handleNext();
  };
  
  const handleSelectDeviceModel = (deviceModel: DeviceModel) => {
    setFormData(prev => ({ ...prev, deviceModel: deviceModel.id }));
    handleNext();
  };
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    toast.success('Repair request submitted successfully!', {
      description: 'We will contact you shortly to confirm your appointment.',
    });
    if (onComplete) onComplete();
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!formData.deviceType;
      case 1: return !!formData.deviceModel;
      case 2: return !!formData.issueDescription;
      case 3: return !!formData.name && !!formData.email && !!formData.phone;
      default: return true;
    }
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                  index < currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : index === currentStep 
                      ? 'bg-primary/10 text-primary border border-primary' 
                      : 'bg-secondary text-secondary-foreground'
                )}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span 
                className={cn(
                  'text-xs mt-2 text-center hidden sm:block',
                  index === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
        <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
      </div>
      
      <div className="mb-6">
        {currentStep === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {deviceTypes.map(device => (
              <button
                key={device.id}
                onClick={() => handleSelectDeviceType(device)}
                className={cn(
                  'p-4 rounded-lg border transition-all text-sm',
                  formData.deviceType === device.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                {device.name}
              </button>
            ))}
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2">
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => handleSelectDeviceModel(model)}
                className={cn(
                  'p-4 rounded-lg border transition-all text-sm text-left',
                  formData.deviceModel === model.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                {model.name}
              </button>
            ))}
          </div>
        )}
        
        {currentStep === 2 && (
          <div>
            <label htmlFor="issueDescription" className="block text-sm font-medium mb-2">
              Describe your issue
            </label>
            <textarea
              id="issueDescription"
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
              placeholder="Please provide as much detail as possible about the issue you're experiencing..."
            ></textarea>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-medium mb-4">Review your information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Device Type:</span>
                <span className="font-medium">{deviceTypes.find(d => d.id === formData.deviceType)?.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Device Model:</span>
                <span className="font-medium">{deviceModels.find(m => m.id === formData.deviceModel)?.name}</span>
              </div>
              <div className="flex flex-col pb-2 border-b">
                <span className="text-muted-foreground mb-1">Issue Description:</span>
                <span className="font-medium">{formData.issueDescription}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="px-4"
          >
            Back
          </Button>
        )}
        
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn("ml-auto px-5", !canProceed() && "opacity-50")}
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="ml-auto px-5"
          >
            Submit Request
          </Button>
        )}
      </div>
    </div>
  );
};

export default RepairForm;

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import AnimatedBackground from '@/components/AnimatedBackground';
import ChatMessage from '@/components/ChatMessage';
import { commonRepairs, RepairType } from '@/lib/repairTypes';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchRepairSummary } from '@/lib/api';
import { generateInvoicePDF } from '@/utils/invoice';
import { nanoid } from 'nanoid';
import { deviceTypes, deviceModels } from '@/lib/repairTypes';


const Index = () => {
  const [chat, setChat] = useState<string[]>([
    "👋 Hi! How can I assist you with your phone repair today?"
  ])
  const [step, setStep] = useState<number>(0);
  const [issue, setIssue] = useState("");
  const [deviceVendor, setDeviceVendor] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [deviceModel, setDeviceModel] = useState("");
  const [pricingChoice, setPricingChoice] = useState("");
  const [pricingData, setPricingData] = useState<{ OEM?: string; Aftermarket?: string }>({});
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    serviceType: "",
  });
  const [finalSummary, setFinalSummary] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairType | null>(null);
  const [repairSummary, setRepairSummary] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const validateInputForStep = (input: string): boolean => {
  const normalized = input.trim().toLowerCase();

  if (!normalized) return false;

  switch (step) {
    case 0:
      return commonRepairs.some(r => r.title.toLowerCase() === normalized);
    case 1:
      return deviceTypes.some(d => d.name.toLowerCase() === normalized);
    case 2:
      return deviceModels
        .filter(m => m.deviceType.toLowerCase() === deviceVendor.toLowerCase())
        .some(m => m.name.toLowerCase() === normalized);
    case 4:
      return ["oem", "aftermarket"].includes(normalized);
    case 8:
      return ["yes", "no"].includes(normalized);
    case 9:
      return ["self", "agent"].includes(normalized);
    case 5:
    case 6:
    case 7:
      return input.trim().length >= 3;
    default:
      return true;
  }
};


  const handleUserReply = async (input: string) => {
    const trimmed = input.trim();

    if (!validateInputForStep(trimmed)) {
      setChat(prev => [
        ...prev,
        `🧑‍💻 ${trimmed}`,
        `🤖 Hmm, that doesn't seem right for this step. Please try again using one of the suggested options.`
      ]);
      return;
    }

    setChat(prev => [...prev, `🧑‍💻 ${trimmed}`]);

  const botRespond = async (message: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setChat(prev => [...prev, `🤖 ${message}`]);
      setIsTyping(false);
    }, 1000);
  };

  switch (step) {
    case 0:
      setIssue(input);
      setStep(1);
      await botRespond("Got it! What brand is your device?");
      break;
    case 1:
      setDeviceVendor(input);
      setStep(2);
      await botRespond(`Cool. What model is your ${input}?`);
      break;
    case 2:
      setDeviceModel(input);
      setStep(3);
      await botRespond("🔍 Analyzing the issue...");
      try {
        const response = await fetchRepairSummary(input, issue);
        setFinalSummary(response.final_summary);
        setStep(4);

        // Extract pricing lines only
        const pricingLines = response.final_summary
          .split('\n')
          .filter(line => line.toLowerCase().includes("oem:") || line.toLowerCase().includes("aftermarket:"));
        
        const extractedPrices: { OEM?: string; Aftermarket?: string } = {};
        pricingLines.forEach((line) => {
          if (line.toLowerCase().includes("oem:")) {
            extractedPrices.OEM = line.replace("OEM:", "").trim();
          } else if (line.toLowerCase().includes("aftermarket:")) {
            extractedPrices.Aftermarket = line.replace("Aftermarket:", "").trim();
          }
        });
        setPricingData(extractedPrices);

        if (pricingLines.length) {
          await botRespond("📊 Here are the best options I could find:");
          for (const line of pricingLines) {
            await botRespond(line);
          }
        } else {
          await botRespond("ℹ️ No pricing available for your model.");
        }

        await botRespond("🛠️ Would you like OEM or Aftermarket service?");
      } catch {
        await botRespond("❌ Failed to fetch repair summary.");
      }
      break;
    case 4:
      setPricingChoice(input);
      setStep(5);
      await botRespond("Great! Please enter your full name:");
      break;
    case 5:
      setUserDetails(prev => ({ ...prev, name: input }));
      setStep(6);
      await botRespond("Your contact number please:");
      break;
    case 6:
      setUserDetails(prev => ({ ...prev, phone: input }));
      setStep(7);
      await botRespond("What's your address?");
      break;
    case 7:
      setUserDetails(prev => ({ ...prev, address: input }));
      setStep(8);
      await botRespond("Are you based in Lahore? (Yes/No)");
      break;
    case 8:
      setUserDetails(prev => ({
        ...prev,
        city: input.toLowerCase().includes("yes") ? "Lahore" : "Other",
      }));
      setStep(9);
      await botRespond("How would you like the service? (Self/Agent)");
      break;
    case 9: 
      setUserDetails(prev => ({ ...prev, serviceType: input }));
      setStep(10);

      await botRespond("✅ Thank you! Your repair request has been logged. Our team will contact you shortly.");

      setTimeout(() => {
        const repairId = `RN-PK-${nanoid(4).toUpperCase()}`;

        const payload = {
        repairId,
        issue,
        deviceVendor,
        deviceModel,
        partType: pricingChoice,
        price: pricingData[pricingChoice] || "N/A",
        userDetails: {
          name: userDetails.name,
          phone: userDetails.phone,
          address: userDetails.address,
          city: userDetails.city,
          serviceType: input,
        },
      };

        generateInvoicePDF(payload);
      }, 1500);
      break;
    default:
      break;
  }
};


  const handleSuggestedClick = (suggestion: string) => {
    handleUserReply(suggestion);
  };

  const renderSuggestions = () => {
  if (step === 0) {
    // Common issues
    return (
      <div className="flex flex-wrap gap-2">
        {commonRepairs.map((r) => (
          <Button key={r.id} onClick={() => handleSuggestedClick(r.title)}>
            {r.title}
          </Button>
        ))}
      </div>
    );
  }

  if (step === 1) {
    // Device brands
    return (
      <div className="flex flex-wrap gap-2">
        {deviceTypes.map((brand) => (
          <Button key={brand.id} onClick={() => handleSuggestedClick(brand.name)}>
            {brand.name}
          </Button>
        ))}
      </div>
    );
  }

  if (step === 2 && deviceVendor) {
    // Models filtered by selected vendor
    const filteredModels = deviceModels.filter(
      (model) => model.deviceType.toLowerCase() === deviceVendor.toLowerCase()
    );
    return (
      <div className="flex flex-wrap gap-2">
        {filteredModels.map((model) => (
          <Button key={model.id} onClick={() => handleSuggestedClick(model.name)}>
            {model.name}
          </Button>
        ))}
      </div>
    );
  }

  if (step === 4) {
    // Pricing choice
    return (
      <div className="flex flex-wrap gap-2">
        {["OEM", "Aftermarket"].map((type) => (
          <Button key={type} onClick={() => handleSuggestedClick(type)}>
            {type}
          </Button>
        ))}
      </div>
    );
  }

  if (step === 8) {
    // City confirmation
    return (
      <div className="flex flex-wrap gap-2">
        {["Yes", "No"].map((option) => (
          <Button key={option} onClick={() => handleSuggestedClick(option)}>
            {option}
          </Button>
        ))}
      </div>
    );
  }

  if (step === 9) {
    // Service Type
    return (
      <div className="flex flex-wrap gap-2">
        {["Self", "Agent"].map((option) => (
          <Button key={option} onClick={() => handleSuggestedClick(option)}>
            {option}
          </Button>
        ))}
      </div>
    );
  }

  return null;
};


  const handlePromptSubmit = async (value: string) => {
  setIsLoading(true);
  setPrompt(value);
  setRepairSummary(null); // Clear old response

  try {
    // NOTE: Replace this with actual device parsing logic later
    const device = "iPhone 11";
    const response = await fetchRepairSummary(device, value);

    setRepairSummary(response.final_summary);
    setShowForm(true);

    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  } catch (err) {
    console.error("Error fetching repair summary:", err);
  } finally {
    setIsLoading(false);
  }
};

  const handleSelectRepair = (repair: RepairType) => {
    setSelectedRepair(repair);
    handlePromptSubmit(`I need a ${repair.title}`);
  };
  const handleFormComplete = () => {
    setShowForm(false);
    setPrompt('');
    setSelectedRepair(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto pt-12 pb-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Fast & Quality Repairs
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Smartphone <span className="text-primary">Repairs</span> Made Simple
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Tell us what's wrong with your device, and our experts will fix it for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="gap-2" onClick={() => document.getElementById('repair-input')?.focus()}>
                  Describe Your Issue
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {/* Removed the "View Pricing" button */}
              </div>
              
              <div className="pt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">Same-Day Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">Genuine Parts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">Expert Technicians</span>
                </div>
              </div>
            </div>
            
            <div className="relative flex-1 flex justify-center items-center">
              <div className="absolute w-64 h-64 rounded-full bg-primary/20 filter blur-3xl opacity-70 -z-10"></div>
              <div className="relative">
                <div className="absolute inset-0 border-8 border-primary/5 rounded-3xl -m-3 rotate-6"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-2 shadow-2xl">
                  <div className="w-[240px] h-[480px] rounded-xl overflow-hidden border-8 border-black relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-lg z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary/60">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Prompt Section - Simple and Reliable */}
        <section className="max-w-5xl mx-auto mb-20">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white text-center">
                Tell Us About Your Phone Issue
              </h2>
              <p className="text-blue-100 text-center mt-2">
                Describe what's wrong or select from common repairs below
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border max-w-2xl mx-auto">
  <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pb-4">
    {chat.map((msg, idx) => (
      <ChatMessage
        key={idx}
        message={msg}
        isUser={msg.startsWith("🧑‍💻")}
      />
    ))}

    {isTyping && (
  <div className="flex items-start">
    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg animate-pulse">
      Typing...
    </div>
  </div>
)}
    <div ref={chatEndRef} />
  </div>

  <div className="mt-4">
    <PromptInput key={step} onSubmit={handleUserReply} placeholder="Type your reply..." />
    
    <div className="mt-3">
      {renderSuggestions()}
    </div>
  </div>
</div>

          </div>
        </section>
        
        <section className="max-w-5xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional repair service with OEM parts and warranty
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Fast Repairs</h3>
              <p className="text-muted-foreground text-sm">
                Most repairs completed same-day.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground text-sm">
                All repairs backed by our 1 year warranty.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Genuine Parts</h3>
              <p className="text-muted-foreground text-sm">
                We only use genuine parts for all kinds of repairs.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} REGEN, All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;

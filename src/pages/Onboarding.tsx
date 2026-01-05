// src/pages/Onboarding.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<StepProps>;
}

interface StepProps {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
}

interface OnboardingData {
  displayName: string;
  intention: string;
  preferredTime: string;
  firstRitualType: string;
}

// Step 1: Welcome & Name
function WelcomeStep({ data, updateData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to 4B4KU5</h2>
        <p className="text-gray-400">Let's personalize your experience</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          What should we call you?
        </label>
        <input
          type="text"
          value={data.displayName}
          onChange={(e) => updateData({ displayName: e.target.value })}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );
}

// Step 2: Intention Setting
function IntentionStep({ data, updateData }: StepProps) {
  const intentions = [
    { id: 'mindfulness', label: 'Cultivate mindfulness', icon: '🧘' },
    { id: 'creativity', label: 'Unlock creativity', icon: '🎨' },
    { id: 'focus', label: 'Improve focus', icon: '🎯' },
    { id: 'connection', label: 'Deepen connection', icon: '🔮' },
    { id: 'transformation', label: 'Personal transformation', icon: '🦋' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Set Your Intention</h2>
        <p className="text-gray-400">What brings you to 4B4KU5?</p>
      </div>
      
      <div className="grid gap-3">
        {intentions.map((intention) => (
          <button
            key={intention.id}
            onClick={() => updateData({ intention: intention.id })}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              data.intention === intention.id
                ? 'bg-purple-900/30 border-purple-500 text-white'
                : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <span className="text-2xl">{intention.icon}</span>
            <span className="font-medium">{intention.label}</span>
            {data.intention === intention.id && (
              <Check className="ml-auto w-5 h-5 text-purple-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Preferred Time
function TimeStep({ data, updateData }: StepProps) {
  const times = [
    { id: 'morning', label: 'Morning', desc: '6am - 12pm', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', desc: '12pm - 6pm', icon: '☀️' },
    { id: 'evening', label: 'Evening', desc: '6pm - 10pm', icon: '🌆' },
    { id: 'night', label: 'Night', desc: '10pm - 6am', icon: '🌙' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">When Do You Practice?</h2>
        <p className="text-gray-400">We'll remind you at the perfect time</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {times.map((time) => (
          <button
            key={time.id}
            onClick={() => updateData({ preferredTime: time.id })}
            className={`flex flex-col items-center gap-2 p-6 rounded-lg border transition-all ${
              data.preferredTime === time.id
                ? 'bg-purple-900/30 border-purple-500 text-white'
                : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <span className="text-3xl">{time.icon}</span>
            <span className="font-medium">{time.label}</span>
            <span className="text-xs opacity-60">{time.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 4: First Ritual Selection
function RitualStep({ data, updateData }: StepProps) {
  const rituals = [
    { id: 'meditation', label: 'Guided Meditation', icon: '🕯️', duration: '5 min' },
    { id: 'breathwork', label: 'Breathwork', icon: '💨', duration: '3 min' },
    { id: 'gratitude', label: 'Gratitude Practice', icon: '🙏', duration: '2 min' },
    { id: 'visualization', label: 'Visualization', icon: '✨', duration: '5 min' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your First Ritual</h2>
        <p className="text-gray-400">Start your journey with one of these</p>
      </div>
      
      <div className="grid gap-3">
        {rituals.map((ritual) => (
          <button
            key={ritual.id}
            onClick={() => updateData({ firstRitualType: ritual.id })}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              data.firstRitualType === ritual.id
                ? 'bg-purple-900/30 border-purple-500 text-white'
                : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
          >
            <span className="text-2xl">{ritual.icon}</span>
            <div className="flex-1 text-left">
              <span className="font-medium block">{ritual.label}</span>
              <span className="text-xs opacity-60">{ritual.duration}</span>
            </div>
            {data.firstRitualType === ritual.id && (
              <Check className="w-5 h-5 text-purple-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Main Onboarding Component
export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    displayName: '',
    intention: '',
    preferredTime: '',
    firstRitualType: '',
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const steps: OnboardingStep[] = [
    { id: 'welcome', title: 'Welcome', description: '', component: WelcomeStep },
    { id: 'intention', title: 'Intention', description: '', component: IntentionStep },
    { id: 'time', title: 'Time', description: '', component: TimeStep },
    { id: 'ritual', title: 'First Ritual', description: '', component: RitualStep },
  ];

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.displayName.length >= 2;
      case 1: return !!data.intention;
      case 2: return !!data.preferredTime;
      case 3: return !!data.firstRitualType;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Save onboarding data to user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          display_name: data.displayName,
          intention: data.intention,
          preferred_time: data.preferredTime,
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Update user metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          onboarding_complete: true,
        },
      });

      if (metaError) throw metaError;

      toast.success('Welcome aboard!', 'Your profile is all set up.');
      
      // Navigate to first ritual
      navigate(`/ritual/${data.firstRitualType}`, { replace: true });
    } catch (error) {
      toast.error('Setup failed', 'Please try again.');
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-900">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="pt-8 pb-4">
        <Container size="sm">
          <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-purple-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        </Container>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center">
        <Container size="sm" className="py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent data={data} updateData={updateData} />
            </motion.div>
          </AnimatePresence>
        </Container>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-black/80 backdrop-blur-lg border-t border-gray-900">
        <Container size="sm" className="py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ChevronLeft size={20} />
              Back
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleComplete}
                loading={loading}
                disabled={!canProceed()}
                className="min-w-[120px]"
              >
                Complete
                <Check size={20} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="min-w-[120px]"
              >
                Next
                <ChevronRight size={20} className="ml-2" />
              </Button>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

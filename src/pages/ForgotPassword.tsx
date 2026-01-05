// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Container } from '@/components/layout/Container';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email required', 'Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error('Request failed', error.message);
      } else {
        setSent(true);
        toast.success('Email sent!', 'Check your inbox for the reset link.');
      }
    } catch (err) {
      toast.error('Something went wrong', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <Container size="sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Check your email
            </h1>
            
            <p className="text-gray-400 mb-6">
              We've sent a password reset link to{' '}
              <span className="text-white">{email}</span>
            </p>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  try again
                </button>
              </p>
              
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Container size="sm">
        <div className="w-full max-w-md mx-auto">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            Reset your password
          </h1>
          
          <p className="text-gray-400 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Send reset link
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Container } from '@/components/layout/Container';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Invalid or expired link', 'Please request a new password reset.');
        navigate('/forgot-password');
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validatePassword(password);
    if (errors.length > 0) {
      toast.error('Weak password', `Missing: ${errors.join(', ')}`);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords don\'t match', 'Please make sure both passwords are the same.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error('Reset failed', error.message);
      } else {
        setSuccess(true);
        toast.success('Password updated!', 'You can now log in with your new password.');
        
        // Sign out and redirect to login
        setTimeout(async () => {
          await supabase.auth.signOut();
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      toast.error('Something went wrong', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <Container size="sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Password reset complete
            </h1>
            
            <p className="text-gray-400">
              Redirecting you to login...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const passwordErrors = password ? validatePassword(password) : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Container size="sm">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create new password
          </h1>
          
          <p className="text-gray-400 mb-8">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((req) => {
                    const isValid = !passwordErrors.includes(req);
                    return (
                      <div
                        key={req}
                        className={`text-xs flex items-center gap-1 ${
                          isValid ? 'text-green-400' : 'text-gray-500'
                        }`}
                      >
                        <CheckCircle size={12} />
                        {req}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={passwordErrors.length > 0 || password !== confirmPassword}
              className="w-full"
            >
              Reset password
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

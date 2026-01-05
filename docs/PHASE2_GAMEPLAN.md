# 🎯 Phase 2: Strategic Game Plan for 4B4KU5

Congratulations on the successful deployment! Here's your comprehensive battle plan:

---

## 📋 Overview & Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2 ROADMAP                              │
├─────────────────────────────────────────────────────────────────┤
│  Week 1: Audit & Bug Fixes                                      │
│  ├── Day 1-2: Full User Flow Audit                              │
│  ├── Day 3-4: Auth & Redirect Fixes                             │
│  └── Day 5-7: Loading States & Mobile Layout                    │
│                                                                 │
│  Week 2: Error Handling & Features                              │
│  ├── Day 1-2: Toast Notification System                         │
│  ├── Day 3-4: Forgot Password Flow                              │
│  └── Day 5-7: User Onboarding Tutorial                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 STEP 1: Full User Flow Audit

### 1.1 Create a Testing Checklist

Create a file `TESTING_CHECKLIST.md` in your repo:

```markdown
# 4B4KU5 User Flow Testing Checklist

## 🔐 Authentication Flow
- [ ] Sign-up with email/password works
- [ ] Sign-up validation (email format, password strength)
- [ ] Sign-up error messages display correctly
- [ ] Email verification sent (if enabled)
- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials shows error
- [ ] Logout clears session properly
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authenticated users redirected away from login/signup pages

## 🚀 Onboarding Flow
- [ ] New users directed to onboarding after signup
- [ ] All onboarding steps are accessible
- [ ] Progress is saved between steps
- [ ] Skip option works (if applicable)
- [ ] Completion redirects to main app

## 🕯️ First Ritual Flow
- [ ] Ritual creation works
- [ ] Ritual displays correctly
- [ ] Ritual completion saves to database
- [ ] Success feedback shown

## 👤 Profile Page
- [ ] Profile loads with user data
- [ ] Edit profile works
- [ ] Avatar upload works (if applicable)
- [ ] Settings save correctly

## 📱 Mobile Responsiveness
- [ ] All pages render correctly on mobile (375px)
- [ ] Navigation is accessible on mobile
- [ ] Forms are usable on mobile
- [ ] Touch targets are adequate size (min 44px)
- [ ] No horizontal scroll

## ⏳ Loading States
- [ ] Auth loading shows indicator
- [ ] Page transitions have loading states
- [ ] API calls show loading feedback
- [ ] Skeleton loaders where appropriate
```

### 1.2 Manual Testing Script

Run through this exact flow and document every issue:

```bash
# Testing Environment Setup
1. Open Chrome DevTools (F12)
2. Go to Network tab → Check "Disable cache"
3. Go to Application tab → Clear all storage
4. Open Console tab → Watch for errors

# Test in these viewports:
- Desktop: 1920x1080
- Tablet: 768x1024  
- Mobile: 375x667
```

### 1.3 Bug Tracking Template

Create `BUG_TRACKER.md`:

```markdown
# Bug Tracker

## Critical (Blocks user flow)
| ID | Description | Steps to Reproduce | Status |
|----|-------------|-------------------|--------|
| C1 | | | |

## High (Major UX issue)
| ID | Description | Steps to Reproduce | Status |
|----|-------------|-------------------|--------|
| H1 | | | |

## Medium (Minor UX issue)
| ID | Description | Steps to Reproduce | Status |
|----|-------------|-------------------|--------|
| M1 | | | |

## Low (Polish)
| ID | Description | Steps to Reproduce | Status |
|----|-------------|-------------------|--------|
| L1 | | | |
```

---

## 🔧 STEP 2: Fix Auth Redirects

### 2.1 Create a Robust Auth Context

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle redirects based on auth events
        if (event === 'SIGNED_IN') {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
        
        if (event === 'SIGNED_OUT') {
          navigate('/login', { replace: true });
        }

        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password', { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2.2 Create Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireOnboarding = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs onboarding
  if (requireOnboarding && !user.user_metadata?.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
```

### 2.3 Create Public Route Component (Redirect if logged in)

```typescript
// src/components/PublicRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    // Redirect to the page they came from, or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
```

### 2.4 Update Router Configuration

```typescript
// src/App.tsx or src/routes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { Toaster } from '@/components/ui/Toaster';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Ritual from '@/pages/Ritual';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ritual/:id?"
            element={
              <ProtectedRoute requireOnboarding>
                <Ritual />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireOnboarding>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## ⏳ STEP 3: Loading States

### 3.1 Create Loading Components

```typescript
// src/components/ui/LoadingSpinner.tsx
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-purple-500 border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  );
}
```

```typescript
// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-800/50',
        className
      )}
    />
  );
}

// Pre-built skeleton components
export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function RitualCardSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
```

### 3.2 Create Page Loading Wrapper

```typescript
// src/components/ui/PageLoader.tsx
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="relative">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 blur-3xl bg-purple-500/20 rounded-full" />
        
        <LoadingSpinner size="lg" />
      </div>
      
      <p className="mt-4 text-gray-400 animate-pulse">{message}</p>
    </div>
  );
}
```

### 3.3 Create Button Loading State

```typescript
// src/components/ui/Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <LoadingSpinner size="sm" className="mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

---

## 📱 STEP 4: Mobile Layout Fixes

### 4.1 Create Responsive Container

```typescript
// src/components/layout/Container.tsx
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ 
  children, 
  className,
  size = 'lg' 
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className={cn(
      'w-full mx-auto px-4 sm:px-6 lg:px-8',
      sizes[size],
      className
    )}>
      {children}
    </div>
  );
}
```

### 4.2 Create Mobile Navigation

```typescript
// src/components/layout/MobileNav.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Compass, 
  User, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/ritual', label: 'Rituals', icon: Compass },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-lg border-b border-gray-800">
          <Link to="/dashboard" className="text-xl font-bold text-white">
            4B4KU5
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-gray-900 border-l border-gray-800 lg:hidden"
            >
              <div className="flex flex-col h-full pt-16">
                <div className="flex-1 px-4 py-6 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                          isActive
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        )}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <div className="px-4 py-6 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Alternative for mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-black/90 backdrop-blur-lg border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
```

### 4.3 Responsive Utilities CSS

```css
/* src/styles/responsive.css */

/* Safe area insets for notched devices */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Mobile-first touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Prevent text size adjustment on orientation change */
html {
  -webkit-text-size-adjust: 100%;
}

/* Better tap highlighting */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Scroll behavior */
.scroll-smooth {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Mobile form inputs */
@media (max-width: 640px) {
  input, select, textarea {
    font-size: 16px !important; /* Prevents zoom on iOS */
  }
}
```

---

## 🔔 STEP 5: Toast Notification System

### 5.1 Create Toast Context and Components

```typescript
// src/contexts/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 7000 });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ 
      toasts, 
      addToast, 
      removeToast,
      success,
      error,
      info,
      warning
    }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
function ToastContainer({ 
  toasts, 
  removeToast 
}: { 
  toasts: Toast[]; 
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Individual Toast Component
function ToastItem({ 
  toast, 
  onClose 
}: { 
  toast: Toast; 
  onClose: () => void;
}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-green-900/90 border-green-700 text-green-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-blue-900/90 border-blue-700 text-blue-100',
    warning: 'bg-yellow-900/90 border-yellow-700 text-yellow-100',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-xl',
        colors[toast.type]
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[toast.type])} />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}
      </div>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
```

### 5.2 Usage Example

```typescript
// Example usage in a component
import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Saved!', 'Your changes have been saved successfully.');
    } catch (error) {
      toast.error('Save failed', error.message);
    }
  };

  return (
    <button onClick={handleSave}>Save</button>
  );
}
```

---

## 🔑 STEP 6: Forgot Password Flow

### 6.1 Forgot Password Page

```typescript
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
```

### 6.2 Reset Password Page

```typescript
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
```

### 6.3 Supabase Email Template Configuration

Go to your Supabase dashboard → Authentication → Email Templates:

```html
<!-- Password Reset Email Template -->
<h2>Reset Your Password</h2>

<p>Hello,</p>

<p>We received a request to reset your password for your 4B4KU5 account.</p>

<p>Click the button below to reset your password:</p>

<a href="{{ .ConfirmationURL }}" style="
  display: inline-block;
  background: #7c3aed;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
">
  Reset Password
</a>

<p style="margin-top: 24px; color: #666;">
  If you didn't request this, you can safely ignore this email.
</p>

<p style="color: #666;">
  This link will expire in 24 hours.
</p>
```

---

## 📚 STEP 7: User Onboarding Tutorial

### 7.1 Create Onboarding Flow

```typescript
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
```

### 7.2 In-App Feature Tutorial (Tooltips)

```typescript
// src/components/tutorial/TutorialOverlay.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TutorialStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="dashboard"]',
    title: 'Your Dashboard',
    content: 'This is your home base. Track your progress and access your rituals.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="ritual-card"]',
    title: 'Your Rituals',
    content: 'Each card represents a ritual. Tap to start your practice.',
    position: 'top',
  },
  {
    target: '[data-tutorial="streak"]',
    title: 'Stay Consistent',
    content: 'Build your streak by completing rituals daily. Don\'t break the chain!',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="profile"]',
    title: 'Your Profile',
    content: 'Customize your experience and track your journey here.',
    position: 'left',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const step = tutorialSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  const getTooltipPosition = () => {
    if (!targetRect) return {};
    
    const padding = 16;
    
    switch (step.position) {
      case 'top':
        return {
          bottom: window.innerHeight - targetRect.top + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + padding,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + padding,
          transform: 'translateY(-50%)',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay with spotlight */}
      <div className="absolute inset-0 bg-black/80">
        {targetRect && (
          <div
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] rounded-lg"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
      >
        <X size={24} />
      </button>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-10 w-72 p-4 bg-gray-900 rounded-xl border border-gray-800 shadow-xl"
          style={getTooltipPosition()}
        >
          {/* Arrow */}
          <div
            className={`absolute w-3 h-3 bg-gray-900 border-gray-800 transform rotate-45 ${
              step.position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-r border-b' :
              step.position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 border-l border-t' :
              step.position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-t border-r' :
              'left-[-6px] top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.content}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentStep ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {tutorialSteps.length}
            </span>
            
            <Button size="sm" onClick={handleNext}>
              {currentStep === tutorialSteps.length - 1 ? 'Done' : 'Next'}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight size={16} className="ml-1" />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

### 7.3 Tutorial Hook

```typescript
// src/hooks/useTutorial.ts
import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = '4b4ku5_tutorial_complete';

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);

  useEffect(() => {
    const isComplete = localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
    setTutorialComplete(isComplete);
    
    // Show tutorial for new users after a slight delay
    if (!isComplete) {
      const timer = setTimeout(() => setShowTutorial(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setTutorialComplete(true);
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setTutorialComplete(false);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    tutorialComplete,
    completeTutorial,
    resetTutorial,
  };
}
```

---

## 🗂️ STEP 8: Database Schema Updates

### 8.1 Supabase Migration for Profiles

```sql
-- Run this in Supabase SQL Editor

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  intention TEXT,
  preferred_time TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  tutorial_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## ✅ STEP 9: Final Testing Checklist

```markdown
# Pre-Launch Final Checklist

## 🔐 Authentication
- [ ] Sign up creates account and profile
- [ ] Login works with correct credentials
- [ ] Login fails gracefully with wrong credentials
- [ ] Forgot password sends email
- [ ] Reset password updates password
- [ ] Logout clears all state
- [ ] Protected routes redirect properly
- [ ] Auth persists on page refresh

## 🚀 Onboarding
- [ ] All steps work correctly
- [ ] Data saves to database
- [ ] Skip/back navigation works
- [ ] Completion redirects properly
- [ ] Returning users skip onboarding

## 🕯️ First Ritual
- [ ] Ritual loads correctly
- [ ] Timer/progress works
- [ ] Completion saves to database
- [ ] Success feedback shown
- [ ] Navigation back to dashboard works

## 👤 Profile
- [ ] Profile loads with user data
- [ ] Edit functionality works
- [ ] Changes save correctly
- [ ] Tutorial replay option works

## 📱 Responsive Design
- [ ] Desktop (1920x1080) ✓
- [ ] Laptop (1366x768) ✓
- [ ] Tablet (768x1024) ✓
- [ ] Mobile (375x667) ✓
- [ ] Mobile landscape ✓

## ⏳ Loading States
- [ ] All async operations show loading
- [ ] Skeleton loaders appear
- [ ] No flash of empty content
- [ ] Graceful error handling

## 🔔 Toasts
- [ ] Success toasts appear and dismiss
- [ ] Error toasts appear with helpful messages
- [ ] Toasts stack correctly
- [ ] Mobile positioning correct

## 🌐 Performance
- [ ] Initial load under 3 seconds
- [ ] No console errors
- [ ] No memory leaks
- [ ] Images optimized
```

---

## 📊 Deployment Commands

```bash
# Run before deployment
npm run lint
npm run type-check
npm run build

# Test build locally
npm run preview

# Deploy to Netlify
git add .
git commit -m "Phase 2: Complete user flow with error handling and onboarding"
git push origin main

# Netlify will auto-deploy from GitHub
```

---

## 🎯 Summary Timeline

| Day | Tasks |
|-----|-------|
| **1** | Full user flow audit, document all bugs |
| **2** | Fix auth redirects and context |
| **3** | Implement loading states throughout |
| **4** | Fix all mobile layout issues |
| **5** | Implement toast notification system |
| **6** | Build forgot/reset password flow |
| **7** | Create onboarding flow |
| **8** | Build in-app tutorial system |
| **9** | Integration testing |
| **10** | Final bug fixes and deploy |

---

Would you like me to:
1. **Start implementing any specific step** with complete code?
2. **Create the Supabase database migrations** first?
3. **Set up the testing framework** for automated tests?
4. **Review your current codebase** from the GitHub repo to customize the plan?

Let me know which piece you'd like to tackle first! 🚀

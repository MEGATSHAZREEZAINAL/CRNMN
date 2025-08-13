import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../primitives/Card';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Badge } from '../primitives/Badge';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, className }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, signUp, loading, error } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.businessName) {
        newErrors.businessName = 'Business name is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let result;
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(
          formData.email,
          formData.password,
          formData.businessName,
          UserRole.OWNER,
        );
      }

      if (!result.error) {
        onSuccess?.();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };

  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-dark-900 p-4', className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-mesh opacity-30"></div>

      <div className="relative w-full max-w-md">
        <Card variant="elevated" className="backdrop-blur-md shadow-elevation-4">
          <CardHeader className="text-center">
            {/* Brand logo */}
            <div className="w-16 h-16 bg-brand-electric rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-dark-900 font-display text-display-sm font-bold">C</span>
            </div>

            <h1 className="font-display text-display-sm text-brand-electric mb-2">CORNMAN</h1>
            <p className="text-body-md text-dark-400 font-mono">Strategic HQ</p>

            <div className="flex gap-2 justify-center mt-4">
              <Button
                variant={mode === 'signin' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setMode('signin')}
              >
                Sign In
              </Button>
              <Button
                variant={mode === 'signup' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setMode('signup')}
              >
                Sign Up
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                placeholder="your@email.com"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                }
                fullWidth
              />

              {/* Business name field (signup only) */}
              {mode === 'signup' && (
                <Input
                  label="Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange('businessName')}
                  error={errors.businessName}
                  placeholder="Your Business Name"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                  fullWidth
                />
              )}

              {/* Password field */}
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                placeholder="••••••••"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                }
                fullWidth
              />

              {/* Confirm password field (signup only) */}
              {mode === 'signup' && (
                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  fullWidth
                />
              )}

              {/* Error display */}
              {error && (
                <div className="p-3 bg-accent-red/20 border border-accent-red/30 rounded-lg">
                  <p className="text-accent-red font-mono text-body-sm">{error}</p>
                </div>
              )}

              {/* Success message for signup */}
              {mode === 'signup' && !error && (
                <div className="p-3 bg-brand-electric/20 border border-brand-electric/30 rounded-lg">
                  <p className="text-brand-electric font-mono text-body-sm">
                    Check your email to verify your account
                  </p>
                </div>
              )}

              {/* Submit button */}
              <Button type="submit" loading={loading} fullWidth size="lg" className="mt-6">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>

              {/* Additional info */}
              <div className="text-center space-y-2">
                <p className="text-body-sm text-dark-400 font-mono">
                  {mode === 'signin' ? 'New to CORNMAN?' : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="ml-2 text-brand-electric hover:text-brand-electric-light transition-colors"
                  >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                {mode === 'signup' && (
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="brand" size="sm">
                      OWNER
                    </Badge>
                    <span className="text-caption text-dark-400 font-mono">
                      Full access included
                    </span>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials note */}
        <div className="mt-6 text-center">
          <p className="text-body-sm text-dark-500 font-mono">
            Demo Mode: Create account or sign in to sync data
          </p>
        </div>
      </div>
    </div>
  );
};

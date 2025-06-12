'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { pb } from '@/lib/pb';
import { UsersFormData, UserSocials } from '@/api/extended_types';
import { UsersRoleOptions } from '@/api/api_types';

type FormErrors = {
  [key in keyof UsersFormData]?: string;
} & {
  general?: string;
};

export default function SignUpForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<UsersFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    bio: '',
    avatar: '',
    socials: {
      twitter: '',
      github: ''
    },
    agreeToTerms: false,
    role: UsersRoleOptions.user
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = useCallback((password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.username) {
      if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username =
          'Username can only contain letters, numbers, hyphens, and underscores';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof UsersFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }

      if (field === 'password') {
        setPasswordStrength(calculatePasswordStrength(value));
      }
    },
    [errors, calculatePasswordStrength]
  );

  const handleSocialChange = useCallback(
    (platform: keyof UserSocials, value: string) => {
      setFormData(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [platform]: value
        }
      }));
    },
    []
  );

  const handleAvatarUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'File size must be less than 2MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Please select a valid image file'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
        setErrors(prev => ({ ...prev, avatar: undefined }));
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const base64ToFile = useCallback((base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors(prev => ({ ...prev, general: undefined }));

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData: any = {
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        role: formData.role || UsersRoleOptions.user
      };

      if (formData.username) userData.username = formData.username;
      if (formData.bio) userData.bio = formData.bio;

      if (formData.socials?.twitter || formData.socials?.github) {
        userData.socials = {
          ...(formData.socials.twitter && {
            twitter: formData.socials.twitter
          }),
          ...(formData.socials.github && { github: formData.socials.github })
        };
      }

      if (formData.avatar && formData.avatar.startsWith('data:')) {
        const avatarFile = base64ToFile(formData.avatar, 'avatar.jpg');
        userData.avatar = avatarFile;
      }

      await pb.collection('users').create(userData);

      try {
        if (!formData.email || !formData.password) {
          throw new Error('Email and password are required');
        }
        await pb
          .collection('users')
          .authWithPassword(formData.email, formData.password);
        router.push('/blog');
      } catch (loginError) {
        console.warn('Auto-login failed:', loginError);
        router.push('/auth/sign-in');
      }
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.response?.data) {
        const errorData = error.response.data;
        const newErrors: FormErrors = {};

        if (errorData.email) {
          newErrors.email = Array.isArray(errorData.email.message)
            ? errorData.email.message[0]
            : errorData.email.message || 'Email error';
        }
        if (errorData.username) {
          newErrors.username = Array.isArray(errorData.username.message)
            ? errorData.username.message[0]
            : errorData.username.message || 'Username error';
        }
        if (errorData.password) {
          newErrors.password = Array.isArray(errorData.password.message)
            ? errorData.password.message[0]
            : errorData.password.message || 'Password error';
        }

        if (Object.keys(newErrors).length === 0) {
          newErrors.general =
            errorData.message || 'Registration failed. Please try again.';
        }

        setErrors(newErrors);
      } else {
        setErrors({
          general:
            'Registration failed. Please check your connection and try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={e => handleInputChange('username', e.target.value)}
                className={errors.username ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional. Used for your profile URL.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  className={
                    errors.password ? 'border-destructive pr-10' : 'pr-10'
                  }
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className={cn(
                          'h-1 w-full rounded-full transition-colors',
                          passwordStrength >= level
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            : 'bg-muted'
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      {formData.password.length >= 8 ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={e =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  className={
                    errors.confirmPassword
                      ? 'border-destructive pr-10'
                      : 'pr-10'
                  }
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Information</h3>

          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {formData.avatar ? (
                <div className="relative">
                  <img
                    src={formData.avatar || '/placeholder.svg'}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, avatar: '' }))
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>Upload Image</span>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. JPG, PNG up to 2MB.
                </p>
              </div>
            </div>
            {errors.avatar && (
              <p className="text-sm text-destructive">{errors.avatar}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className={errors.bio ? 'border-destructive' : ''}
              rows={3}
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Optional. A brief description about yourself.</span>
              <span>{formData.bio?.length || 0}/500</span>
            </div>
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Social Links</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Twitter username"
                value={formData.socials?.twitter || ''}
                onChange={e => handleSocialChange('twitter', e.target.value)}
                disabled={isLoading}
              />
              <Input
                placeholder="GitHub username"
                value={formData.socials?.github || ''}
                onChange={e => handleSocialChange('github', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Optional. Add your social media profiles.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center space-x-2">
          <input
            id="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms || false}
            onChange={e => handleInputChange('agreeToTerms', e.target.checked)}
            className="rounded border-gray-300"
            disabled={isLoading}
          />
          <Label htmlFor="agreeToTerms" className="text-sm">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </div>
  );
}

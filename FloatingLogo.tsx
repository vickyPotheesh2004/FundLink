import React from 'react';
import { Rocket, TrendingUp, Star, Zap } from 'lucide-react';

interface FloatingLogoProps {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animation?: 'float' | 'delayed' | 'slow';
}

export function FloatingLogo({ 
  variant = 'primary', 
  size = 'md', 
  position = 'top-right',
  animation = 'float'
}: FloatingLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const animationClasses = {
    float: 'floating-animation',
    delayed: 'floating-animation-delayed', 
    slow: 'floating-animation-slow'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white',
    secondary: 'bg-gradient-to-br from-purple-500 to-purple-700 text-white',
    accent: 'bg-gradient-to-br from-cyan-500 to-cyan-700 text-white'
  };

  const icons = {
    primary: Rocket,
    secondary: TrendingUp,
    accent: Star
  };

  const Icon = icons[variant];

  return (
    <div 
      className={`
        fixed ${positionClasses[position]} z-50 
        ${sizeClasses[size]} ${variantClasses[variant]} 
        ${animationClasses[animation]}
        rounded-full flex items-center justify-center
        shadow-lg backdrop-blur-sm border border-white/20
        opacity-80 hover:opacity-100 transition-opacity
      `}
    >
      <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`} />
    </div>
  );
}

export function FloatingLogos() {
  return (
    <>
      <FloatingLogo variant="primary" position="top-right" animation="float" />
      <FloatingLogo variant="secondary" position="top-left" animation="delayed" size="sm" />
      <FloatingLogo variant="accent" position="bottom-right" animation="slow" size="sm" />
      <div className="fixed top-20 right-20 z-40 opacity-60">
        <div className="floating-animation-slow">
          <Zap className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      <div className="fixed bottom-20 left-20 z-40 opacity-60">
        <div className="floating-animation-delayed">
          <Star className="w-4 h-4 text-purple-400" />
        </div>
      </div>
    </>
  );
}
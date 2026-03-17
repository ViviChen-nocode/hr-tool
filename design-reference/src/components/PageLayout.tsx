import React, { ReactNode } from 'react';
import { Footer, FooterProps } from './Footer';
import { FloatingMascot, FloatingMascotProps } from './FloatingMascot';

export interface PageLayoutProps {
  children: ReactNode;
  footerProps: FooterProps;
  mascotProps: FloatingMascotProps;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  footerProps,
  mascotProps,
  className = '',
}) => {
  return (
    <div className={`min-h-screen py-8 px-4 flex flex-col overflow-x-hidden ${className}`}>
      <div className="max-w-2xl mx-auto flex-1 w-full">
        {children}
        <Footer {...footerProps} />
      </div>
      <FloatingMascot {...mascotProps} />
    </div>
  );
};


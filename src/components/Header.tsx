import React from 'react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonText?: string;
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title,
  showBackButton = false,
  onBackClick,
  backButtonText = 'Back',
  className = '',
  children
}) => {
  return (
    <header className={`bg-white shadow ${className}`}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && onBackClick && (
              <button 
                onClick={onBackClick}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
                {backButtonText}
              </button>
            )}
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              {title}
            </h2>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
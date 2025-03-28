
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/aba0fd10-0214-4ddd-9c29-aaa4de7b4214.png" 
              alt="REGEN Logo" 
              className="h-8" 
            />
          </a>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#repair-prompt" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
            Services
          </a>
          <a href="#" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
            About
          </a>
          <a href="#" className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
            Contact
          </a>
          <a 
            href="#" 
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Track Repair
          </a>
        </nav>
        
        <button 
          className="md:hidden text-primary p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-md py-4 px-6 animate-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#repair-prompt" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#" 
              className="text-sm font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <a 
              href="#" 
              className="w-full px-4 py-2 mt-2 rounded-full bg-primary text-primary-foreground text-sm font-medium text-center hover:bg-primary/90 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Track Repair
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

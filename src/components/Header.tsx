import { Button } from "@/components/ui/button";
import { Menu, X, User, Briefcase, Newspaper, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "./LoginModal";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect active section for scroll-based highlighting
      const sections = ['profil', 'program', 'berita'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Triple-click logo to open admin login
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    // Reset click count after 1 second
    setTimeout(() => {
      setClickCount(0);
    }, 1000);
    
    if (clickCount === 2) { // Third click
      setIsLoginModalOpen(true);
      setClickCount(0);
    }
  };

  const navLinks = [
    { href: "#profil", label: "Profil", icon: User },
    { href: "#program", label: "Program Kerja", icon: Briefcase },
    { href: "#berita", label: "Berita & Kegiatan", icon: Newspaper },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center h-20">
          {/* Logo - Left */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover:scale-105 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="text-primary-foreground font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline-block">
              Setiya Utama
            </span>
          </button>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-1 mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  <span className="relative flex items-center gap-2">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    {link.label}
                  </span>
                  {/* Underline indicator */}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full bg-primary transition-all duration-300 ${
                    isActive ? 'w-full' : 'group-hover:w-full'
                  }`} />
                  {/* Hover background */}
                  <span className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Menu 
                className={`absolute w-6 h-6 text-foreground transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`}
              />
              <X 
                className={`absolute w-6 h-6 text-foreground transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-border/40">
            <nav className="flex flex-col py-2 bg-background/95 backdrop-blur-md">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = activeSection === link.href.substring(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`group relative px-4 py-3 mx-2 rounded-lg text-base font-medium flex items-center justify-between transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${
                        isActive || window.matchMedia('(hover: hover)').matches 
                          ? 'group-hover:scale-110' 
                          : ''
                      }`} />
                      {link.label}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                      isActive || window.matchMedia('(hover: hover)').matches
                        ? 'group-hover:translate-x-1'
                        : ''
                    }`} />
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
};

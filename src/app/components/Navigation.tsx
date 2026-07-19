import { Smile, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-900">OdontoBarrio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('servicios')} className="text-gray-700 hover:text-blue-600 transition">
              Servicios
            </button>
            <button onClick={() => scrollToSection('horarios')} className="text-gray-700 hover:text-blue-600 transition">
              Horarios
            </button>
            <button onClick={() => scrollToSection('precios')} className="text-gray-700 hover:text-blue-600 transition">
              Precios
            </button>
            <button onClick={() => scrollToSection('agendar')} className="text-gray-700 hover:text-blue-600 transition">
              Cómo Agendar
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Contacto
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('servicios')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              Servicios
            </button>
            <button 
              onClick={() => scrollToSection('horarios')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              Horarios
            </button>
            <button 
              onClick={() => scrollToSection('precios')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              Precios
            </button>
            <button 
              onClick={() => scrollToSection('agendar')} 
              className="block w-full text-left text-gray-700 hover:text-blue-600 transition"
            >
              Cómo Agendar
            </button>
            <button 
              onClick={() => scrollToSection('contacto')} 
              className="block w-full text-left bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Contacto
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

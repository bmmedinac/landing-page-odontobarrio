import { MapPin, Clock, Phone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative pt-16">
      {/* Hero Image */}
      <div className="relative h-[600px] overflow-hidden">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1764004450351-37fb72cb8e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjBtb2Rlcm58ZW58MXx8fHwxNzY0MzQ0MzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Clínica OdontoBarrio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl text-white">
              <h1 className="text-white mb-6">
                Atención Dental Accesible y Cercana en Santiago Centro
              </h1>
              <p className="text-xl text-blue-50 mb-8">
                Cuidamos la salud bucal de familias, estudiantes y trabajadores del sector con atención profesional y precios justos.
              </p>
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">Ubicación</div>
                      <div className="text-white">Santiago Centro</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">Horario</div>
                      <div className="text-white">Lun-Vie 9:00-18:00</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-200" />
                    <div>
                      <div className="text-sm text-blue-200">WhatsApp</div>
                      <div className="text-white">Atención inmediata</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Agendar Hora
                </button>
                <button 
                  onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg border-2 border-white/30 hover:bg-white/20 transition"
                >
                  Ver Servicios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

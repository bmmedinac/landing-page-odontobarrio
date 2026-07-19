import { Smile, MapPin, Phone, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">OdontoBarrio</span>
            </div>
            <p className="text-gray-400">
              Atención dental accesible y cercana en Santiago Centro.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition"
                >
                  Servicios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('horarios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition"
                >
                  Horarios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition"
                >
                  Precios
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Preventivos</li>
              <li>Restauradores</li>
              <li>Quirúrgicos</li>
              <li>Urgencias</li>
              <li>Radiografías</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Santiago Centro, Chile</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>+56 9 XXXX XXXX</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>contacto@odontobarrio.cl</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} OdontoBarrio. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              Hecho con <Heart className="w-4 h-4 text-red-500" /> para la comunidad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

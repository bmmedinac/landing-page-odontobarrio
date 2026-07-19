import { MapPin, Phone, MessageSquare, Mail, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Contact() {
  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-900 mb-4">Contáctanos</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos ubicados en Santiago Centro y listos para atenderte
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
              <h3 className="text-gray-900 mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Ubicación</h4>
                    <p className="text-gray-600">Merced 800 of. 100, Santiago Centro, Chile</p>
                    <p className="text-gray-500 text-sm mt-1">Fácil acceso en transporte público</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">WhatsApp</h4>
                    <p className="text-gray-600">+56 9 1234 5678</p>
                    <p className="text-gray-500 text-sm mt-1">Respuesta rápida Lun-Sáb 8:00-20:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Teléfono</h4>
                    <p className="text-gray-600">+56 2 1000 1000</p>
                    <p className="text-gray-500 text-sm mt-1">Horario de oficina</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-50 rounded-lg p-3">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">contacto@odontobarrio.cl</p>
                    <p className="text-gray-500 text-sm mt-1">Respuesta en 24-48 hrs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Horario de Atención</h4>
                    <p className="text-gray-600">Lun-Vie: 09:00 - 18:00</p>
                    <p className="text-gray-600">Sábado: 09:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-blue-600 rounded-xl p-8 text-white">
              <h3 className="text-white mb-4">¿Listo para Agendar?</h3>
              <p className="text-blue-50 mb-6">
                Contáctanos por WhatsApp y agenda tu hora de forma rápida y sencilla. Te responderemos a la brevedad.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition w-full sm:w-auto">
                Escribir por WhatsApp
              </button>
            </div>
          </div>

          {/* Image & Team Info */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1600721187850-c944924fd48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGRlbnRpc3QlMjBwYXRpZW50fGVufDF8fHx8MTc2NDQyNzYzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Equipo OdontoBarrio"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h3 className="text-gray-900 mb-4">Nuestro Equipo</h3>
                <p className="text-gray-600 mb-4">
                  Contamos con un equipo profesional y cercano, comprometido con tu salud dental:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Directora administrativa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Recepcionista especializada
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    2 Odontólogos generales
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Asistente dental
                  </li>
                </ul>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-gray-900 mb-2">Cercanía</h4>
                <p className="text-gray-600">Atención personalizada y humana</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-gray-900 mb-2">Accesibilidad</h4>
                <p className="text-gray-600">Precios justos y transparentes</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-gray-900 mb-2">Profesionalismo</h4>
                <p className="text-gray-600">Equipo capacitado y dedicado</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-gray-900 mb-2">Claridad</h4>
                <p className="text-gray-600">Información simple y directa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

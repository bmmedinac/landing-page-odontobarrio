import { Clock, MessageSquare, Calendar } from 'lucide-react';

export function Schedule() {
  return (
    <section id="horarios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-900 mb-4">Horarios de Atención</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos disponibles para atenderte en los siguientes horarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Atención Clínica */}
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 rounded-lg p-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-blue-900">Atención Clínica</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Lunes a Viernes</span>
                <span className="text-blue-900">09:00 - 18:00</span>
              </div>
              <div className="h-px bg-blue-200"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Sábado</span>
                <span className="text-blue-900">09:00 - 13:00</span>
              </div>
              <div className="h-px bg-blue-200"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Domingo</span>
                <span className="text-gray-500">Cerrado</span>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-green-50 rounded-xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 rounded-lg p-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-green-900">Atención WhatsApp</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Lunes a Sábado</span>
                <span className="text-green-900">08:00 - 20:00</span>
              </div>
              <div className="h-px bg-green-200"></div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Domingo</span>
                <span className="text-gray-600">Solo automatizado</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-600">
                Respondemos tus consultas por WhatsApp de manera rápida y personalizada
              </p>
            </div>
          </div>
        </div>

        {/* Urgencias Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex items-start gap-4">
            <div className="bg-red-600 rounded-lg p-2 flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-red-900 mb-2">Urgencias Dentales</h4>
              <p className="text-gray-700">
                Las urgencias se atienden según disponibilidad. Contáctanos por WhatsApp para coordinar tu atención lo antes posible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

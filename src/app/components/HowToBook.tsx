import { Calendar, CreditCard, Clock, PhoneCall, AlertTriangle } from 'lucide-react';

export function HowToBook() {
  const steps = [
    {
      icon: PhoneCall,
      title: 'Contáctanos',
      description: 'Escríbenos por WhatsApp o llámanos para consultar disponibilidad'
    },
    {
      icon: Calendar,
      title: 'Agenda tu hora',
      description: 'Coordinamos el día y hora que mejor te acomode'
    },
    {
      icon: CreditCard,
      title: 'Paga tu consulta',
      description: 'Reserva tu hora pagando la consulta por adelantado'
    },
    {
      icon: Clock,
      title: 'Asiste puntual',
      description: 'Llega a tu hora. Llegar más de 10-15 min tarde implica pérdida de la hora'
    }
  ];

  const rules = [
    {
      icon: Calendar,
      title: 'Reagendamiento',
      description: 'Avisa con 24 horas de anticipación si necesitas cambiar tu hora',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Puntualidad',
      description: 'Llegar más de 10-15 minutos tarde implica la pérdida de tu hora agendada',
      color: 'text-orange-600'
    },
    {
      icon: AlertTriangle,
      title: 'Urgencias',
      description: 'Las urgencias se atienden según disponibilidad del día',
      color: 'text-red-600'
    }
  ];

  return (
    <section id="agendar" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-900 mb-4">¿Cómo Agendar?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Agendar tu hora es simple y rápido. Sigue estos pasos:
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-blue-100 rounded-xl p-6 text-center hover:border-blue-300 transition">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <h3 className="text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Rules */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-gray-900 mb-8">Importante: Políticas de Atención</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rules.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className={`${rule.color} mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-gray-900 mb-2">{rule.title}</h4>
                  <p className="text-gray-600">{rule.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition"
          >
            Agendar Mi Hora Ahora
          </button>
        </div>
      </div>
    </section>
  );
}

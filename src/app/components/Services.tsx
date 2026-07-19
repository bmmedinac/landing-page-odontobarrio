import { Sparkles, Wrench, Scissors, AlertCircle, Camera } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Sparkles,
      title: 'Preventivos',
      items: ['Limpieza dental', 'Control dental'],
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Wrench,
      title: 'Restauradores',
      items: ['Tapaduras simples', 'Tratamiento de caries simples'],
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Scissors,
      title: 'Quirúrgicos',
      items: ['Extracciones simples'],
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: AlertCircle,
      title: 'Urgencias',
      items: ['Dolor leve', 'Inflamación leve', 'Pérdida de tapadura', 'Sangrado leve post-extracción'],
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Camera,
      title: 'Radiografías',
      items: ['Bitewing (en clínica)', 'Panorámica (derivación a centro cercano)'],
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-900 mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos atención dental de calidad para procedimientos de baja complejidad. Los casos complejos son derivados a clínicas especializadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 mb-3">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <p className="text-gray-700 text-center">
            <span className="text-blue-900">Nota importante:</span> Los precios pueden variar según evaluación individual. Los casos complejos se derivan a otras clínicas especializadas.
          </p>
        </div>
      </div>
    </section>
  );
}

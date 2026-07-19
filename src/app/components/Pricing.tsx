import { DollarSign, Info } from 'lucide-react';

export function Pricing() {
  const prices = [
    { service: 'Consulta', price: '$10.000' },
    { service: 'Limpieza', price: '$18.000' },
    { service: 'Tapadura simple', price: 'Desde $25.000' },
    { service: 'Extracción simple', price: 'Desde $35.000' },
    { service: 'Urgencia', price: '$15.000' }
  ];

  return (
    <section id="precios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-900 mb-4">Precios Referenciales</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Precios accesibles y transparentes. Los valores finales dependen de la evaluación clínica individual.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-white" />
                <h3 className="text-white">Lista de Precios</h3>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {prices.map((item, index) => (
                <div 
                  key={index}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="text-gray-700">{item.service}</span>
                  <span className="text-blue-900">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-blue-900 mb-2">Sobre los precios</h4>
                <p className="text-gray-700">
                  Los valores finales pueden variar según la evaluación clínica individual. Cada caso es único y nuestros profesionales determinarán el tratamiento y costo exacto durante la consulta.
                </p>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex items-start gap-4">
              <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-green-900 mb-2">Formas de pago</h4>
                <p className="text-gray-700">
                  Aceptamos efectivo, transferencia y tarjetas de débito/crédito. La consulta debe ser pagada al momento de reservar la hora.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

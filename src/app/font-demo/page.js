'use client';

import { motion } from 'framer-motion';

export default function FontDemo() {
  const fontWeights = [
    { weight: '100', name: 'Thin', class: 'font-thin' },
    { weight: '200', name: 'Extra Light', class: 'font-extralight' },
    { weight: '300', name: 'Light', class: 'font-light' },
    { weight: '400', name: 'Regular', class: 'font-normal' },
    { weight: '450', name: 'Normal', class: 'font-normal' },
    { weight: '500', name: 'Medium', class: 'font-medium' },
    { weight: '600', name: 'Semi Bold', class: 'font-semibold' },
    { weight: '700', name: 'Bold', class: 'font-bold' },
    { weight: '800', name: 'Extra Bold', class: 'font-extrabold' },
    { weight: '900', name: 'Black', class: 'font-black' },
    { weight: '950', name: 'Extra Black', class: 'font-extrablack' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7370fd] to-[#5a67d8] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-black text-white mb-4">TT Norms Pro</h1>
          <p className="text-xl text-white/80 font-light">Демонстрация всех весов шрифта</p>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="space-y-8">
            {fontWeights.map((font, index) => (
              <motion.div
                key={font.weight}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-3xl ${font.class} text-gray-800`}>
                      The quick brown fox jumps over the lazy dog
                    </h3>
                    <p className="text-lg text-gray-600 mt-2">
                      Съешь ещё этих мягких французских булок да выпей чаю
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">
                      {font.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {font.weight}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 p-6 bg-gray-50 rounded-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Примеры использования</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Заголовки</h3>
                <h1 className="text-4xl font-black text-gray-800 mb-2">H1 - Extra Black</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">H2 - Bold</h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">H3 - Semi Bold</h3>
                <h4 className="text-xl font-medium text-gray-800">H4 - Medium</h4>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Текст</h3>
                <p className="text-base font-normal text-gray-600 mb-2">
                  Обычный текст - Regular (400)
                </p>
                <p className="text-base font-light text-gray-600">
                  Легкий текст - Light (300)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

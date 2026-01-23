import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronRight } from 'lucide-react';
import { EN } from '../../i18n/en';

interface HelpButtonProps {
  context?: 'home' | 'recording' | 'diary' | 'family' | 'settings';
}

export const HelpButton: React.FC<HelpButtonProps> = ({ context = 'home' }) => {
  const [showHelp, setShowHelp] = useState(false);

  const helpContents = {
    home: EN.help.home,
    recording: EN.help.recording,
    diary: EN.help.diary,
    family: EN.help.home,
    settings: EN.help.settings
  };

  const help = helpContents[context] || helpContents.home;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelp(true)}
        className="fixed top-4 right-4 z-40 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        title="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{EN.help.title}</h2>
                      <p className="text-sm text-gray-500">{EN.help.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {help.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {help.description}
                  </p>
                  <div className="space-y-3">
                    {help.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{EN.help.faq.title}</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{EN.help.faq.q1}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{EN.help.faq.q2}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </button>
                    <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{EN.help.faq.q3}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {EN.help.support.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {EN.help.support.description}
                  </p>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                    {EN.help.support.button}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

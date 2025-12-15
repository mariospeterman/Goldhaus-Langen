import React from 'react';
import { TrendingUp, ArrowRight } from 'lucide-react';

const METALS = [
  {
    symbol: 'XAU',
    name: 'Gold',
    color: 'text-amber-400',
    bgGradient: 'linear-gradient(140deg, rgba(245,158,11,0.2), rgba(17,17,17,0.8))',
    borderColor: '#f59e0b',
    icon: '🥇'
  },
  {
    symbol: 'XAG',
    name: 'Silber',
    color: 'text-gray-300',
    bgGradient: 'linear-gradient(140deg, rgba(192,192,192,0.2), rgba(17,17,17,0.8))',
    borderColor: '#c0c0c0',
    icon: '🥈'
  },
  {
    symbol: 'XPT',
    name: 'Platin',
    color: 'text-blue-300',
    bgGradient: 'linear-gradient(140deg, rgba(59,130,246,0.2), rgba(17,17,17,0.8))',
    borderColor: '#3b82f6',
    icon: '💎'
  }
];

export const MetalPriceWidget = ({ onOpenChart }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {METALS.map((metal) => (
        <div
          key={metal.symbol}
          onClick={() => onOpenChart && onOpenChart(metal.symbol, metal.name)}
          className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border-2 border-transparent hover:border-amber-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20"
          style={{
            background: metal.bgGradient,
            '--border-color': metal.borderColor
          }}
        >
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent rounded-2xl transition-all duration-300" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{metal.icon}</span>
                <div>
                  <h3 className={`font-bold text-xl ${metal.color}`}>{metal.name}</h3>
                  <p className="text-gray-400 text-sm">{metal.symbol}</p>
                </div>
              </div>
              <TrendingUp className={`w-6 h-6 ${metal.color} opacity-60`} />
            </div>

            {/* Price placeholder */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-1">Aktueller Preis</p>
              <p className="text-white text-2xl font-bold">Live Chart</p>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors">
              <span className="font-semibold text-sm">Echtzeitpreis anzeigen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetalPriceWidget;


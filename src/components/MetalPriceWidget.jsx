import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TradingViewChart from './TradingViewChart.jsx';

const METALS = [
  {
    symbol: 'XAU',
    name: 'Gold',
    color: 'text-amber-400',
    bgGradient: 'linear-gradient(140deg, rgba(245,158,11,0.15), rgba(17,17,17,0.9))',
    borderColor: '#f59e0b',
    tradingViewSymbol: 'FX_IDC:XAUEUR'
  },
  {
    symbol: 'XAG',
    name: 'Silber',
    color: 'text-gray-300',
    bgGradient: 'linear-gradient(140deg, rgba(192,192,192,0.15), rgba(17,17,17,0.9))',
    borderColor: '#c0c0c0',
    tradingViewSymbol: 'FX_IDC:XAGEUR'
  },
  {
    symbol: 'XPT',
    name: 'Platin',
    color: 'text-blue-300',
    bgGradient: 'linear-gradient(140deg, rgba(59,130,246,0.15), rgba(17,17,17,0.9))',
    borderColor: '#3b82f6',
    tradingViewSymbol: 'FX_IDC:XPTEUR'
  }
];

const MetalWidget = ({ metal, isExpanded, onToggle }) => {
  // TradingView ticker iframe URL
  const tickerUrl = `https://s.tradingview.com/embed-widget/ticker/?locale=de&symbols=${metal.tradingViewSymbol}&colorTheme=dark&isTransparent=true&showSymbolLogo=false&largeChartUrl=`;

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-transparent hover:border-amber-500/30 transition-all duration-300 overflow-hidden"
      style={{ background: metal.bgGradient }}>
      {/* Widget Header */}
      <div 
        onClick={onToggle}
        className="relative z-10 p-5 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className={`font-bold text-xl ${metal.color}`}>{metal.name}</h3>
            <span className="text-gray-400 text-sm">({metal.symbol})</span>
          </div>
          <button className="text-amber-400 hover:text-amber-300 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Live Ticker */}
        <div className="w-full h-[60px] rounded-lg overflow-hidden">
          <iframe
            src={tickerUrl}
            style={{ width: '100%', height: '60px', border: 'none' }}
            title={`${metal.name} Ticker`}
            loading="lazy"
          />
        </div>
      </div>

      {/* Expanded Chart */}
      {isExpanded && (
        <div className="border-t border-white/10 p-5 bg-black/40">
          <TradingViewChart symbol={metal.symbol} metalName={metal.name} />
        </div>
      )}
    </div>
  );
};

export const MetalPriceWidget = () => {
  const [expandedMetal, setExpandedMetal] = useState(null);

  const handleToggle = (symbol) => {
    setExpandedMetal(expandedMetal === symbol ? null : symbol);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {METALS.map((metal) => (
        <MetalWidget
          key={metal.symbol}
          metal={metal}
          isExpanded={expandedMetal === metal.symbol}
          onToggle={() => handleToggle(metal.symbol)}
        />
      ))}
    </div>
  );
};

export default MetalPriceWidget;

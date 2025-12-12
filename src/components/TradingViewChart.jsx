import { useEffect, useRef } from 'react';

// Metal symbols mapping for TradingView - EUR pairs
const METAL_SYMBOLS = {
  XAU: 'FX_IDC:XAUEUR', // Gold/EUR
  XAG: 'FX_IDC:XAGEUR', // Silver/EUR
  XPT: 'FX_IDC:XPTEUR', // Platinum/EUR
  XPD: 'FX_IDC:XPDEUR'  // Palladium/EUR
};

export const TradingViewChart = ({ symbol = 'XAU', metalName = 'Gold' }) => {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);
  const containerIdRef = useRef(`tradingview_${symbol.toLowerCase()}_${Date.now()}`);

  useEffect(() => {
    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    function initWidget() {
      if (!containerRef.current) return;
      
      // Clean up previous widget if exists
      if (widgetRef.current) {
        try {
          if (widgetRef.current.remove) {
            widgetRef.current.remove();
          }
        } catch (e) {
          // Ignore cleanup errors
        }
        widgetRef.current = null;
      }

      const tradingViewSymbol = METAL_SYMBOLS[symbol] || METAL_SYMBOLS.XAU;
      const containerId = containerIdRef.current;

      widgetRef.current = new window.TradingView.widget({
        width: '100%',
        height: 500,
        symbol: tradingViewSymbol,
        interval: 'D',
        timezone: 'Europe/Berlin', // Berlin timezone
        theme: 'light',
        style: '1',
        locale: 'de', // German language
        toolbar_bg: '#f1f3f6',
        hide_legend: false,
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        // Additional settings for better UX
        hide_side_toolbar: false,
        save_image: false,
        studies: [
          'MASimple@tv-basicstudies',
          'Volume@tv-basicstudies'
        ],
        // Display settings
        withdateranges: true,
        range: '1M',
        hide_volume: false,
        support_host: 'https://www.tradingview.com'
      });
    }

    return () => {
      // Cleanup if needed
      if (widgetRef.current && widgetRef.current.remove) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [symbol]);

  return (
    <div className="w-full">
      <div 
        id={containerIdRef.current}
        ref={containerRef}
        className="tradingview-widget-container"
        style={{ height: '500px', width: '100%' }}
      />
    </div>
  );
};

export default TradingViewChart;


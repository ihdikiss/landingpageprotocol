
import React, { useState, useCallback, useEffect } from 'react';
import htm from 'htm';
import ThreeScene from './components/ThreeScene.js';

const html = htm.bind(React.createElement);

const App = () => {
  const [isWarping, setIsWarping] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(Math.floor(Math.random() * (60 - 51 + 1)) + 51);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(Math.floor(Math.random() * (60 - 51 + 1)) + 51);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterProtocol = useCallback(() => {
    setIsWarping(true);
    setTimeout(() => {
      window.location.href = 'https://new-v-maze-chase.vercel.app/'; 
    }, 1500);
  }, []);

  const toggleCard = () => setIsCardOpen(!isCardOpen);

  return html`
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white select-none font-['Cairo']">
      <${ThreeScene} isWarping=${isWarping} />

      <div className=${`absolute inset-0 flex flex-col items-center justify-between py-12 px-6 transition-all duration-1000 ${isWarping ? 'opacity-0 scale-150 blur-3xl pointer-events-none' : 'opacity-100'}`}>
        
        <div className="text-center relative z-10 mt-4">
            <h2 className="text-[10px] md:text-[13px] tracking-[0.1em] text-cyan-400 font-bold uppercase mb-1 drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
              اول موقع مغربي لتحويل الدروس المملة الى اللعبة ممتعة
            </h2>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter drop-shadow-[0_4px_15px_rgba(0,0,0,1)] uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300">
                9RA
              </span>
              <span className="text-white px-2 md:px-4">O</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-600 via-cyan-400 to-cyan-300">
                NCHT
              </span>
            </h1>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-col items-center gap-6 z-10 mb-2">
          <button
            onClick=${handleEnterProtocol}
            className="group relative flex items-center justify-center px-16 py-5 overflow-hidden transition-all duration-500 rounded-sm bg-transparent border border-white/30 hover:border-cyan-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <span className="relative text-xl md:text-2xl font-black tracking-[0.3em] text-white uppercase">
              اللعب الآن
            </span>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
          </button>
          
          <button 
            onClick=${toggleCard}
            className="text-[11px] md:text-[12px] font-bold tracking-widest text-blue-400 hover:text-blue-200 transition-colors uppercase border-b border-blue-500/20 pb-1"
          >
            استكشف مهمتنا
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-3 py-1 glassmorphism rounded-full flex items-center gap-2 shadow-[0_0_10px_rgba(0,255,255,0.05)]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold">
              <span className="text-white/40">مباشر:</span>
              <span className="text-cyan-400 font-mono text-sm">${visitorCount}</span>
              <span className="text-white/40">زائر</span>
            </div>
          </div>
        </div>
      </div>

      ${isCardOpen && html`
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick=${toggleCard}>
          <div className="relative max-w-md w-full glassmorphism p-8 rounded-lg text-center space-y-6" onClick=${e => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-cyan-400">مهمتنا</h3>
            <p className="text-blue-200/70 text-base leading-relaxed">
              تحويل المناهج الدراسية إلى تجربة لعب ممتعة ومبهرة تجعل التعلم شغفاً يومياً.
            </p>
            <button onClick=${toggleCard} className="text-xs text-white/40 uppercase tracking-widest mt-4">إغلاق</button>
          </div>
        </div>
      `}
    </div>
  `;
};

export default App;

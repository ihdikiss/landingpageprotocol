
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

      <style>
        @keyframes scan {
          0% { top: -100%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 200%; opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.1); }
          50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.4); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; }
        }
        @keyframes glow-orange {
          0%, 100% { text-shadow: 0 0 5px rgba(255, 68, 0, 0.5); }
          50% { text-shadow: 0 0 15px rgba(255, 68, 0, 0.8), 0 0 20px rgba(255, 68, 0, 0.4); }
        }
        .target-bracket {
          position: absolute;
          width: 8px;
          height: 8px;
          border-color: #22d3ee;
          transition: all 0.3s ease;
          opacity: 0;
        }
        .group:hover .target-bracket {
          opacity: 1;
          width: 12px;
          height: 12px;
        }
        .explore-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(45deg, transparent, rgba(255, 68, 0, 0.1), transparent);
          transform: translateX(-100%);
          transition: 0.6s;
        }
        .explore-btn:hover::before {
          transform: translateX(100%);
        }
      </style>

      <div className=${`absolute inset-0 flex flex-col items-center justify-between py-10 px-6 transition-all duration-1000 ${isWarping ? 'opacity-0 scale-150 blur-3xl pointer-events-none' : 'opacity-100'}`}>
        
        <!-- الهيدر العلوي -->
        <div className="text-center relative z-10 mt-2">
            <h2 className="text-[9px] md:text-[11px] tracking-[0.3em] text-cyan-400/70 font-bold uppercase mb-1 drop-shadow-[0_0_8px_rgba(0,255,255,0.2)]">
              أول موقع مغربي لتحويل الدروس إلى ألعاب
            </h2>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter drop-shadow-[0_4px_15px_rgba(0,0,0,1)] uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300">
                9RA
              </span>
              <span className="text-white px-2 md:px-3 text-3xl md:text-6xl opacity-80">O</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-blue-600 via-cyan-400 to-cyan-300">
                NCHT
              </span>
            </h1>
        </div>

        <!-- مساحة فارغة للمركبة -->
        <div className="flex-grow"></div>

        <!-- قسم الأزرار المطور أسفل السفينة -->
        <div className="flex flex-col items-center gap-6 z-10 mb-14 relative w-full max-w-xs">
          
          <!-- زر اللعب الآن (Cyan) -->
          <button
            onClick=${handleEnterProtocol}
            className="group relative w-full flex items-center justify-center px-8 py-3.5 overflow-hidden transition-all duration-500 rounded-sm bg-black/60 border border-cyan-500/20 hover:border-cyan-400 hover:bg-black/80 hover:scale-105 active:scale-95 animate-[pulse-glow_4s_infinite]"
          >
            <div className="target-bracket top-1.5 left-1.5 border-t-2 border-l-2"></div>
            <div className="target-bracket top-1.5 right-1.5 border-t-2 border-r-2"></div>
            <div className="target-bracket bottom-1.5 left-1.5 border-b-2 border-l-2"></div>
            <div className="target-bracket bottom-1.5 right-1.5 border-b-2 border-r-2"></div>
            <div className="absolute left-0 w-full h-[1px] bg-cyan-400/30 blur-[1px] animate-[scan_3s_infinite] pointer-events-none"></div>
            <span className="relative text-lg md:text-xl font-black tracking-[0.5em] text-white uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              اللعب الآن
            </span>
          </button>
          
          <!-- زر استكشف عالمنا المطور (Neon Orange) -->
          <div className="relative group/explore w-full flex flex-col items-center">
            <button 
              onClick=${toggleCard}
              className="explore-btn relative flex items-center justify-center gap-3 px-6 py-2.5 transition-all duration-500 rounded-full border border-orange-500/20 hover:border-orange-400/60 hover:bg-orange-950/20 group-hover/explore:px-12 group-hover/explore:shadow-[0_0_20px_rgba(255,102,0,0.15)]"
            >
              <!-- أيقونة المسح المداري البرتقالية -->
              <div className="relative w-4 h-4 hidden group-hover/explore:block">
                <div className="absolute inset-0 border-2 border-orange-400/30 border-t-orange-500 rounded-full animate-[spin-slow_1s_infinite]"></div>
              </div>

              <span className="text-[12px] font-black tracking-[0.45em] text-orange-500/90 group-hover/explore:text-orange-400 transition-all uppercase animate-[glow-orange_3s_infinite]">
                استكشف عالمنا
              </span>

              <!-- إحداثيات وهمية برتقالية -->
              <div className="absolute -left-20 opacity-0 group-hover/explore:opacity-60 transition-all duration-700 pointer-events-none translate-x-4 group-hover/explore:translate-x-0">
                <span className="font-mono text-[7px] text-orange-500/80 tracking-widest">OBJ_ID: WORLD_B</span>
              </div>
            </button>
            
            <!-- خط الربط التقني البرتقالي -->
            <div className="w-px h-6 bg-gradient-to-b from-orange-500/0 via-orange-500/30 to-transparent mt-1 group-hover/explore:h-10 transition-all duration-500"></div>
          </div>
        </div>

        <!-- عداد المسافرين -->
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="px-3 py-1 glassmorphism rounded-full flex items-center gap-2 border border-white/5">
            <div className="relative">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
              <span className="text-white/30 font-medium">ON BOARD:</span>
              <span className="text-cyan-400 font-mono text-sm drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">${visitorCount}</span>
            </div>
          </div>
        </div>
      </div>

      ${isCardOpen && html`
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/98 backdrop-blur-2xl transition-all duration-500" onClick=${toggleCard}>
          <div className="relative max-w-sm w-full glassmorphism p-8 rounded-xl text-center space-y-6 border-orange-500/20 shadow-[0_0_100px_rgba(255,102,0,0.1)]" onClick=${e => e.stopPropagation()}>
            <div className="space-y-3">
              <div className="inline-block px-2 py-0.5 rounded-full border border-orange-500/30 text-[8px] font-bold text-orange-400 uppercase tracking-widest mb-1">mission profile</div>
              <h3 className="text-3xl font-black text-white tracking-tight">مهمتنا</h3>
              <p className="text-orange-100/60 text-sm leading-relaxed font-medium">
                نحن هنا لنكسر قيود التعليم التقليدي. نحول كل تمرين ممل إلى رحلة مشوقة. تواصل معنا لنبدأ المغامرة.
              </p>
            </div>

            <div className="flex justify-center items-center gap-8 pt-2">
              <a href="https://wa.me/#" target="_blank" className="group flex flex-col items-center gap-2 transition-transform hover:scale-110">
                <div className="w-12 h-12 rounded-xl bg-green-500/5 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 group-hover:border-green-500/50 transition-all">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">WhatsApp</span>
              </a>

              <a href="https://instagram.com/#" target="_blank" className="group flex flex-col items-center gap-2 transition-transform hover:scale-110">
                <div className="w-12 h-12 rounded-xl bg-pink-500/5 flex items-center justify-center border border-pink-500/20 group-hover:bg-pink-500/20 group-hover:border-pink-500/50 transition-all">
                  <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.353-2.612-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest">Instagram</span>
              </a>
            </div>

            <button onClick=${toggleCard} className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-bold pt-4 hover:text-orange-400 transition-colors">Abort Mission</button>
          </div>
        </div>
      `}
    </div>
  `;
};

export default App;

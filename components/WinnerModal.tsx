
import React, { useEffect, useState } from 'react';
import { Employee, Prize } from '../types';

interface WinnerModalProps {
  winner: Employee | null;
  prize: Prize | null;
  blessing?: string;
  onClose: () => void;
  lang: 'en' | 'zh';
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, prize, blessing, onClose, lang }) => {
  const [showAngpao, setShowAngpao] = useState(false);

  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => setShowAngpao(true), 800);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  if (!winner || !prize) return null;

  const t = {
    en: {
      victory: "Victory!",
      tagline: "Fortune Smiles Upon You",
      officialWinner: "Winner",
      category: "Category",
      bonus: "Bonus Gift",
      angpao: "RM 100 Red Packet",
      claimed: "CLAIMED",
      confirm: "Confirm & Close",
      allParticipants: "*Extra Red Packet Gift",
      aiHost: "AI HOST SAYS"
    },
    zh: {
      victory: "恭喜中奖！",
      tagline: "好运连连，万事如意",
      officialWinner: "中奖人",
      category: "奖项类别",
      bonus: "福利奖项",
      angpao: "100元现金红包",
      claimed: "已领取",
      confirm: "确认并关闭",
      allParticipants: "*红包奖励全员有份",
      aiHost: "AI 主持人贺词"
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/95 backdrop-blur-2xl">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-red-600 via-red-800 to-red-950 rounded-[3rem] p-0.5 shadow-[0_0_80px_rgba(234,179,8,0.3)] border border-yellow-500/30 overflow-hidden animate-[bounce_0.5s_ease-out]">
        
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-5 left-5 text-6xl animate-pulse">🧧</div>
          <div className="absolute bottom-5 right-5 text-6xl animate-pulse delay-700">🧧</div>
        </div>

        <div className="relative z-10 max-h-[92vh] overflow-y-auto custom-scrollbar p-6 md:p-8 text-center space-y-5">
          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-festive gold-text font-bold leading-tight">{t.victory}</h2>
            <p className="text-yellow-500 font-black tracking-[0.3em] text-[10px] uppercase opacity-80">{t.tagline}</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 shadow-inner">
            <div className="text-4xl md:text-5xl font-black text-white drop-shadow-md">{winner.name}</div>
            <div className="mt-2 flex justify-center items-center gap-2">
               <span className="h-[1px] w-6 bg-yellow-500/30"></span>
               <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em]">{t.officialWinner}</span>
               <span className="h-[1px] w-6 bg-yellow-500/30"></span>
            </div>
          </div>

          {/* AI 贺词显示区域 */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 italic text-yellow-200 text-sm leading-relaxed relative">
            <div className="absolute -top-3 left-4 bg-red-800 px-2 text-[8px] font-black text-yellow-500 uppercase tracking-widest border border-yellow-500/40">{t.aiHost}</div>
            {blessing ? blessing : <div className="flex items-center justify-center gap-2 py-2"><span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>正在生成贺词...</div>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-yellow-500 text-red-950 rounded-[2rem] p-4 shadow-xl border-b-4 border-yellow-700">
              <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-red-950/20 shadow-lg">
                 <img src={prize.icon} alt={prize.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left flex-1">
                <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-0.5">{t.category}: {prize.level}</div>
                <div className="text-2xl md:text-3xl font-black leading-tight tracking-tight">{prize.name}</div>
              </div>
            </div>

            <div className={`transition-all duration-700 transform ${showAngpao ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-500 p-4 rounded-[1.5rem] border border-yellow-400/50 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner">🧧</div>
                  <div className="text-left">
                    <div className="text-yellow-300 text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">{t.bonus}</div>
                    <div className="text-xl font-black text-white tracking-tight">{t.angpao}</div>
                  </div>
                </div>
                <span className="bg-yellow-400 text-red-950 text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">{t.claimed}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onClose}
              className="w-full py-4 bg-white text-red-900 font-black text-xl md:text-2xl rounded-2xl transition-all shadow-2xl active:scale-95 hover:bg-yellow-500 hover:text-red-950 uppercase tracking-widest"
            >
              {t.confirm}
            </button>
            <p className="text-white/20 text-[8px] uppercase font-black tracking-widest">
              {t.allParticipants}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;

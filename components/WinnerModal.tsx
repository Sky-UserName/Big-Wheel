
import React from 'react';
import { Employee, Prize } from '../types';

interface WinnerModalProps {
  winner: Employee | null;
  prize: Prize | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, prize, onClose }) => {
  if (!winner || !prize) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-red-600 to-red-900 rounded-[3rem] p-10 border-4 border-yellow-400 shadow-[0_0_100px_rgba(234,179,8,0.6)] text-center animate-[bounce_0.8s_ease-out]">
        
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-8xl drop-shadow-2xl">🎊</div>
        
        <div className="space-y-6">
          <h2 className="text-5xl font-festive gold-text font-bold mb-2">Winner!</h2>
          
          <div className="bg-white/10 rounded-3xl p-6 border border-white/20">
            <div className="text-yellow-300 text-xl font-bold tracking-widest">{winner.department}</div>
            <div className="text-6xl font-black text-white my-2">{winner.name}</div>
            <div className="text-yellow-400/80 text-lg">Won</div>
          </div>

          <div className="flex items-center justify-center gap-4 bg-yellow-500/10 rounded-2xl py-6 border border-yellow-500/30">
            <span className="text-7xl">{prize.icon}</span>
            <div className="text-left">
              <div className="text-yellow-500 font-bold uppercase tracking-tighter">{prize.level}</div>
              <div className="text-4xl font-bold text-white">{prize.name}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-5 mt-4 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 hover:from-yellow-200 hover:to-yellow-400 text-red-950 font-black text-2xl rounded-full transition-all shadow-[0_5px_15px_rgba(0,0,0,0.3)] active:scale-95"
          >
            Claim Your Luck
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;

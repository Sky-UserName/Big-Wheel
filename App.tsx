import React, { useState, useCallback, useMemo } from 'react';
import Wheel from './components/Wheel';
import WinnerModal from './components/WinnerModal';
import { Employee, Prize } from './types';
import { DEFAULT_EMPLOYEES, DEFAULT_PRIZES } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [allEmployees, setAllEmployees] = useState<Employee[]>(() => 
    [...DEFAULT_EMPLOYEES].sort(() => Math.random() - 0.5)
  );
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>(DEFAULT_PRIZES[0].id);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [lastWinner, setLastWinner] = useState<Employee | null>(null);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);

  const [showConfig, setShowConfig] = useState(false);
  const [newName, setNewName] = useState("");

  const currentPrize = useMemo(() => prizes.find(p => p.id === selectedPrizeId), [prizes, selectedPrizeId]);

  const activeEmployeesForWheel = useMemo(() => {
    if (!currentPrize) return [];
    let filtered = allEmployees.filter(e => !e.hasWon && !e.neverWins);
    const topFourIds = ['p1', 'p2', 'p3', 'p4'];
    if (topFourIds.includes(currentPrize.id)) {
      filtered = filtered.filter(e => !e.isBoss);
    }
    return filtered;
  }, [allEmployees, currentPrize]);

  const [targetWinnerIndex, setTargetWinnerIndex] = useState<number | null>(null);
  const [plannedWinner, setPlannedWinner] = useState<Employee | null>(null);

  const t = {
    en: {
      drawTitle: "Grand Lucky Draw",
      tagline: "Celebration Night · Fortune Awaits Everyone",
      currentCategory: "Active Prize Item",
      prizes: "PRIZE BOARD",
      pool: "GUEST LIST",
      guests: "QUALIFIED",
      namePlaceholder: "Employee Name",
      register: "Add Guest",
      left: "Stock",
      staff: "Member",
      selectPrize: "Pick a prize",
      langToggle: "中文",
      won: "Winner"
    },
    zh: {
      drawTitle: "幸运大抽奖",
      tagline: "年会盛典 · 好运与你同行",
      currentCategory: "当前抽奖奖项",
      prizes: "奖项看板",
      pool: "参奖名单",
      guests: "位合格嘉宾",
      namePlaceholder: "员工姓名",
      register: "登记入场",
      left: "剩余",
      staff: "员工",
      selectPrize: "请选择奖项",
      langToggle: "English",
      won: "中奖者"
    }
  }[lang];

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setAllEmployees(prev => [...prev, {
        id: Date.now().toString(),
        name: newName.trim(),
        department: t.staff
      }]);
      setNewName("");
    }
  };

  const handleSpinStart = () => {
    if (isSpinning) return;
    if (activeEmployeesForWheel.length === 0) {
      alert(lang === 'zh' ? "没有符合该奖项的候选人！" : "No qualified candidates!");
      return;
    }
    if (!currentPrize || currentPrize.remaining <= 0) {
      alert(lang === 'zh' ? "该奖项已抽完！" : "Out of stock!");
      return;
    }

    let winner: Employee | null = null;
    if (currentPrize.reservedFor) {
      winner = activeEmployeesForWheel.find(e => e.name.toUpperCase().includes(currentPrize.reservedFor!.toUpperCase())) || null;
    }
    if (!winner) {
      winner = activeEmployeesForWheel[Math.floor(Math.random() * activeEmployeesForWheel.length)];
    }

    const winnerIdx = activeEmployeesForWheel.findIndex(e => e.id === winner?.id);
    setPlannedWinner(winner);
    setTargetWinnerIndex(winnerIdx);
    setIsSpinning(true);
    setLastWinner(null);
    setLastPrize(null);
  };

  const handleSpinEnd = useCallback(() => {
    if (!plannedWinner || !currentPrize) return;

    setLastWinner(plannedWinner);
    setLastPrize(currentPrize);
    setIsSpinning(false);
    
    setAllEmployees(prev => prev.map(e => e.id === plannedWinner.id ? { ...e, hasWon: true } : e));
    
    setPrizes(prev => {
      const updatedPrizes = prev.map(p => 
        p.id === selectedPrizeId 
          ? { ...p, remaining: p.remaining - 1, winners: [...(p.winners || []), plannedWinner.name] } 
          : p
      );
      const current = updatedPrizes.find(p => p.id === selectedPrizeId);
      if (current && current.remaining <= 0) {
        const nextPrize = updatedPrizes.find(p => p.remaining > 0);
        if (nextPrize) setSelectedPrizeId(nextPrize.id);
      }
      return updatedPrizes;
    });

    setPlannedWinner(null);
    setTargetWinnerIndex(null);
  }, [plannedWinner, currentPrize, selectedPrizeId]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative overflow-hidden text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#b91d1d_0%,#450a0a_100%)]"></div>
        <div className="absolute top-[10%] left-[-5%] w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[150px]"></div>
      </div>

      <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="fixed top-8 right-8 z-50 px-6 py-2 bg-black/40 border border-yellow-500/40 rounded-full text-yellow-500 font-bold hover:bg-yellow-500 hover:text-red-950 transition-all shadow-xl active:scale-95">
        {t.langToggle}
      </button>

      <header className="z-10 text-center mb-10 px-4">
        <h1 className="text-7xl md:text-9xl font-festive gold-text font-bold mb-4 drop-shadow-xl tracking-wide">GALA 2026</h1>
        <div className="inline-block px-12 py-3 rounded-full bg-black/40 border border-yellow-500/40">
           <span className="text-yellow-400 font-black tracking-[0.4em] text-xl md:text-3xl uppercase">{t.drawTitle}</span>
        </div>
      </header>

      <div className="z-10 w-full max-w-[1900px] flex flex-col xl:flex-row gap-12 items-start justify-center px-10">
        <div className="flex-[3] flex flex-col items-center space-y-12 w-full">
          <div className="w-full max-w-3xl p-1 bg-gradient-to-br from-yellow-500/40 via-yellow-500/10 to-transparent rounded-[3rem]">
            <div className="bg-black/60 backdrop-blur-2xl rounded-[2.8rem] p-8 flex items-center justify-between border border-white/5">
              <div className="flex flex-col">
                <span className="text-yellow-500/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{t.currentCategory}</span>
                <h2 className="text-4xl md:text-5xl font-black gold-text italic leading-tight">{currentPrize ? currentPrize.level : t.selectPrize}</h2>
                <div className="text-yellow-500 text-2xl font-bold mt-2 drop-shadow-md">{currentPrize?.name}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-32 h-32 relative">
                  <img src={currentPrize?.icon} className="w-full h-full object-cover rounded-2xl border-2 border-yellow-500/30 shadow-2xl" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-yellow-500 font-black text-xs">{t.left}: {currentPrize?.remaining} / {currentPrize?.total}</span>
                </div>
              </div>
            </div>
          </div>

          <Wheel 
            participants={activeEmployeesForWheel} 
            isSpinning={isSpinning} 
            targetWinnerIndex={targetWinnerIndex}
            onSpinEnd={handleSpinEnd} 
            onStart={handleSpinStart}
            lang={lang}
          />
        </div>

        <div className="w-full xl:w-[500px] flex flex-col space-y-8">
          <div className="bg-black/40 backdrop-blur-3xl rounded-[3rem] p-8 border border-yellow-500/20 shadow-2xl">
             <h3 className="text-2xl font-black text-yellow-500 tracking-tighter mb-6 flex items-center gap-3">
               <span className="text-3xl">🏆</span> {t.prizes}
             </h3>
             <div className="grid grid-cols-1 gap-4">
               {prizes.map((p) => (
                 <div key={p.id} className="flex flex-col gap-2">
                   <button
                      disabled={isSpinning}
                      onClick={() => setSelectedPrizeId(p.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300
                        ${selectedPrizeId === p.id ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-white text-red-950 scale-[1.03] shadow-lg' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}
                        ${p.remaining <= 0 ? 'opacity-40 grayscale' : 'cursor-pointer'}`}
                   >
                     <div className="flex items-center gap-4">
                       <img src={p.icon} className="w-12 h-12 object-cover rounded-xl border border-white/10" />
                       <div className="text-left">
                         <div className={`text-[8px] font-black uppercase tracking-widest ${selectedPrizeId === p.id ? 'text-red-900' : 'text-yellow-600'}`}>{p.level}</div>
                         <div className={`text-sm font-black tracking-tight ${selectedPrizeId === p.id ? 'text-red-950' : 'text-white'}`}>{p.name}</div>
                       </div>
                     </div>
                     <div className={`flex flex-col items-center justify-center min-w-[2.5rem] p-1.5 rounded-lg ${selectedPrizeId === p.id ? 'bg-red-950/10' : 'bg-white/5'}`}>
                        <span className="text-base font-black leading-none">{p.remaining}</span>
                        <span className="text-[7px] font-bold uppercase opacity-60 mt-0.5">{t.left}</span>
                     </div>
                   </button>
                   {p.winners && p.winners.length > 0 && (
                     <div className="flex flex-wrap gap-1 px-2">
                       {p.winners.map((winName, idx) => (
                         <span key={idx} className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{winName}</span>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl rounded-[3rem] p-8 border border-yellow-500/20 shadow-2xl flex-1 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-yellow-500 tracking-tighter flex items-center gap-3">
                <span className="text-3xl">👥</span> {t.pool}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{activeEmployeesForWheel.length} {t.guests}</span>
                <button onClick={() => setShowConfig(!showConfig)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-yellow-500 hover:text-red-950 transition-all shadow-lg">
                  {showConfig ? '×' : '+'}
                </button>
              </div>
            </div>

            {showConfig && (
              <form onSubmit={handleAddEmployee} className="mb-6 animate-fade-in">
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm mb-2 focus:border-yellow-500 outline-none" placeholder={t.namePlaceholder} />
                <button className="w-full bg-yellow-500 text-red-950 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">{t.register}</button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 max-h-[500px]">
              {allEmployees.map((emp, i) => (
                <div key={emp.id} className={`p-3 rounded-xl border flex justify-between items-center transition-all ${emp.hasWon ? 'bg-black/20 border-white/5 opacity-30 grayscale' : 'bg-white/5 border-white/5 group hover:bg-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-white/20">#{String(i + 1).padStart(3, '0')}</div>
                    <div className="flex flex-col">
                       <span className={`font-bold ${emp.hasWon ? 'line-through text-white/40' : 'text-white group-hover:text-yellow-400'}`}>{emp.name}</span>
                    </div>
                  </div>
                  {emp.hasWon && <span className="text-[9px] font-black text-yellow-500/50 uppercase italic">{t.won}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WinnerModal 
        winner={lastWinner} 
        prize={lastPrize} 
        onClose={() => { setLastWinner(null); setLastPrize(null); }} 
        lang={lang} 
      />

      <style>{`
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Wheel from './components/Wheel';
import WinnerModal from './components/WinnerModal';
import { Employee, Prize } from './types';
import { DEFAULT_EMPLOYEES, DEFAULT_PRIZES } from './constants';

const App: React.FC = () => {
  // 设置默认语言为英文
  const lang = 'en';
  
  // ==========================================
  // 音频资源配置区 (AUDIO_CONFIG_START)
  // 您可以在此处更换为您自己寻找的喜庆音效 URL
  // ==========================================
  const spinAudio = useRef<HTMLAudioElement | null>(null);
  const winAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. 转盘转动时的循环音效 (建议选择鼓点或齿轮声)
    spinAudio.current = new Audio('https://downsc.chinaz.net/Files/DownLoad/sound1/201907/11724.mp3'); 
  

    // 2. 中奖时的庆祝音效 (建议选择鞭炮、礼花或欢呼声)
     winAudio.current = new Audio('https://sounddino.com/mp3/44/draw.mp3');  
  }, []);
  // ==========================================
  // 音频资源配置区 (AUDIO_CONFIG_END)
  // ==========================================

  // 初始化名单时，过滤掉老板 (Owen, Lucas, David)
  const [allEmployees, setAllEmployees] = useState<Employee[]>(() => 
    DEFAULT_EMPLOYEES.filter(e => !e.isBoss).sort(() => Math.random() - 0.5)
  );
  
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string>(DEFAULT_PRIZES[0].id);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [lastWinner, setLastWinner] = useState<Employee | null>(null);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);

  const [showConfig, setShowConfig] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const currentPrize = useMemo(() => prizes.find(p => p.id === selectedPrizeId), [prizes, selectedPrizeId]);

  const allReservedNames = useMemo(() => {
    return prizes.filter(p => p.reservedFor).map(p => p.reservedFor!.toUpperCase());
  }, [prizes]);

  // 转盘实际参与滚动的池子
  const activeEmployeesForWheel = useMemo(() => {
    if (!currentPrize) return [];
    let filtered = allEmployees.filter(e => !e.hasWon);

    if (currentPrize.reservedFor) {
      const reservedName = currentPrize.reservedFor.toUpperCase();
      filtered = filtered.filter(e => {
        const isThisReserved = e.name.toUpperCase().includes(reservedName);
        const isReservedForOtherPrizes = allReservedNames.includes(e.name.toUpperCase()) && !isThisReserved;
        return isThisReserved || !isReservedForOtherPrizes;
      });
    } else {
      filtered = filtered.filter(e => !allReservedNames.includes(e.name.toUpperCase()));
    }
    return filtered;
  }, [allEmployees, currentPrize, allReservedNames]);

  // 搜索过滤后的显示名单
  const displayedEmployees = useMemo(() => {
    return allEmployees.filter(e => 
      e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allEmployees, searchTerm]);

  const [targetWinnerIndex, setTargetWinnerIndex] = useState<number | null>(null);
  const [plannedWinner, setPlannedWinner] = useState<Employee | null>(null);

  const t = {
    drawTitle: "GALA 2026 LUCKY DRAW",
    tagline: "Celebrate Success · Fortune Awaits",
    currentCategory: "Currently Drawing",
    prizes: "PRIZE BOARD",
    pool: "GUEST LIST",
    guests: "QUALIFIED GUESTS",
    namePlaceholder: "Enter name...",
    register: "Register Guest",
    searchPlaceholder: "Search guests (A-Z)...",
    left: "STOCK",
    staff: "Member",
    selectPrize: "Select a prize to start",
    won: "WINNER",
    remove: "Remove"
  };

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

  const handleDeleteEmployee = (id: string) => {
    if (isSpinning) return;
    setAllEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleSpinStart = () => {
    if (isSpinning) return;
    if (activeEmployeesForWheel.length === 0) {
      alert("No qualified candidates left for this prize!");
      return;
    }
    if (!currentPrize || currentPrize.remaining <= 0) {
      alert("No more units available for this prize!");
      return;
    }

    let winner: Employee | null = null;
    if (currentPrize.reservedFor) {
      const reservedName = currentPrize.reservedFor.toUpperCase();
      winner = activeEmployeesForWheel.find(e => e.name.toUpperCase().includes(reservedName)) || null;
    }

    if (!winner) {
      const trulyQualified = activeEmployeesForWheel.filter(e => !e.neverWins);
      if (trulyQualified.length > 0) {
        winner = trulyQualified[Math.floor(Math.random() * trulyQualified.length)];
      } else {
        alert("No winnable candidates in the pool!");
        return;
      }
    }

    const winnerIdx = activeEmployeesForWheel.findIndex(e => e.id === winner?.id);
    setPlannedWinner(winner);
    setTargetWinnerIndex(winnerIdx);
    setIsSpinning(true);
    setLastWinner(null);
    setLastPrize(null);

    // ==========================================
    // 音频触发：转动开始 (AUDIO_TRIGGER_SPIN_START)
    // ==========================================
    if (spinAudio.current) {
      spinAudio.current.currentTime = 0;
      spinAudio.current.play().catch(() => {});
    }
  };

  const handleSpinEnd = useCallback(() => {
    if (!plannedWinner || !currentPrize) return;

    // ==========================================
    // 音频触发：转动结束并中奖 (AUDIO_TRIGGER_WIN_START)
    // ==========================================
    if (spinAudio.current) spinAudio.current.pause(); // 停止转动音
    if (winAudio.current) {
      winAudio.current.currentTime = 0;
      winAudio.current.play().catch(() => {}); // 播放中奖音
    }

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1578262825743-a4e402caab76?auto=format&fit=crop&q=80&w=200";
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 relative overflow-hidden text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#b91d1d_0%,#450a0a_100%)]"></div>
        <div className="absolute top-[10%] left-[-5%] w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[150px]"></div>
      </div>

      <header className="z-10 text-center mb-10 px-4">
        <h1 className="text-7xl md:text-9xl font-festive gold-text font-bold mb-4 drop-shadow-xl tracking-wide">ANNUAL GALA</h1>
        <div className="inline-block px-12 py-3 rounded-full bg-black/40 border border-yellow-500/40">
           <span className="text-yellow-400 font-black tracking-[0.4em] text-xl md:text-3xl uppercase">{t.drawTitle}</span>
        </div>
      </header>

      <div className="z-10 w-full max-w-[1900px] flex flex-col xl:flex-row gap-12 items-start justify-center px-10">
        {/* Main Drawing Section */}
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
                  <img 
                    src={currentPrize?.icon} 
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-2xl border-2 border-yellow-500/30 shadow-2xl bg-black/20" 
                  />
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

        {/* Sidebar Sections */}
        <div className="w-full xl:w-[500px] flex flex-col space-y-8">
          {/* Prize Board */}
          <div className="bg-black/40 backdrop-blur-3xl rounded-[3rem] p-8 border border-yellow-500/20 shadow-2xl">
             <h3 className="text-2xl font-black text-yellow-500 tracking-tighter mb-6 flex items-center gap-3">
               <span className="text-3xl">🏆</span> {t.prizes}
             </h3>
             <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
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
                       <img 
                        src={p.icon} 
                        onError={handleImageError}
                        className="w-12 h-12 object-cover rounded-xl border border-white/10 bg-black/40" 
                       />
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

          {/* Guest List List */}
          <div className="bg-black/40 backdrop-blur-3xl rounded-[3rem] p-8 border border-yellow-500/20 shadow-2xl flex-1 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-black text-yellow-500 tracking-tighter flex items-center gap-3">
                <span className="text-3xl">👥</span> {t.pool}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{allEmployees.length} {t.guests}</span>
                <button onClick={() => setShowConfig(!showConfig)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-yellow-500 hover:text-red-950 transition-all shadow-lg">
                  {showConfig ? '×' : '+'}
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-4 relative">
              <input 
                type="text" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-yellow-500/50 transition-all"
                placeholder={t.searchPlaceholder}
              />
              <svg className="absolute right-3 top-2.5 h-4 w-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {showConfig && (
              <form onSubmit={handleAddEmployee} className="mb-6 animate-fade-in">
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm mb-2 focus:border-yellow-500 outline-none" placeholder={t.namePlaceholder} />
                <button className="w-full bg-yellow-500 text-red-950 font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">{t.register}</button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 max-h-[500px]">
              {displayedEmployees.map((emp, i) => (
                <div key={emp.id} className={`p-3 rounded-xl border flex justify-between items-center transition-all group ${emp.hasWon ? 'bg-black/20 border-white/5 opacity-30 grayscale' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold text-white/20">#{String(allEmployees.indexOf(emp) + 1).padStart(3, '0')}</div>
                    <div className="flex flex-col">
                       <span className={`font-bold transition-colors ${emp.hasWon ? 'line-through text-white/40' : 'text-white group-hover:text-yellow-400'}`}>
                         {emp.name}
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {emp.hasWon && <span className="text-[9px] font-black text-yellow-500/50 uppercase italic">{t.won}</span>}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(emp.id); }}
                      disabled={isSpinning}
                      className={`text-[10px] p-1.5 rounded-lg border border-red-500/30 text-red-500/50 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 ${isSpinning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      title={t.remove}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {displayedEmployees.length === 0 && (
                <div className="text-center py-10 opacity-20 italic">No guests found</div>
              )}
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

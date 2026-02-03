
import React, { useState, useCallback, useEffect } from 'react';
import Wheel from './components/Wheel';
import WinnerModal from './components/WinnerModal';
import { Employee, Prize, DrawResult } from './types';
import { DEFAULT_EMPLOYEES, DEFAULT_PRIZES } from './constants';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [prizes] = useState<Prize[]>(DEFAULT_PRIZES);
  
  const [activeSpinner, setActiveSpinner] = useState<Employee | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const [lastWinner, setLastWinner] = useState<Employee | null>(null);
  const [lastPrize, setLastPrize] = useState<Prize | null>(null);
  const [history, setHistory] = useState<DrawResult[]>([]);
  
  const [showConfig, setShowConfig] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("");

  useEffect(() => {
    if (!isSpinning && employees.length > 0) {
      setActiveSpinner(employees[0]);
    } else if (employees.length === 0) {
      setActiveSpinner(null);
    }
  }, [employees, isSpinning]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setEmployees(prev => [...prev, {
        id: Date.now().toString(),
        name: newName.trim(),
        department: newDept.trim() || "Headquarters"
      }]);
      setNewName("");
      setNewDept("");
    }
  };

  const handleSpinStart = () => {
    if (isSpinning) return;
    if (!activeSpinner) {
      alert("Employee list is empty. Please add participants first.");
      return;
    }
    setIsSpinning(true);
    setLastWinner(null);
    setLastPrize(null);
  };

  const handleSpinEnd = useCallback((wonPrize: Prize) => {
    if (!activeSpinner) return;
    
    const currentLuckyOne = activeSpinner;
    setLastWinner(currentLuckyOne);
    setLastPrize(wonPrize);
    setIsSpinning(false);
    
    setEmployees(prev => prev.filter(e => e.id !== currentLuckyOne.id));

    setHistory(prev => [{
      winner: currentLuckyOne,
      prize: wonPrize,
      timestamp: Date.now()
    }, ...prev].slice(0, 10));
  }, [activeSpinner]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6 relative overflow-hidden selection:bg-yellow-500 selection:text-red-950">
      
      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-10 left-[5%] text-7xl animate-bounce">🧧</div>
        <div className="absolute top-40 right-[8%] text-7xl animate-pulse">🏮</div>
        <div className="absolute bottom-20 left-[10%] text-6xl animate-bounce delay-700">🧧</div>
        <div className="absolute bottom-40 right-[5%] text-6xl animate-pulse delay-500">🏮</div>
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-yellow-600 rounded-full blur-[200px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-400 rounded-full blur-[200px] opacity-20"></div>
      </div>

      <header className="z-10 text-center mb-8 px-4">
        <h1 className="text-6xl md:text-9xl font-festive gold-text font-bold mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
          Gala 2026 · Grand Draw
        </h1>
        <div className="inline-block bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 px-16 py-2 rounded-full shadow-2xl">
           <span className="text-yellow-400 font-bold tracking-[0.5em] text-sm md:text-xl uppercase">
             ANNUAL GALA 2026 · Coronation of Fortune
           </span>
        </div>
      </header>

      <div className="z-10 w-full max-w-[1700px] flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center px-10">
        
        {/* Main Area */}
        <div className="flex-[3] flex flex-col items-center space-y-12 py-4">
          
          {/* Current Participant */}
          <div className="w-full max-w-3xl bg-black/40 backdrop-blur-xl rounded-[4rem] border border-yellow-500/20 p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {activeSpinner ? (
               <div className="animate-fade-in flex flex-col items-center relative z-10">
                 <div className="text-yellow-500/60 text-lg mb-2 uppercase tracking-widest font-black">Next Lucky Star</div>
                 <div className="flex items-end justify-center gap-10">
                    <div className="text-white text-9xl font-black gold-text italic tracking-tighter drop-shadow-2xl">
                      {activeSpinner.name}
                    </div>
                    <div className="flex flex-col items-start mb-3">
                      <span className="bg-yellow-500 text-red-950 text-xs px-3 py-1 rounded-md font-black shadow-lg uppercase mb-1">
                        {activeSpinner.department}
                      </span>
                      <span className="text-yellow-600/60 text-[10px] font-black tracking-widest animate-pulse">Awaiting Fortune</span>
                    </div>
                 </div>
               </div>
            ) : (
               <div className="text-yellow-500 text-5xl font-festive animate-pulse py-4">
                 List Empty · Happy New Year!
               </div>
            )}
          </div>

          {/* Wheel Component */}
          <div className="relative transform hover:scale-[1.01] transition-all duration-500">
             <div className="absolute inset-0 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
             <Wheel 
               prizes={prizes} 
               isSpinning={isSpinning} 
               onSpinEnd={handleSpinEnd} 
               onStart={handleSpinStart}
             />
          </div>

          {/* History */}
          <div className="flex gap-6 overflow-hidden max-w-2xl justify-center opacity-50 hover:opacity-100 transition-all">
             {history.slice(0, 5).map((h) => (
               <div key={h.timestamp} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-[2rem] hover:bg-yellow-500/10 transition-colors">
                  <span className="text-2xl drop-shadow-md">{h.prize.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">{h.winner.name}</span>
                    <span className="text-yellow-500 text-[10px] font-black uppercase tracking-tighter">{h.prize.level}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar: Participants Pool */}
        <div className="w-full lg:w-[420px] flex flex-col space-y-8 self-stretch">
          <div className="bg-black/30 backdrop-blur-3xl rounded-[3.5rem] p-10 border border-yellow-500/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col h-full min-h-[850px]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-yellow-400 flex items-center gap-4 tracking-tighter">
                <span className="text-4xl drop-shadow-lg">📋</span> List
              </h3>
              <button 
                onClick={() => setShowConfig(!showConfig)} 
                className="text-[10px] font-black text-yellow-600/80 border border-yellow-600/30 px-4 py-1.5 rounded-full hover:bg-yellow-600 hover:text-red-950 transition-all uppercase"
              >
                {showConfig ? 'Close' : 'Admin'}
              </button>
            </div>

            {showConfig && (
              <form onSubmit={handleAddEmployee} className="mb-8 flex flex-col gap-4 animate-fade-in">
                <input 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="bg-red-950/40 border border-yellow-600/20 rounded-3xl px-6 py-4 text-white text-base outline-none focus:border-yellow-500 transition-all placeholder-white/10" 
                  placeholder="Enter name..."
                />
                <button className="bg-yellow-500 text-red-950 font-black py-4 rounded-3xl text-sm hover:scale-[1.02] shadow-xl active:scale-95 transition-all">Add Participant</button>
              </form>
            )}

            <div className="flex-1 overflow-y-auto pr-3 space-y-5 custom-scrollbar pb-10">
              {employees.length === 0 ? (
                 <div className="text-gray-600 text-2xl text-center py-40 font-festive italic opacity-50 italic">Pool Empty</div>
              ) : (
                employees.map((emp, index) => (
                  <div
                    key={emp.id}
                    className={`p-6 rounded-[2.5rem] border transition-all duration-700 flex justify-between items-center relative overflow-hidden group
                      ${index === 0 
                        ? 'bg-gradient-to-br from-yellow-500/30 to-transparent border-yellow-500 shadow-[0_15px_30px_rgba(234,179,8,0.2)] scale-[1.05] z-10 translate-x-2' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-11 h-11 rounded-3xl flex items-center justify-center text-base font-black transition-transform group-hover:rotate-12
                        ${index === 0 ? 'bg-yellow-500 text-red-950 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'bg-red-900/50 text-gray-500'}`}>
                        {index + 1}
                      </div>
                      <div className="flex flex-col">
                        <div className={`font-black tracking-tight ${index === 0 ? 'text-yellow-400 text-2xl' : 'text-lg'}`}>{emp.name}</div>
                        <div className="text-[10px] font-black opacity-30 uppercase tracking-widest">{emp.department}</div>
                      </div>
                    </div>
                    {index === 0 && (
                      <span className="text-3xl animate-bounce drop-shadow-lg">🎯</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-10 border-t border-white/10 flex justify-between items-end opacity-20">
               <div className="flex flex-col">
                  <span className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-1">Queue Control</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter leading-none">Automatic Sequential Draw</span>
               </div>
               <span className="text-4xl font-black text-white italic">{employees.length}</span>
            </div>
          </div>
        </div>
      </div>

      <WinnerModal 
        winner={lastWinner} 
        prize={lastPrize}
        onClose={() => { setLastWinner(null); setLastPrize(null); }} 
      />

      <footer className="mt-auto py-12 z-10 opacity-10 text-yellow-700 text-[10px] font-black tracking-[1.5em] text-center uppercase">
         GALA 2026 · Premium Drawing Experience
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(184, 134, 11, 0.3); border-radius: 20px; }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(40px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
      `}</style>
    </div>
  );
};

export default App;

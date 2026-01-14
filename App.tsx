
import React, { useState, useEffect } from 'react';
import StarField from './components/StarField';
import ResultDisplay from './components/ResultDisplay';
import { NASAData, SearchHistory } from './types';
import { fetchAPOD, getValidDate } from './services/nasaService';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nasaData, setNasaData] = useState<NASAData | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('cosmic_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent, manualDate?: string) => {
    if (e) e.preventDefault();
    const targetDate = manualDate || birthDate;
    if (!targetDate) return;

    setLoading(true);
    setError(null);
    setNasaData(null);

    try {
      const validDate = getValidDate(targetDate);
      const data = await fetchAPOD(validDate);
      setNasaData(data);
      setLoading(false);

      // Save to history
      const newEntry: SearchHistory = {
        id: Date.now().toString(),
        date: targetDate,
        title: data.title,
        thumbnail: data.url
      };
      
      setHistory(prev => {
        const filtered = prev.filter(h => h.date !== targetDate);
        const updated = [newEntry, ...filtered.slice(0, 5)];
        localStorage.setItem('cosmic_history', JSON.stringify(updated));
        return updated;
      });

    } catch (err: any) {
      setError(err.message || 'An error occurred while reaching for the stars.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative px-4 pb-24 overflow-y-auto overflow-x-hidden">
      <StarField />
      
      {/* Header */}
      <header className="pt-16 pb-12 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 p-1 px-4 mb-8 rounded-full bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase animate-pulse">
          <i className="fas fa-satellite-dish"></i>
          NASA Open Archives
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-500 drop-shadow-sm">
          COSMIC BIRTHDAY
        </h1>
        <p className="text-slate-400 text-xl md:text-2xl font-light max-w-xl mx-auto leading-relaxed">
          Journey back to the stellar landscape as it appeared on the day you entered the universe.
        </p>
      </header>

      {/* Main Search Form */}
      <main className="max-w-xl mx-auto z-20 relative">
        <form onSubmit={handleSearch} className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass p-2 rounded-2xl flex items-center shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/50">
            <div className="flex-grow relative flex items-center pl-4">
               <i className="fas fa-calendar-star absolute left-4 text-blue-500/50 pointer-events-none"></i>
               <input 
                type="date" 
                className="bg-transparent border-none focus:ring-0 text-white w-full p-4 pl-8 text-xl appearance-none cursor-pointer font-medium"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold h-[64px] px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin text-xl"></i>
              ) : (
                <i className="fas fa-shuttle-space text-xl"></i>
              )}
              <span className="hidden sm:inline text-lg">{loading ? 'Searching...' : 'Initiate Discovery'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 glass border-red-500/30 text-red-400 rounded-2xl text-center animate-in slide-in-from-top-4">
            <i className="fas fa-triangle-exclamation mr-2"></i> {error}
          </div>
        )}
      </main>

      {/* Recent History */}
      {!loading && history.length > 0 && (
        <section className={`mt-24 max-w-5xl mx-auto transition-all duration-700 ${nasaData ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center gap-4 mb-8 px-4">
            <div className="h-px flex-grow bg-white/5"></div>
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Previous Journeys</h3>
            <div className="h-px flex-grow bg-white/5"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setBirthDate(item.date);
                  handleSearch(undefined, item.date);
                }}
                className="glass p-2 pb-4 rounded-3xl group transition-all hover:-translate-y-2 hover:border-blue-500/30 text-left"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-3 border border-white/5">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                </div>
                <div className="px-2">
                  <p className="text-[10px] font-black text-blue-500/80 mb-1">{item.date}</p>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight group-hover:text-white transition-colors">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Result Area */}
      {nasaData && (
        <div id="results-anchor" className="scroll-mt-12">
           <ResultDisplay 
            nasaData={nasaData}
          />
        </div>
      )}

      {/* Empty State / Hints */}
      {!nasaData && !loading && (
        <div className="mt-24 flex flex-col items-center justify-center text-slate-700 text-sm opacity-40 hover:opacity-60 transition-opacity duration-500 pointer-events-none">
          <div className="flex gap-12 items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-white/5">
                <i className="fas fa-calendar-day text-xl"></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Temporal Entry</span>
            </div>
            <div className="w-12 h-px bg-slate-800"></div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-white/5">
                <i className="fas fa-satellite text-xl"></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Orbit Intercept</span>
            </div>
            <div className="w-12 h-px bg-slate-800"></div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-white/5">
                <i className="fas fa-brain text-xl"></i>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Cognitive Sync</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

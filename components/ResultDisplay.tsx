
import React from 'react';
import { NASAData, CosmicReading } from '../types';

interface ResultDisplayProps {
  nasaData: NASAData;
  reading: CosmicReading | null;
  loadingReading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ nasaData, reading, loadingReading }) => {
  const shareUrl = nasaData.hdurl || nasaData.url;
  const shareText = `Check out the universe on my birthday: ${nasaData.title} via NASA APOD! 🚀✨`;

  const handleShare = async (platform: 'twitter' | 'facebook' | 'whatsapp' | 'native' | 'copy') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'Cosmic Birthday',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        alert('Cosmic link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    } else if (platform !== 'native') {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Media & NASA Details (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-3xl overflow-hidden shadow-2xl group relative border border-white/10">
            {nasaData.media_type === 'image' ? (
              <img 
                src={nasaData.hdurl || nasaData.url} 
                alt={nasaData.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <iframe
                title={nasaData.title}
                src={nasaData.url}
                className="w-full aspect-video"
                frameBorder="0"
                allowFullScreen
              />
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold border border-white/10 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-blue-400"></i>
                <span>Captured on {nasaData.date}</span>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
             <div className="flex justify-between items-start gap-4">
               <h2 className="text-3xl font-bold tracking-tight text-white">
                {nasaData.title}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleShare('copy')}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Copy Link"
                >
                  <i className="fas fa-link text-sm"></i>
                </button>
                {navigator.share && (
                  <button 
                    onClick={() => handleShare('native')}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                    title="Share"
                  >
                    <i className="fas fa-share-alt text-sm"></i>
                  </button>
                )}
              </div>
             </div>
            
            <p className="text-slate-300 leading-relaxed text-base">
              {nasaData.explanation}
            </p>

            {/* Sharing Row */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Share the Discovery</span>
              <div className="flex gap-3">
                <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40 border border-[#1DA1F2]/30 flex items-center justify-center transition-all">
                  <i className="fab fa-x-twitter text-[#1DA1F2]"></i>
                </button>
                <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-[#4267B2]/20 hover:bg-[#4267B2]/40 border border-[#4267B2]/30 flex items-center justify-center transition-all">
                  <i className="fab fa-facebook-f text-[#4267B2]"></i>
                </button>
                <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/40 border border-[#25D366]/30 flex items-center justify-center transition-all">
                  <i className="fab fa-whatsapp text-[#25D366]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Reading (5/12) */}
        <div className="lg:col-span-5 h-full">
          <div className="glass p-8 rounded-3xl border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.05)] sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <i className="fas fa-sparkles text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Astral Reading</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">AI Generated for your birth date</p>
              </div>
            </div>

            {loadingReading ? (
              <div className="space-y-6 py-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-white/5 rounded w-full"></div>
                  <div className="h-4 bg-white/5 rounded w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded w-4/6"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-white/5 rounded-2xl animate-pulse"></div>
                  <div className="h-24 bg-white/5 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            ) : reading ? (
              <div className="space-y-10">
                <div className="relative">
                  <i className="fas fa-quote-left absolute -top-4 -left-2 text-white/5 text-4xl"></i>
                  <p className="text-xl text-slate-200 font-light italic leading-relaxed relative z-10">
                    {reading.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-900/10 p-5 rounded-2xl border border-blue-500/10 group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fas fa-sun text-blue-400 text-xs"></i>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black">Zodiac Sign</span>
                    </div>
                    <p className="text-2xl font-bold text-white tracking-tight">{reading.starSign}</p>
                  </div>
                  <div className="bg-purple-900/10 p-5 rounded-2xl border border-purple-500/10 group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="fas fa-star text-purple-400 text-xs"></i>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-black">Celestial Body</span>
                    </div>
                    <p className="text-2xl font-bold text-white tracking-tight">{reading.luckyConstellation}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <button 
                    onClick={() => window.open(nasaData.hdurl || nasaData.url, '_blank')}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-4 text-sm font-semibold transition-all group"
                  >
                    <i className="fas fa-expand-arrows-alt group-hover:scale-110 transition-transform"></i>
                    <span>View High-Resolution Original</span>
                  </button>
                </div>
              </div>
            ) : (
               <div className="text-center py-20">
                 <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-4 border border-white/5">
                   <i className="fas fa-meteor text-slate-700 text-2xl animate-pulse"></i>
                 </div>
                 <p className="text-slate-500 text-sm italic">The cosmos is deep and silent. Please try another date or refresh.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;


import React from 'react';
import { NASAData } from '../types';

interface ResultDisplayProps {
  nasaData: NASAData;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ nasaData }) => {
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
    <div className="w-full max-w-4xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-6">

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
      </div>
    </div>
  );
};

export default ResultDisplay;

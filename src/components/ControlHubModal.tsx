import React from 'react';
import { 
  X, 
  Settings, 
  Smartphone, 
  Star, 
  Trash2, 
  Mic, 
  Bookmark, 
  Sliders 
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useModalClose } from '../hooks/useModalClose';
import { motion } from 'motion/react';

interface ControlHubModalProps {
  theme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'settings' | 'bookmarks';
  setActiveTab: (tab: 'settings' | 'bookmarks') => void;
  settings: {
    hapticsEnabled: boolean;
    soundEnabled: boolean;
    autoCopy: boolean;
    themeStyle: string;
  };
  updateSetting: (key: string, value: boolean) => void;
  favorites: any[];
  handleSelectFavorite: (fav: any) => void;
  handleDeleteFavorite: (id: string) => void;
}

export default function ControlHubModal({
  theme,
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  settings,
  updateSetting,
  favorites,
  handleSelectFavorite,
  handleDeleteFavorite,
}: ControlHubModalProps) {
  // Use our premium unified hook for perfect keyboard/touch/scroll behaviors
  const modalRef = useModalClose<HTMLDivElement>({
    isOpen,
    onClose,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    closeOnScroll: false,
    lockScroll: true,
    trapFocus: true,
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.92, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className={`max-w-xl w-full p-6 border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] relative transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-[#0f111a]/95 border-[#282d3e] text-slate-200' 
            : 'bg-white border-slate-250 text-slate-700'
        }`}
      >
        {/* Glow accent band */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-[#282d3e]">
          <span className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-fuchsia-400 font-mono">
            <Settings className="w-4.5 h-4.5 text-fuchsia-400" />
            RadixLab Control Hub
          </span>
          <button
            onClick={() => { triggerHaptic(); onClose(); }}
            className="p-1.5 bg-[#171a25]/60 hover:bg-[#202534]/85 border border-[#23293a] text-slate-400 hover:text-slate-100 rounded-lg cursor-pointer transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dynamic Navigation Tabs Selector (Highly Polished UX Fix) */}
        <div className="flex border-b border-[#212638] mb-5 p-1 gap-1.5 bg-[#0a0c15] rounded-xl border">
          <button
            onClick={() => { triggerHaptic(); setActiveTab('settings'); }}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/30 text-fuchsia-300 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-transparent'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Suite Settings
          </button>
          <button
            onClick={() => { triggerHaptic(); setActiveTab('bookmarks'); }}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/30 text-fuchsia-300 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-transparent'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${activeTab === 'bookmarks' ? 'fill-fuchsia-400 text-fuchsia-400' : ''}`} />
            Bookmarks ({favorites.length})
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'settings' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Device Configs Card */}
              <div className="space-y-3 bg-[#131621] p-4 rounded-lg border border-[#212638]">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-fuchsia-400" />
                  Haptic & Audio Configurations
                </h3>
                
                <div className="space-y-3 text-xs">
                  {/* Haptic Toggle */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <div className="font-semibold text-slate-300">Device Haptic Vibration</div>
                      <div className="text-[10px] text-slate-500">Enable tactile mobile touch triggers</div>
                    </div>
                    <button 
                      onClick={() => updateSetting('hapticsEnabled', !settings.hapticsEnabled)}
                      className={`w-11 h-6 rounded-full transition flex items-center p-1 cursor-pointer ${settings.hapticsEnabled ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
                      aria-label="Toggle haptics state"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${settings.hapticsEnabled ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {/* Sound clicking */}
                  <div className="flex justify-between items-center py-1 border-t border-[#202535] pt-2">
                    <div>
                      <div className="font-semibold text-slate-300">Tactile Audio Ticks</div>
                      <div className="text-[10px] text-slate-500">Play mechanical ticks synthesized on clicks</div>
                    </div>
                    <button 
                      onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                      className={`w-11 h-6 rounded-full transition flex items-center p-1 cursor-pointer ${settings.soundEnabled ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
                      aria-label="Toggle sound feedback state"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${settings.soundEnabled ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>

                  {/* Auto-copy */}
                  <div className="flex justify-between items-center py-1 border-t border-[#202535] pt-2">
                    <div>
                      <div className="font-semibold text-slate-300">Auto-Copy Calculations</div>
                      <div className="text-[10px] text-slate-500">Automatically copy results to clipboard on action</div>
                    </div>
                    <button 
                      onClick={() => updateSetting('autoCopy', !settings.autoCopy)}
                      className={`w-11 h-6 rounded-full transition flex items-center p-1 cursor-pointer ${settings.autoCopy ? 'bg-fuchsia-500' : 'bg-slate-700'}`}
                      aria-label="Toggle auto-copy state"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-all ${settings.autoCopy ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Speech Commands details */}
              <div className="space-y-3 bg-[#131621] p-4 rounded-lg border border-[#212638]">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-indigo-400" />
                  Voice Dictation Guide (Web Speech)
                </h3>
                <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
                  <p>Speak clearly inside active dictation mode to transcribe integers directly on-the-fly:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li><span className="text-slate-300">Decimal (B-10):</span> "one hundred twenty five" ➔ <span className="font-mono text-emerald-400 font-bold">125</span></li>
                    <li><span className="text-slate-300">Binary (B-2):</span> "one zero one one" ➔ <span className="font-mono text-emerald-400 font-bold">1011</span></li>
                    <li><span className="text-slate-300">Hexadecimal (B-16):</span> "alpha delta zero" ➔ <span className="font-mono text-emerald-400 font-bold">AD0</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-3 bg-[#131621] p-4 rounded-lg border border-[#212638]">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  Saved Calculations
                </h3>

                {favorites.length === 0 ? (
                  <div className="text-[11px] text-slate-500 italic py-5 text-center">
                    No bookmarks saved yet! Hit the star icon (☆) next to any conversion result to save it here for rapid lookup.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                    {favorites.map((fav) => (
                      <div 
                        key={fav.id}
                        className="flex items-center justify-between bg-[#1a1d29] border border-[#282d3e] rounded-xl p-3 text-xs transition hover:border-slate-500"
                      >
                        <button
                          onClick={() => {
                            triggerHaptic();
                            handleSelectFavorite(fav);
                            onClose();
                          }}
                          className="flex-1 text-left font-mono text-[10px] text-fuchsia-300 hover:text-fuchsia-200 font-black hover:underline transition cursor-pointer pr-3"
                        >
                          {fav.title || `Base ${fav.fromBase} ➔ Base ${fav.toBase}`}
                        </button>
                        <button
                          onClick={() => {
                            triggerHaptic();
                            handleDeleteFavorite(fav.id);
                          }}
                          className="p-1.5 bg-[#202534]/65 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 border border-[#272d42] rounded-lg transition cursor-pointer"
                          title="Remove favorite bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back and return */}
        <button
          onClick={() => { triggerHaptic(); onClose(); }}
          className="w-full mt-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-650 hover:to-indigo-650 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition duration-150 cursor-pointer text-center shadow-lg"
        >
          Return to lab
        </button>
      </motion.div>
    </motion.div>
  );
}

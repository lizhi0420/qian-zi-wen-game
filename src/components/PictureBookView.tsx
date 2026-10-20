import React, { useState } from 'react';
import { QianziwenUnit, CharacterItem } from '../types/qianziwen';
import { ScholarMascot } from './ScholarMascot';
import { 
  Volume2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  X, 
  MapPin 
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PictureBookProps {
  currentUnit: QianziwenUnit;
  allUnits: QianziwenUnit[];
  onSelectUnit: (unit: QianziwenUnit) => void;
  onCharacterLearned: (char: string) => void;
}

export const PictureBookView: React.FC<PictureBookProps> = ({
  currentUnit,
  allUnits,
  onSelectUnit,
  onCharacterLearned,
}) => {
  const [activeItem, setActiveItem] = useState<CharacterItem | null>(null);

  const curIdx = allUnits.findIndex(u => u.id === currentUnit.id);

  const handlePrev = () => {
    if (curIdx > 0) {
      sound.playWoodblock();
      onSelectUnit(allUnits[curIdx - 1]);
      setActiveItem(null);
    }
  };

  const handleNext = () => {
    if (curIdx < allUnits.length - 1) {
      sound.playWoodblock();
      onSelectUnit(allUnits[curIdx + 1]);
      setActiveItem(null);
    }
  };

  const handleHotspotClick = (item: CharacterItem) => {
    sound.playChime(784);
    sound.speak(`${item.char}。拼音：${item.pinyin}。${item.hotspotLabel || ''}。`);
    setActiveItem(item);
    onCharacterLearned(item.char);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCFAF4] border border-[#E5DAC8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="seal-stamp text-xs px-2.5 py-0.5">有声绘本</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2A2421] font-guofeng">
              国风水彩有声绘本 · 第 {currentUnit.unitNumber} 卷
            </h2>
          </div>
          <p className="text-xs text-[#7B6E60] font-guofeng mt-1">
            点击水彩画卷中的事物，在国风意境中图文并茂理解文字起源。
          </p>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={curIdx <= 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#D5C6AE] text-xs font-semibold text-[#3D2F22] hover:bg-[#F2EDE1] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>上一页</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#3F5E4D] px-2">
            第 {currentUnit.unitNumber} / {allUnits.length} 页
          </span>

          <button
            onClick={handleNext}
            disabled={curIdx >= allUnits.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#D5C6AE] text-xs font-semibold text-[#3D2F22] hover:bg-[#F2EDE1] disabled:opacity-30 transition-colors cursor-pointer"
          >
            <span>下一页</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Picture Book Stage */}
      <div className="relative rounded-3xl overflow-hidden border-3 border-[#D5C6AC] shadow-xl bg-[#FAF7F0]">
        
        {/* Full Watercolor Canvas */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden select-none">
          <img
            src={currentUnit.illustration}
            alt={currentUnit.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Poetic Title Inscription in traditional vertical or corner layout */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-sm bg-[#FAF7F0]/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#E3DAC8] shadow-md">
            <span className="text-[10px] font-bold text-[#BA3329] font-guofeng">
              【 {currentUnit.title} 】
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#2A2421] font-guofeng mt-0.5">
              {currentUnit.fullText}
            </h3>
            <p className="text-xs text-[#5E5144] font-mono mt-0.5">
              {currentUnit.fullPinyin}
            </p>
          </div>

          {/* Interactive Hotspot Pins on the Painting */}
          {currentUnit.characters.map((item, idx) => {
            // Default distributed positions if not provided
            const posX = item.hotspotX ?? (15 + (idx % 4) * 22);
            const posY = item.hotspotY ?? (25 + Math.floor(idx / 4) * 45);
            const isSelected = activeItem?.id === item.id;

            return (
              <div
                key={item.id}
                style={{ top: `${posY}%`, left: `${posX}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <button
                  onClick={() => handleHotspotClick(item)}
                  className={`relative p-1.5 sm:p-2 rounded-2xl backdrop-blur-md border-2 transition-all duration-300 shadow-lg cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FAF3D8] border-[#C69A57] ring-4 ring-[#C69A57]/40 scale-110'
                      : 'bg-white/85 hover:bg-white border-[#D5C6AC] hover:scale-105'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#3F5E4D] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#2A2421] font-guofeng">
                    {item.char}
                  </span>
                  {item.hotspotLabel && (
                    <span className="text-[10px] text-[#6A5A4B] font-guofeng hidden sm:inline px-1 border-l border-[#D8CABB]">
                      {item.hotspotLabel}
                    </span>
                  )}
                </button>

                {/* Soft pulse glow around hotspot */}
                <span className="absolute -inset-1 rounded-2xl bg-[#3F5E4D]/20 animate-ping -z-10 opacity-75"></span>
              </div>
            );
          })}

          {/* Bottom Floating Bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-[#FAF7F0]/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#E3DAC8] shadow-md flex items-center justify-between gap-4 text-xs">
            <span className="text-[#655648] font-guofeng">
              💡 提示：点击画卷中的 8 个发光汉字标签，即可听声音、看释义！
            </span>
            <button
              onClick={() => sound.speak(currentUnit.meaning)}
              className="flex items-center gap-1 font-bold text-[#3F5E4D] hover:underline cursor-pointer shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>听全幅画卷意境解说</span>
            </button>
          </div>
        </div>

        {/* Selected Hotspot Detail Card Panel */}
        {activeItem && (
          <div className="p-6 bg-white border-t border-[#E3DAC8] space-y-3 animate-ink-appear">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-16 rounded-xl bg-[#FAF7F0] border-2 border-[#D5C6AE] flex flex-col items-center justify-center">
                  <span className="text-xs font-mono text-[#897767]">{activeItem.pinyin}</span>
                  <span className="text-3xl font-black text-[#2A2421] font-guofeng">{activeItem.char}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="seal-stamp text-xs px-2 py-0.2">
                      {activeItem.hotspotLabel || '画中意境'}
                    </span>
                    <h4 className="text-base font-bold text-[#2A2421] font-guofeng">
                      汉字：{activeItem.char}（{activeItem.pinyin}）
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#6C5E4E] mt-1 leading-relaxed">
                    {activeItem.meaning}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => sound.speak(`${activeItem.char}。拼音：${activeItem.pinyin}。${activeItem.meaning}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3F5E4D] hover:bg-[#324B3D] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>朗读释义</span>
                </button>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 rounded-xl hover:bg-[#F0E8D6] text-[#7E6F5E] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Example sentence & words */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[#847362] font-semibold">相关词语：</span>
              {activeItem.words.map((w, i) => (
                <button
                  key={i}
                  onClick={() => sound.speak(w)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#D8C7B0] text-[#3D2F22] hover:text-[#3F5E4D] cursor-pointer"
                >
                  {w} 🔊
                </button>
              ))}
              <span className="text-[#847362] font-semibold ml-2">例句：</span>
              <span className="text-[#4E4133] italic">{activeItem.example}</span>
            </div>
          </div>
        )}

      </div>

      {/* Mascot Companion */}
      <ScholarMascot
        message="《千字文》不仅是优美的韵文，更是一幅包罗万象的古代百科全书！从浩瀚宇宙、日月星斗，到山川河流、草木鸟兽，每一幅画都藏着汉字的密码！"
        subMessage="小书童伴学：点击右上角‘上一页 / 下一页’可以自由翻阅不同单元的有声绘卷。"
      />
    </div>
  );
};

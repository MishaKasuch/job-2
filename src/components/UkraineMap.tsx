import { useState } from 'react';
import { Branch } from '../types';
import { MapPin, Building, Phone, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface UkraineMapProps {
  branches: Branch[];
}

export default function UkraineMap({ branches }: UkraineMapProps) {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(branches[0] || null);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Map Visualization Area */}
        <div className="flex-1 relative bg-slate-100 rounded-xl p-4 border border-slate-200/60 min-h-[300px] flex items-center justify-center">
          
          {/* Decorative Grid Network Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

          {/* Stylized Ukraine & Central Europe SVG Outer Map Group */}
          <svg
            viewBox="0 0 800 450"
            className="w-full h-auto max-w-[550px] relative z-10 filter drop-shadow-[0_4px_12px_rgba(30,41,59,0.08)]"
          >
            {/* Outline of Ukraine: High quality simplified polygon grid */}
            <path
              d="M 150 160 L 220 140 L 270 145 L 340 120 L 420 130 L 460 110 L 520 120 L 590 145 L 630 130 L 680 150 L 720 190 L 710 240 L 680 270 L 630 290 L 540 310 L 490 280 L 450 310 L 440 350 L 390 350 L 370 315 L 330 310 L 290 290 L 260 300 L 220 280 L 190 290 L 160 250 L 175 220 L 140 190 Z"
              fill="#e2e8f0"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-colors duration-300"
            />
            
            {/* Dnipro river stylized path */}
            <path
              d="M 390 125 C 410 180, 400 210, 440 230 C 470 245, 490 260, 460 290 C 435 315, 410 290, 400 310"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="opacity-70"
            />

            {/* Central Europe boundary hint indicators (Slovakia/Poland to the left) */}
            <path
              d="M 140 190 L 90 200 L 40 180 L 10 210 L 15 260 L 60 290 L 160 250"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Branch Hotspots Pins */}
            {branches.map((b) => {
              const isSelected = selectedBranch?.id === b.id;
              // Map coordination scaling for svg viewBox "0 0 800 450"
              const xPos = b.coords.x * 7.5 + 40;
              const yPos = b.coords.y * 3.8 + 40;

              return (
                <g
                  key={b.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedBranch(b)}
                >
                  {/* Glowing Radar Background */}
                  {isSelected && (
                    <circle
                      cx={xPos}
                      cy={yPos}
                      r="16"
                      fill="#d97706"
                      className="animate-ping opacity-30 origin-center"
                    />
                  )}

                  {/* Outer circle target */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isSelected ? "10" : "7"}
                    fill={isSelected ? "#1e3a8a" : "#f59e0b"}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-300 shadow-sm"
                  />

                  {/* Little inner core */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r="3"
                    fill="#ffffff"
                  />

                  {/* Interactive Label (Hidden by default, shown on map hover) */}
                  <foreignObject
                    x={xPos - 50}
                    y={yPos - 38}
                    width="100"
                    height="30"
                    className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <div className="bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded shadow text-center truncate">
                      {b.city.split(' (')[0]}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* Key Map Indicator Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm py-1 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Філії KONSTANTA v.r.o.</span>
          </div>
        </div>

        {/* Selected Branch Detail Sidebar */}
        <div className="w-full md:w-[320px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-blue-900" />
              <h3 className="font-sans font-semibold text-lg text-slate-900">
                Адреси наших офісів
              </h3>
            </div>
            
            <p className="text-sm text-slate-500 mb-6">
              Ми маємо мережу офісів та представництв по всій Україні та країнах Європейського Союзу для швидкого зв'язку з кандидатами.
            </p>

            {/* List of branches */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2">
              {branches.map((b) => {
                const isSelected = selectedBranch?.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranch(b)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-blue-900 bg-blue-50/50 text-blue-950 font-medium shadow-sm'
                        : 'border-slate-250 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-900' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold">{b.city}</div>
                      <div className="text-slate-500 mt-0.5 line-clamp-1">{b.address}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active branch details box */}
          {selectedBranch && (
            <motion.div
              layoutId="selected-branch-box"
              className="mt-6 bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                    Обрана філія
                  </span>
                  <h4 className="font-sans font-semibold text-sm mt-0.5">
                    {selectedBranch.city}
                  </h4>
                </div>
                <Info className="w-4 h-4 text-slate-400 mt-0.5" />
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <span>{selectedBranch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>+380 809 100 55</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                <span>Пн - Пт: 09:00 - 18:00</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Відкрито
                </span>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}

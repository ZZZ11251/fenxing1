/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import ScienceHub from "./components/ScienceHub";
import Questionnaire from "./components/Questionnaire";
import ResultBoard from "./components/ResultBoard";
import { UserAnswers } from "./types";
import { motion } from "motion/react";
import { Sparkles, Heart } from "lucide-react";
import bgImage from "./assets/images/pcos_watercolor_bg_1783696087176.jpg";

// App navigation screens
type AppScreen = "HUB" | "QUESTIONNAIRE" | "RESULT";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("HUB");
  const [answers, setAnswers] = useState<UserAnswers | null>(null);

  const handleStartQuestionnaire = () => {
    setScreen("QUESTIONNAIRE");
  };

  const handleCompleteQuestionnaire = (completedAnswers: UserAnswers) => {
    setAnswers(completedAnswers);
    setScreen("RESULT");
  };

  const handleReset = () => {
    setAnswers(null);
    setScreen("HUB");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#FCFBF9] via-[#FCF5F5] to-[#EAF1F5] font-sans text-[#333333] transition-colors duration-500 pb-12">
      
      {/* ================= BACKGROUND WATERCOLOR BLEEDING EFFECTS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft pink watercolor splash */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-pink-200/30 blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Soft blue watercolor splash */}
        <div className="absolute top-[20%] -right-40 w-[600px] h-[600px] rounded-full bg-sky-200/35 blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '16s' }} />
        
        {/* Tender green watercolor spot (new vegetative accent) */}
        <div className="absolute bottom-[20%] -left-48 w-[450px] h-[450px] rounded-full bg-emerald-100/25 blur-[90px] mix-blend-multiply animate-pulse" style={{ animationDuration: '14s' }} />
        
        {/* Tender yellow follicle light spot */}
        <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] rounded-full bg-yellow-100/35 blur-[100px] mix-blend-multiply" />
      </div>

      {/* ================= FLOATING DECORATIVE SVG CAMELLIA FLOWERS ================= */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Floating Camellia 1 - Top Right */}
        <div className="absolute top-8 right-[5%] w-12 h-12 opacity-40 hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            {/* Five round white petals */}
            <circle cx="50" cy="32" r="22" fill="white" />
            <circle cx="32" cy="55" r="22" fill="white" />
            <circle cx="68" cy="55" r="22" fill="white" />
            <circle cx="41" cy="74" r="22" fill="white" />
            <circle cx="59" cy="74" r="22" fill="white" />
            {/* Center pistil / light yellow follicles dot style */}
            <circle cx="50" cy="55" r="13" fill="#FCE4B3" />
            <circle cx="48" cy="53" r="3" fill="#EFA93B" />
            <circle cx="53" cy="57" r="2" fill="#EFA93B" />
            <circle cx="52" cy="51" r="2" fill="#EFA93B" />
          </svg>
        </div>

        {/* Floating Camellia 2 - Bottom Left */}
        <div className="absolute bottom-20 left-[4%] w-10 h-10 opacity-30 hover:opacity-75 transition-opacity">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            <circle cx="50" cy="32" r="22" fill="white" />
            <circle cx="32" cy="55" r="22" fill="white" />
            <circle cx="68" cy="55" r="22" fill="white" />
            <circle cx="41" cy="74" r="22" fill="white" />
            <circle cx="59" cy="74" r="22" fill="white" />
            <circle cx="50" cy="55" r="12" fill="#FCE4B3" />
            <circle cx="49" cy="54" r="2.5" fill="#EFA93B" />
          </svg>
        </div>

        {/* Delicate leaf sprig - Mid Right */}
        <div className="absolute top-[40%] right-[3%] opacity-20 hover:opacity-50 transition-opacity rotate-45">
          <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 50 C20 40, 10 30, 5 25 C15 25, 20 35, 20 45" fill="#88D49E" />
            <path d="M20 45 C20 35, 30 25, 35 20 C25 20, 20 30, 20 40" fill="#88D49E" />
            <path d="M20 30 C20 20, 12 12, 8 8 C16 8, 20 16, 20 25" fill="#A8E6CF" />
            <line x1="20" y1="55" x2="20" y2="10" stroke="#88D49E" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ================= MAIN INTERFACE WRAPPER ================= */}
      <div className="relative z-20 w-full min-h-screen flex flex-col justify-between">
        
        {/* Dynamic Nav Header */}
        <header className="w-full max-w-4xl mx-auto px-4 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#782828] to-rose-700 text-white flex items-center justify-center font-serif font-bold text-sm shadow">
              P
            </div>
            <span className="font-serif font-bold text-sm text-[#782828] tracking-wider">
              PCOS 知情辅助
            </span>
          </div>

          <div className="text-xs text-gray-400 font-sans flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Rotterdam 国际辅助评估</span>
          </div>
        </header>

        {/* Dynamic Screen Mounting */}
        <main className="flex-grow flex items-center justify-center">
          {screen === "HUB" && (
            <ScienceHub 
              onStart={handleStartQuestionnaire} 
              bgImageUrl={bgImage} 
            />
          )}

          {screen === "QUESTIONNAIRE" && (
            <Questionnaire 
              onComplete={handleCompleteQuestionnaire} 
              onGoBackHome={handleReset} 
            />
          )}

          {screen === "RESULT" && answers && (
            <ResultBoard 
              answers={answers} 
              onReset={handleReset} 
            />
          )}
        </main>

        {/* Footer */}
        <footer className="w-full text-center py-6 text-[11px] text-gray-400 font-sans border-t border-[#D9C3B0]/20 print:hidden mt-8">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© 2026 PCOS 治疗知情决策辅助手册</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-gray-600 transition-colors cursor-pointer">科学常识</span>
              <span>·</span>
              <span className="hover:text-gray-600 transition-colors cursor-pointer">关于鹿特丹标准</span>
              <span>·</span>
              <span className="hover:text-gray-600 transition-colors cursor-pointer" onClick={handleReset}>返回首页</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

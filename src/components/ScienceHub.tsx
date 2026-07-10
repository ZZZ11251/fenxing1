/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { scienceMyths } from "../data";
import { BookOpen, Sparkles, HelpCircle, CheckCircle, ArrowRight, Activity, Calendar } from "lucide-react";

interface ScienceHubProps {
  onStart: () => void;
  bgImageUrl: string;
}

export default function ScienceHub({ onStart, bgImageUrl }: ScienceHubProps) {
  const [activeMythId, setActiveMythId] = useState<string | null>("myth1");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12 mt-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4 border border-emerald-100/50 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>关爱卵巢健康 · 科学理性调理</span>
        </div>
        
        <h1 
          id="app-main-title"
          className="font-serif font-bold text-[#782828] leading-tight text-3xl md:text-5xl lg:text-6xl tracking-tight mb-4"
        >
          PCOS 治疗知情决策辅助系统
        </h1>
        
        <p className="font-sans text-[#333333]/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4">
          多囊卵巢综合征（PCOS）是一种常见的内分泌代谢紊乱状态。
          我们基于国际权威的 <span className="bg-[#FCF3CF] px-1.5 py-0.5 rounded text-[#782828] font-medium">鹿特丹诊断标准</span>（Rotterdam Criteria）
          开发了这套系统，旨在帮助您科学筛查分型，消除认知误区，并为您提供定制化的营养膳食、科学运动与针对性的备孕/管理决策。
        </p>
      </motion.div>

      {/* Main Grid: Uterus Art Cover Card & Science Myths */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-10">
        
        {/* Left Side: Art Cover & Intro */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-5 flex flex-col rounded-3xl overflow-hidden border border-[#D9C3B0]/60 shadow-lg bg-white/70 backdrop-blur-md relative group p-6 justify-between min-h-[400px] md:min-h-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-100/30 to-sky-100/30 -z-10" />
          
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner border border-[#D9C3B0]/30">
            <img
              src={bgImageUrl}
              alt="PCOS Treatment Informed Decision-Aid Manual Background"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-4">
            <h3 className="font-serif font-bold text-[#782828] text-base md:text-lg mb-1 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full inline-block"></span>
              什么是鹿特丹标准？
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#333333] leading-relaxed">
              排除其他病因后，满足以下三项中的<strong className="text-[#782828] bg-[#FCF3CF] px-1 rounded">任意两项</strong>即可诊断PCOS：
              <span className="block mt-1 font-medium text-[#782828]">1. 高雄激素表现 / 2. 排卵障碍 / 3. 卵巢多囊样改变</span>
            </p>
          </div>
        </motion.div>

        {/* Right Side: Interactive Myth-Busters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-7 flex flex-col justify-between"
        >
          <div className="rounded-3xl border border-[#D9C3B0]/60 p-6 bg-white/70 backdrop-blur-md relative h-full flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/20 to-pink-50/20 -z-10" />
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                <h2 className="font-serif font-bold text-lg md:text-xl text-[#782828]">
                  PCOS 核心科普与误区纠偏
                </h2>
              </div>
              
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {scienceMyths.map((item) => {
                  const isActive = activeMythId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveMythId(isActive ? null : item.id)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-pink-50/80 to-sky-50/80 border-pink-200/60 shadow-sm"
                          : "bg-white/40 border-gray-100 hover:bg-white/90 hover:border-pink-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-sans font-medium text-xs md:text-sm transition-colors ${isActive ? "text-[#782828] font-semibold" : "text-[#333333]"}`}>
                          {item.myth}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#782828] text-white" : "bg-gray-100 text-gray-400"}`}>
                          {isActive ? "折叠" : "查看"}
                        </span>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-dashed border-[#D9C3B0]/40 text-xs md:text-sm text-[#333333] space-y-2"
                        >
                          <div className="flex items-start gap-1.5 text-emerald-700 font-semibold">
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{item.truth}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed font-sans pl-5 text-xs md:text-sm">
                            {item.explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro Annotation in the bottom */}
            <div className="mt-4 p-3 bg-yellow-50/30 rounded-xl border border-yellow-100/50 text-[11px] text-gray-500 leading-relaxed flex gap-2">
              <span className="text-yellow-600">💡</span>
              <span>点击上面任意卡片，可展开/折叠对该误区的专业纠偏解释。PCOS不是洪水猛兽，科学生活管理能够轻松改善。</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Button Action Page Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col items-center gap-3 mt-4"
      >
        <button
          id="btn-start-evaluation"
          onClick={onStart}
          className="group relative flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#782828] text-white font-serif font-semibold text-lg shadow-lg hover:bg-[#612020] hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer"
        >
          {/* Subtle hover splash decoration inside button */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-300/10 to-sky-300/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>开始我的分型评估</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
        
        <p className="font-sans text-[11px] text-gray-400 text-center flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-pink-300" />
          全程大约需要回答 6 个问题 · 诊断结果基于鹿特丹诊断标准及个人代谢谱
        </p>
      </motion.div>
    </div>
  );
}

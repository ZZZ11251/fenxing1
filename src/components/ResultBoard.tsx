/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { UserAnswers, PcosType, MetabolicType, DiagnosticResult } from "../types";
import { typeExplanations, metabolicExplanations, concernExplanations } from "../data";
import { 
  Heart, Calendar, Activity, CheckCircle, XCircle, RotateCcw, 
  BookOpen, Compass, Download, Award, Share2, Clipboard, ChevronDown, Sparkles
} from "lucide-react";

interface ResultBoardProps {
  answers: UserAnswers;
  onReset: () => void;
}

export default function ResultBoard({ answers, onReset }: ResultBoardProps) {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    // 1. Calculate Rotterdam Criteria
    const hasHyperandrogenism = answers.hyperandrogenSymptoms.length > 0 && !answers.hyperandrogenSymptoms.includes("NONE");
    const hasOvulatoryDysfunction = answers.ovulatorySymptoms.length > 0 && !answers.ovulatorySymptoms.includes("NONE");
    const hasPcom = answers.pcomSymptoms.length > 0 && !answers.pcomSymptoms.includes("NONE");

    // 2. Determine PCOS Type
    let pcosType = PcosType.NONE;
    const criteriaCount = [hasHyperandrogenism, hasOvulatoryDysfunction, hasPcom].filter(Boolean).length;

    if (criteriaCount >= 2) {
      if (hasHyperandrogenism && hasOvulatoryDysfunction && hasPcom) {
        pcosType = PcosType.A;
      } else if (hasHyperandrogenism && hasOvulatoryDysfunction && !hasPcom) {
        pcosType = PcosType.B;
      } else if (hasHyperandrogenism && !hasOvulatoryDysfunction && hasPcom) {
        pcosType = PcosType.C;
      } else if (!hasHyperandrogenism && hasOvulatoryDysfunction && hasPcom) {
        pcosType = PcosType.D;
      }
    }

    // 3. Calculate BMI & Determine Obese Status
    let bmi = 0;
    let isObese = false;

    if (answers.height > 100 && answers.weight > 30) {
      bmi = parseFloat((answers.weight / ((answers.height / 100) * (answers.height / 100))).toFixed(1));
      isObese = bmi >= 24;
    } else {
      isObese = answers.bmiManual === "OBESE";
      bmi = isObese ? 24.5 : 21.0; // Fallback typical BMIs for display
    }

    // 4. Determine Metabolic Subtype
    let metabolicType = MetabolicType.NO_OB_NO_IR;
    if (isObese && answers.hasInsulinResistance) {
      metabolicType = MetabolicType.OB_IR;
    } else if (isObese && !answers.hasInsulinResistance) {
      metabolicType = MetabolicType.OB_NO_IR;
    } else if (!isObese && answers.hasInsulinResistance) {
      metabolicType = MetabolicType.NO_OB_IR;
    } else {
      metabolicType = MetabolicType.NO_OB_NO_IR;
    }

    // 5. Build Result Object
    const currentResult: DiagnosticResult = {
      pcosType,
      metabolicType,
      primaryConcern: answers.primaryConcern,
      bmi,
      isObese,
      hasHyperandrogenism,
      hasOvulatoryDysfunction,
      hasPcom,
      timestamp: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
    };

    setResult(currentResult);

    // 6. Persist to LocalStorage History
    try {
      const saved = localStorage.getItem("pcos_diag_history");
      const prevList: DiagnosticResult[] = saved ? JSON.parse(saved) : [];
      
      // Limit list to last 5 results to save space
      const updatedList = [currentResult, ...prevList].slice(0, 5);
      localStorage.setItem("pcos_diag_history", JSON.stringify(updatedList));
      setHistory(updatedList);
    } catch (e) {
      console.warn("Could not access localStorage history", e);
    }
  }, [answers]);

  // Handle printing/saving the report
  const handlePrint = () => {
    window.print();
  };

  if (!result) return null;

  const typeInfo = typeExplanations[result.pcosType];
  const metabolicInfo = metabolicExplanations[result.metabolicType];
  const concernInfo = concernExplanations[result.primaryConcern];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 print:p-0">
      
      {/* Printable Report Header */}
      <div className="hidden print:block text-center space-y-2 border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold font-serif text-[#782828]">PCOS分型及生活方式干预报告书</h1>
        <p className="text-xs text-gray-500">检测时间：{result.timestamp} | Rotterdam诊断标准评估</p>
      </div>

      {/* Hero Diagnostic Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-[#D9C3B0]/60 p-6 md:p-8 bg-gradient-to-br from-pink-50/50 via-white to-sky-50/50 shadow-md relative overflow-hidden"
      >
        {/* Decorative corner flora */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Heart className="w-40 h-40 text-pink-300 rotate-12" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
          
          {/* Main Grade / Circle */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-[#782828] to-rose-900 text-white flex flex-col items-center justify-center shadow-lg border-4 border-white">
              <span className="font-serif font-bold text-3xl md:text-4xl">{result.pcosType === PcosType.NONE ? "不典型" : `${result.pcosType}型`}</span>
              {result.pcosType !== PcosType.NONE && <span className="text-[10px] opacity-80 mt-0.5">PCOS分型</span>}
            </div>
            
            <div className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#782828]">
                  {typeInfo.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                  精细化评估
                </span>
              </div>
              <p className="font-sans text-[#333333] text-sm font-medium">
                {typeInfo.shortDesc}
              </p>
              <p className="text-xs text-gray-400 font-mono">
                报告生成时间：{result.timestamp}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 print:hidden shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>保存/打印报告</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#782828] text-white text-xs font-semibold hover:bg-[#612020] hover:scale-[1.02] transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新评估</span>
            </button>
          </div>
        </div>

        {/* Divider and Detailed Text */}
        <div className="mt-6 pt-5 border-t border-[#D9C3B0]/30 text-left">
          <p className="font-sans text-[#333333] text-sm leading-relaxed">
            {typeInfo.detail}
          </p>
        </div>
      </motion.div>

      {/* Grid: Rotterdam Criteria Check & Metabolic Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Card: Rotterdam Criteria Validation */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-[#D9C3B0]/60 p-6 bg-white/70 backdrop-blur-md text-left flex flex-col justify-between"
        >
          <div>
            <h3 className="font-serif font-bold text-lg text-[#782828] mb-1.5 flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-pink-400" />
              鹿特丹诊断标准对齐情况
            </h3>
            <p className="text-xs text-gray-400 font-sans mb-5">
              根据您的勾选指征，符合以下三项特征中的至少两项，即临床确诊为PCOS
            </p>

            <div className="space-y-4">
              {[
                { 
                  label: "高雄激素表现 (睾酮高/痤疮/多毛/发缝宽)", 
                  status: result.hasHyperandrogenism,
                  desc: answers.hyperandrogenSymptoms.includes("NONE") ? "无明显临床/生化表现" : `符合 ${answers.hyperandrogenSymptoms.length} 项典型特征`
                },
                { 
                  label: "排卵/月经障碍 (稀发/周期延长/靠药催经)", 
                  status: result.hasOvulatoryDysfunction,
                  desc: answers.ovulatorySymptoms.includes("NONE") ? "无明显临床表现" : `符合 ${answers.ovulatorySymptoms.length} 项典型特征`
                },
                { 
                  label: "卵巢多囊样改变 (PCOM/小卵泡数多)", 
                  status: result.hasPcom,
                  desc: answers.pcomSymptoms.includes("NONE") ? "形态正常或未提供数据" : "妇科超声诊断符合"
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                    item.status 
                      ? "bg-pink-50/20 border-pink-100" 
                      : "bg-gray-50/30 border-gray-100 opacity-70"
                  }`}
                >
                  {item.status ? (
                    <CheckCircle className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-sans font-semibold text-xs md:text-sm text-gray-800 block">
                      {item.label}
                    </span>
                    <span className="font-sans text-xs text-gray-500 block mt-0.5">
                      检测状态: <strong className={item.status ? "text-[#782828]" : "text-gray-400"}>{item.status ? "【符合】" : "【未符合/未评估】"}</strong> {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-yellow-50/40 border border-yellow-100 text-xs text-gray-500 leading-relaxed">
            <strong>医学评定结论：</strong>
            {result.pcosType === PcosType.NONE ? (
              <span>您仅符合 1 项或 0 项特征，临床上<span className="bg-[#FCF3CF] px-1 font-semibold text-[#782828] rounded">未达到典型PCOS</span>诊断门槛。继续注意健康作息观察即可。</span>
            ) : (
              <span>您符合其中 { [result.hasHyperandrogenism, result.hasOvulatoryDysfunction, result.hasPcom].filter(Boolean).length } 项，临床符合<span className="bg-[#FCF3CF] px-1 font-semibold text-[#782828] rounded">{result.pcosType}型多囊卵巢综合征</span>，建议遵医嘱规范调理。</span>
            )}
          </div>
        </motion.div>

        {/* Right Card: Metabolic Subtype & Health Profile */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-[#D9C3B0]/60 p-6 bg-white/70 backdrop-blur-md text-left flex flex-col justify-between"
        >
          <div>
            <h3 className="font-serif font-bold text-lg text-[#782828] mb-1.5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              代谢表型与个人健康画像
            </h3>
            <p className="text-xs text-gray-400 font-sans mb-4">
              结合您的体重指数(BMI)和胰岛素抵抗试验情况得出的精准亚型
            </p>

            {/* Profile items badges */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#FCF8F2] border border-[#D9C3B0]/30">
                <span className="text-[10px] text-gray-400 block font-sans">我的 BMI 水平</span>
                <span className="font-serif font-bold text-[#782828] text-lg block">{result.bmi}</span>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold mt-1 ${result.isObese ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {result.isObese ? "肥胖/偏重 (≥24)" : "正常/偏瘦 (<24)"}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FCF8F2] border border-[#D9C3B0]/30">
                <span className="text-[10px] text-gray-400 block font-sans">胰岛素抵抗情况</span>
                <span className="font-serif font-bold text-[#782828] text-base block mt-0.5 truncate">
                  {answers.hasInsulinResistance ? "存在异常" : "未见异常"}
                </span>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold mt-1.5 ${answers.hasInsulinResistance ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {answers.hasInsulinResistance ? "胰岛素敏感度下降" : "糖代谢指标良"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/40 to-sky-50/40 border border-emerald-100">
              <span className="font-serif font-bold text-[#782828] text-sm block mb-1">
                代谢亚型评估：{metabolicInfo.name}
              </span>
              <p className="text-xs text-[#333333]/90 leading-relaxed font-sans">
                {metabolicInfo.detail}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-[#D9C3B0]/30 text-xs text-gray-400 font-sans flex items-center justify-between">
            <span>代谢调理在多囊干预中权重占比达 70%</span>
            <span className="text-emerald-700 font-medium font-sans">基础策略 ▽</span>
          </div>
        </motion.div>

      </div>

      {/* Type Specific Guidance Goals */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl border border-[#D9C3B0]/60 p-6 md:p-8 bg-white/70 backdrop-blur-md text-left"
      >
        <h3 className="font-serif font-bold text-lg text-[#782828] mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-rose-500" />
          您的第一阶段医学干预核心目标
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {typeInfo.primaryGoals.map((goal, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-[#FCF8F2] to-white border border-[#D9C3B0]/30 relative">
              <div className="absolute top-3 right-3 text-xs font-serif font-bold text-[#782828]/20 text-3xl select-none">
                {idx + 1}
              </div>
              <span className="font-sans font-semibold text-xs text-[#782828] block mb-1">
                核心目标 {idx + 1}
              </span>
              <p className="text-xs text-gray-600 font-sans leading-relaxed pr-6">
                {goal}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Nutrition Plan & Customized Daily Recipe */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 7 Columns: Personalized Low-GI Recipe Plan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="md:col-span-7 rounded-3xl border border-[#D9C3B0]/60 p-6 bg-white/70 backdrop-blur-md text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-lg text-[#782828]">
                一日定制低GI科学营养食谱
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-sans mb-5">
              根据您的【{metabolicInfo.name}】身体特质定制，控制升糖负荷，保护胰岛和卵巢
            </p>

            <div className="space-y-3.5">
              {[
                { title: "🌅 晨起早餐", content: metabolicInfo.recipe.breakfast },
                { title: "☀️ 活力午餐", content: metabolicInfo.recipe.lunch },
                { title: "🌙 轻盈晚餐", content: metabolicInfo.recipe.dinner },
                { title: "🍎 科学加餐", content: metabolicInfo.recipe.snack }
              ].map((recipeItem, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-[#D9C3B0]/20 bg-white/50 hover:bg-white/95 transition-all">
                  <span className="font-serif font-semibold text-xs text-[#782828] block mb-0.5">
                    {recipeItem.title}
                  </span>
                  <p className="text-xs text-gray-600 font-sans leading-relaxed">
                    {recipeItem.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/50 text-[11px] text-emerald-800 leading-relaxed font-sans">
            💬 <strong>食谱原则：</strong>优先摄入高膳食纤维蔬菜，其次优质蛋白质，最后吃粗粮主食。这种进餐顺序能最大化延缓血糖峰值，减少餐后胰岛素过度分泌。
          </div>
        </motion.div>

        {/* Right 5 Columns: Lifestyle & Exercise Advice */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="md:col-span-5 rounded-3xl border border-[#D9C3B0]/60 p-6 bg-white/70 backdrop-blur-md text-left flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-sky-500" />
              <h3 className="font-serif font-bold text-lg text-[#782828]">
                膳食膳补充与运动指南
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-sans mb-4">
              科学膳食是第一要素，运动则是重塑激素的物理手段
            </p>

            <div className="space-y-4">
              <div>
                <span className="font-serif font-semibold text-xs text-[#782828] block mb-1.5">
                  🥑 精细化膳食建议
                </span>
                <ul className="space-y-1.5">
                  {metabolicInfo.dietAdvice.slice(0, 3).map((adviceText, index) => (
                    <li key={index} className="text-xs text-gray-600 leading-relaxed flex items-start gap-1 font-sans">
                      <span className="text-[#782828] shrink-0 font-bold">•</span>
                      <span>{adviceText}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-dashed border-[#D9C3B0]/20">
                <span className="font-serif font-semibold text-xs text-[#782828] block mb-1.5">
                  🏃‍♀️ 靶向力量与有氧运动
                </span>
                <ul className="space-y-1.5">
                  {metabolicInfo.exerciseAdvice.slice(0, 3).map((adviceText, index) => (
                    <li key={index} className="text-xs text-gray-600 leading-relaxed flex items-start gap-1 font-sans">
                      <span className="text-emerald-600 shrink-0 font-bold">•</span>
                      <span>{adviceText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-pink-50/30 border border-pink-100/50 text-[10px] text-gray-500 leading-relaxed">
            * <strong>瘦型多囊建议：</strong>侧重于改善皮质醇节律，避免过长高耗能运动导致闭经。<strong>胖型多囊建议：</strong>在阻力训练后加入20分钟有氧减脂效果更佳。
          </div>
        </motion.div>
      </div>

      {/* Primary Concern Actions Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-3xl border border-[#D9C3B0]/60 p-6 md:p-8 bg-gradient-to-tr from-pink-50/10 via-sky-50/10 to-white/80 backdrop-blur-md text-left"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
          <h3 className="font-serif font-bold text-lg md:text-xl text-[#782828]">
            {concernInfo.title}
          </h3>
        </div>

        <div className="space-y-4">
          {concernInfo.advice.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-[#782828] text-white flex items-center justify-center text-[10px] font-bold font-serif shrink-0 mt-0.5 shadow-sm">
                {idx + 1}
              </span>
              <p className="text-xs md:text-sm text-[#333333] leading-relaxed font-sans">
                {item}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Local History Display */}
      <div className="print:hidden rounded-3xl border border-[#D9C3B0]/60 p-6 bg-white/75 backdrop-blur-md text-left">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between font-serif font-bold text-base text-[#782828] cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#782828]" />
            评估历史记录 ({history.length} 次)
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? "rotate-180" : ""}`} />
        </button>

        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 pt-4 border-t border-dashed border-[#D9C3B0]/30 space-y-3 overflow-hidden"
          >
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 font-sans text-center py-4">暂无历史记录</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {history.map((hist, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl border border-gray-100 bg-white/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-serif font-bold text-[#782828] block">
                        {hist.pcosType === PcosType.NONE ? "不典型或未达典型标准" : `${hist.pcosType}型多囊卵巢综合征`}
                      </span>
                      <span className="text-[10px] text-gray-400 font-sans block mt-0.5">
                        评估时间：{hist.timestamp} | BMI: {hist.bmi}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-100/50 font-semibold">
                        {hist.metabolicType.includes("IR") ? "胰岛素抵抗" : "糖代谢正常"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Disclaimer details below footer */}
      <div className="text-center text-[10px] text-gray-400 leading-relaxed max-w-2xl mx-auto py-4 font-sans">
        <strong>免责声明：</strong>本分型及调理报告数据来源于国际鹿特丹标准及流行病学统计计算，旨在作为患者健康知情决策辅助，不构成任何临床处方与医疗诊断。具体的病情评定、处方药服用（如达英-35、二甲双胍等避孕药及降糖药）请严格遵照线下三甲医院妇科内分泌或生殖医学科执业医生的医嘱进行。
      </div>

    </div>
  );
}

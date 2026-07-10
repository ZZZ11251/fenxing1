/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserAnswers, PrimaryConcern } from "../types";
import { ArrowLeft, ArrowRight, HelpCircle, Activity, Heart, ChevronRight, Scale, Info } from "lucide-react";

interface QuestionnaireProps {
  onComplete: (answers: UserAnswers) => void;
  onGoBackHome: () => void;
}

export default function Questionnaire({ onComplete, onGoBackHome }: QuestionnaireProps) {
  const [step, setStep] = useState<number>(1);
  
  // Initialize user answers state
  const [hyperandrogenSymptoms, setHyperandrogenSymptoms] = useState<string[]>([]);
  const [ovulatorySymptoms, setOvulatorySymptoms] = useState<string[]>([]);
  const [pcomSymptoms, setPcomSymptoms] = useState<string[]>([]);
  
  // Height & Weight for auto-calculating BMI
  const [heightStr, setHeightStr] = useState<string>("");
  const [weightStr, setWeightStr] = useState<string>("");
  const [bmiManual, setBmiManual] = useState<"OBESE" | "NORMAL" | null>(null);
  
  // Metabolic State
  const [hasInsulinResistance, setHasInsulinResistance] = useState<boolean | null>(null);
  
  // Core Concern
  const [primaryConcern, setPrimaryConcern] = useState<PrimaryConcern | null>(null);

  // Auto calculated BMI
  const [calculatedBmi, setCalculatedBmi] = useState<number | null>(null);

  useEffect(() => {
    const h = parseFloat(heightStr);
    const w = parseFloat(weightStr);
    if (h > 100 && h < 250 && w > 30 && w < 200) {
      const bmi = w / ((h / 100) * (h / 100));
      setCalculatedBmi(parseFloat(bmi.toFixed(1)));
      setBmiManual(null); // Reset manual choice if auto works
    } else {
      setCalculatedBmi(null);
    }
  }, [heightStr, weightStr]);

  const handleNext = () => {
    if (step < 6) {
      setStep(prev => prev + 1);
    } else {
      // Build final answer state and submit
      const heightVal = parseFloat(heightStr) || 0;
      const weightVal = parseFloat(weightStr) || 0;
      
      onComplete({
        hyperandrogenSymptoms,
        ovulatorySymptoms,
        pcomSymptoms,
        height: heightVal,
        weight: weightVal,
        bmiManual,
        hasInsulinResistance: !!hasInsulinResistance,
        primaryConcern: primaryConcern || "WELLNESS_TRACK",
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onGoBackHome();
    }
  };

  // Toggle multi-select checklist items
  const toggleSelection = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    noneValue: string = "NONE"
  ) => {
    if (item === noneValue) {
      setList(list.includes(noneValue) ? [] : [noneValue]);
    } else {
      let newList = list.filter(x => x !== noneValue);
      if (newList.includes(item)) {
        newList = newList.filter(x => x !== item);
      } else {
        newList.push(item);
      }
      setList(newList);
    }
  };

  // Validate if current step is ready for "Next"
  const isStepValid = (): boolean => {
    if (step === 1) return hyperandrogenSymptoms.length > 0;
    if (step === 2) return ovulatorySymptoms.length > 0;
    if (step === 3) return pcomSymptoms.length > 0;
    if (step === 4) {
      return calculatedBmi !== null || bmiManual !== null;
    }
    if (step === 5) return hasInsulinResistance !== null;
    if (step === 6) return primaryConcern !== null;
    return false;
  };

  // Helper info definitions for each checklist step to render as rounded callouts
  const stepInfo: Record<number, { title: string; content: string }> = {
    1: {
      title: "关于雄激素偏高",
      content: "雄激素偏高不仅影响毛囊与皮脂腺导致痘痘、体毛，还会影响卵泡发育。有些患者没有明显外在体征，但抽血化验可能会发现睾酮(T)偏高。"
    },
    2: {
      title: "关于排卵障碍",
      content: "月经不调是排卵异常的主要外在表现。卵巢长期不排卵，子宫内膜没有孕激素规律撤退，可能会导致内膜增生，因此维持周期十分重要。"
    },
    3: {
      title: "关于多囊样改变",
      content: "多囊样改变（PCOM）是指超声下卵巢里有很多没有发育成熟的卵泡（≥12个）。它并不是卵巢长了‘肿瘤’或‘囊肿’，请勿过度担心。"
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-10 flex flex-col justify-between min-h-[580px] md:min-h-[640px]">
      
      {/* Header with Navigation and Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#782828] transition-colors cursor-pointer p-1 rounded-lg hover:bg-pink-50/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回{step === 1 ? "科普页" : "上一题"}</span>
          </button>
          
          <span className="font-serif text-xs md:text-sm font-semibold text-[#782828] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100/50">
            评估进度 {step} / 6
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-300 to-[#782828]"
            initial={{ width: "16.6%" }}
            animate={{ width: `${(step / 6) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Questionnaire Box */}
      <div className="flex-grow flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-[#D9C3B0]/60 p-6 md:p-8 bg-white/75 backdrop-blur-md relative shadow-md flex flex-col justify-between min-h-[380px] md:min-h-[420px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/10 to-sky-50/20 rounded-3xl -z-10" />

            <div>
              {/* Question Titles */}
              <div className="mb-6">
                {step === 1 && (
                  <>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-[#782828] mb-1">
                      1. 您是否有以下“高雄激素”相关情况？
                    </h2>
                    <p className="text-xs text-gray-400 font-sans">
                      符合以下任何一项即代表可能存在高雄倾向（可多选）
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-[#782828] mb-1">
                      2. 您的“排卵及月经周期”是否有以下表现？
                    </h2>
                    <p className="text-xs text-gray-400 font-sans">
                      排卵异常常伴随月经周期的改变（可多选）
                    </p>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-[#782828] mb-1">
                      3. 您的“妇科B超”卵巢有何改变？
                    </h2>
                    <p className="text-xs text-gray-400 font-sans">
                      如果您未做B超，可直接选择“以上皆无/未做B超”（可多选）
                    </p>
                  </>
                )}
                {step === 4 && (
                  <>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-[#782828] mb-1">
                      4. 您的体重和血糖（BMI）指标如何？
                    </h2>
                    <p className="text-xs text-gray-400 font-sans">
                      请输入身高体重自动计算，或在下方直接选择区间
                    </p>
                  </>
                )}
                {step === 5 && (
                  <>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-[#782828] mb-1">
                      5. 您是否有“胰岛素抵抗”或“高胰岛素血症”？
                    </h2>
                    <p className="text-xs text-gray-400 font-sans">
                      通常通过抽血作糖耐量试验和胰岛素释放试验（OGTT）确诊
                    </p>
                  </>
                )}
                {step === 6 && (
                  <>
                    <h2 className="font-serif font-bold text-xl md:text-2xl text-[#782828] mb-1">
                      6. 您目前最关心的医学或调理诉求是什么？
                    </h2>
                    <p className="text-xs text-gray-400 font-sans">
                      我们将根据您的当前诉求为您制定专属的日常调理和就诊建议
                    </p>
                  </>
                )}
              </div>

              {/* Question Interactive Options */}
              <div className="mb-6">
                
                {/* STEP 1: Hyperandrogenism Checklist */}
                {step === 1 && (
                  <div className="space-y-3">
                    {[
                      { value: "BLOOD", label: "抽血高指标", desc: "抽血单上“睾酮(T)”或“游离睾酮(FT)”有上升箭头 ↑，或确诊“雄激素偏高”" },
                      { value: "ACNE", label: "反复顽固痤疮", desc: "常年长顽固痘痘（多在下巴、下颌线、后背），常规祛痘软膏作用差" },
                      { value: "HAIR", label: "多毛现象", desc: "上唇（小胡须）、乳晕周围、肚脐下方长有明显黑色、粗硬的长体毛" },
                      { value: "BALD", label: "头顶发缝变宽", desc: "近半年头顶发缝明显变宽、头发变细软稀疏（注意：非发际线后退）" }
                    ].map(opt => {
                      const selected = hyperandrogenSymptoms.includes(opt.value);
                      return (
                        <div
                          key={opt.value}
                          onClick={() => toggleSelection(opt.value, hyperandrogenSymptoms, setHyperandrogenSymptoms)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                            selected 
                              ? "bg-pink-50/50 border-pink-300 shadow-sm" 
                              : "bg-white/40 border-gray-100 hover:bg-white/80 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            readOnly
                            className="mt-1 accent-[#782828]"
                          />
                          <div className="text-left">
                            <span className="font-sans font-medium text-sm text-gray-800">{opt.label}</span>
                            <span className="block text-xs text-gray-500 font-sans mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* None Option */}
                    <div
                      onClick={() => toggleSelection("NONE", hyperandrogenSymptoms, setHyperandrogenSymptoms)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        hyperandrogenSymptoms.includes("NONE") 
                          ? "bg-emerald-50/40 border-emerald-300 shadow-sm" 
                          : "bg-white/40 border-gray-100 hover:bg-white/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={hyperandrogenSymptoms.includes("NONE")}
                        readOnly
                        className="accent-emerald-600"
                      />
                      <span className="font-sans text-sm font-medium text-emerald-800">以上症状及化验单异常皆无</span>
                    </div>
                  </div>
                )}

                {/* STEP 2: Ovulatory Checklist */}
                {step === 2 && (
                  <div className="space-y-3">
                    {[
                      { value: "IRREGULAR", label: "月经周期极不规律", desc: "周期无规律性。这次30天，下一次50天，再下一次可能三个月" },
                      { value: "LONG", label: "周期偏长（＞35天）", desc: "经常超过35天甚至长达2、3个月才来一次月经" },
                      { value: "FEW", label: "一年月经次数少于8次", desc: "月经极其稀发，往往需要掰着指头数周期" },
                      { value: "DRUG", label: "常需服药催经/维持", desc: "需要靠吃黄体酮诱导月经撤退，或长期口服短效避孕药调理月经" }
                    ].map(opt => {
                      const selected = ovulatorySymptoms.includes(opt.value);
                      return (
                        <div
                          key={opt.value}
                          onClick={() => toggleSelection(opt.value, ovulatorySymptoms, setOvulatorySymptoms)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                            selected 
                              ? "bg-pink-50/50 border-pink-300 shadow-sm" 
                              : "bg-white/40 border-gray-100 hover:bg-white/80 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            readOnly
                            className="mt-1 accent-[#782828]"
                          />
                          <div className="text-left">
                            <span className="font-sans font-medium text-sm text-gray-800">{opt.label}</span>
                            <span className="block text-xs text-gray-500 font-sans mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* None Option */}
                    <div
                      onClick={() => toggleSelection("NONE", ovulatorySymptoms, setOvulatorySymptoms)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        ovulatorySymptoms.includes("NONE") 
                          ? "bg-emerald-50/40 border-emerald-300 shadow-sm" 
                          : "bg-white/40 border-gray-100 hover:bg-white/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={ovulatorySymptoms.includes("NONE")}
                        readOnly
                        className="accent-emerald-600"
                      />
                      <span className="font-sans text-sm font-medium text-emerald-800">月经周期极其规律且排卵正常（以上皆无）</span>
                    </div>
                  </div>
                )}

                {/* STEP 3: PCOM (B ultrasound) */}
                {step === 3 && (
                  <div className="space-y-3">
                    {[
                      { value: "DIAGNOSED", label: "B超明确提示“多囊样改变”", desc: "妇科B超/彩超报告结论一栏明确写有“双侧/单侧卵巢多囊样改变”或“PCOM”" },
                      { value: "FOLLICLES", label: "单侧或双侧小卵泡数量较多（≥12或20个）", desc: "彩超单上描写：卵巢可见多个小卵泡，或单侧卵泡数 ≥12 个（部分采用新标则提示可见20个以上）" }
                    ].map(opt => {
                      const selected = pcomSymptoms.includes(opt.value);
                      return (
                        <div
                          key={opt.value}
                          onClick={() => toggleSelection(opt.value, pcomSymptoms, setPcomSymptoms)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                            selected 
                              ? "bg-pink-50/50 border-pink-300 shadow-sm" 
                              : "bg-white/40 border-gray-100 hover:bg-white/80 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            readOnly
                            className="mt-1 accent-[#782828]"
                          />
                          <div className="text-left">
                            <span className="font-sans font-medium text-sm text-gray-800">{opt.label}</span>
                            <span className="block text-xs text-gray-500 font-sans mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* None Option */}
                    <div
                      onClick={() => toggleSelection("NONE", pcomSymptoms, setPcomSymptoms)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        pcomSymptoms.includes("NONE") 
                          ? "bg-emerald-50/40 border-emerald-300 shadow-sm" 
                          : "bg-white/40 border-gray-100 hover:bg-white/80"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={pcomSymptoms.includes("NONE")}
                        readOnly
                        className="accent-emerald-600"
                      />
                      <span className="font-sans text-sm font-medium text-emerald-800">以上皆无 / 未做B超（卵巢形态正常或未查）</span>
                    </div>
                  </div>
                )}

                {/* STEP 4: BMI Auto Calculator */}
                {step === 4 && (
                  <div className="space-y-4 text-left">
                    {/* Heights and weight Inputs */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FCF8F2] border border-[#D9C3B0]/40">
                      <div>
                        <label className="block text-xs font-semibold text-[#782828] mb-1">
                          身高 Height (cm)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="如 160"
                            value={heightStr}
                            onChange={(e) => setHeightStr(e.target.value)}
                            className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-sans focus:outline-none focus:border-[#782828] text-[#333333]"
                          />
                          <span className="absolute right-3 top-2 text-xs text-gray-400">cm</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#782828] mb-1">
                          体重 Weight (kg)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="如 55"
                            value={weightStr}
                            onChange={(e) => setWeightStr(e.target.value)}
                            className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm font-sans focus:outline-none focus:border-[#782828] text-[#333333]"
                          />
                          <span className="absolute right-3 top-2 text-xs text-gray-400">kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated BMI Display */}
                    {calculatedBmi !== null && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-between p-4 rounded-xl border border-pink-200/50 bg-gradient-to-r from-pink-50/50 to-sky-50/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold">
                            <Scale className="w-5 h-5 text-[#782828]" />
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 block font-sans">自动为您测算 BMI</span>
                            <span className="font-serif font-bold text-lg text-[#782828]">{calculatedBmi}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            calculatedBmi >= 24 
                              ? "bg-amber-100 text-amber-700" 
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {calculatedBmi >= 24 ? "偏重 / 肥胖 (BMI ≥ 24)" : "正常 / 偏瘦 (BMI < 24)"}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Manual Override Choices */}
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-2 font-sans flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        若不想输入身高体重，也可以直接手动选择：
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "NORMAL" as const, label: "正常或偏瘦", desc: "BMI < 24" },
                          { value: "OBESE" as const, label: "偏重或肥胖", desc: "BMI ≥ 24" }
                        ].map(opt => {
                          const isManualSelected = bmiManual === opt.value;
                          const isAutoSelected = calculatedBmi !== null && (
                            (opt.value === "OBESE" && calculatedBmi >= 24) ||
                            (opt.value === "NORMAL" && calculatedBmi < 24)
                          );
                          const active = isManualSelected || isAutoSelected;
                          return (
                            <div
                              key={opt.value}
                              onClick={() => {
                                setBmiManual(opt.value);
                                setHeightStr(""); // Clear inputs when choosing manually
                                setWeightStr("");
                              }}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                active
                                  ? "bg-pink-50/50 border-pink-300 shadow-sm font-semibold"
                                  : "bg-white/40 border-gray-100 hover:bg-white/80"
                              }`}
                            >
                              <span className={`block text-xs font-sans ${active ? "text-[#782828]" : "text-gray-600"}`}>
                                {opt.label}
                              </span>
                              <span className="text-[10px] text-gray-400 block font-mono mt-0.5">{opt.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Insulin Resistance (Single Choice) */}
                {step === 5 && (
                  <div className="space-y-3">
                    {[
                      { value: true, label: "有胰岛素抵抗 / 高胰岛素血症", desc: "糖耐量受损、高胰岛素血症、或医生明确诊断过胰岛素抵抗（黑棘皮征等）" },
                      { value: false, label: "无胰岛素抵抗 / 暂未进行化验", desc: "化验结果在参考范围内，或者目前身体健康从未查过此项" }
                    ].map(opt => {
                      const selected = hasInsulinResistance === opt.value;
                      return (
                        <div
                          key={String(opt.value)}
                          onClick={() => {
                            setHasInsulinResistance(opt.value);
                            // Auto transition for single choice
                            setTimeout(() => {
                              setStep(6);
                            }, 350);
                          }}
                          className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            selected 
                              ? "bg-pink-50/50 border-pink-300 shadow-sm" 
                              : "bg-white/40 border-gray-100 hover:bg-white/80 hover:border-gray-200"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            selected ? "border-[#782828] bg-[#782828]/10" : "border-gray-300"
                          }`}>
                            {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#782828]" />}
                          </div>
                          <div className="text-left">
                            <span className="font-sans font-medium text-sm text-gray-800">{opt.label}</span>
                            <span className="block text-xs text-gray-500 font-sans mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STEP 6: Primary Concern (Single Choice) */}
                {step === 6 && (
                  <div className="space-y-3">
                    {[
                      { value: "PREGNANCY" as const, label: "想尽快怀孕", desc: "处于积极备孕状态，希望能有针对性的促排、卵子调理、受孕建议" },
                      { value: "SYMPTOM_CONTROL" as const, label: "想改善症状，暂不备孕", desc: "希望能调理月经周期、治疗痤疮、改善多毛或通过科学方式控制体脂" },
                      { value: "WELLNESS_TRACK" as const, label: "没什么不舒服，仅体检发现", desc: "目前无明显不适，想获得预防指南及长期内分泌及代谢维稳计划" }
                    ].map(opt => {
                      const selected = primaryConcern === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setPrimaryConcern(opt.value);
                            // Highlight the item and submit
                            setTimeout(() => {
                              const heightVal = parseFloat(heightStr) || 0;
                              const weightVal = parseFloat(weightStr) || 0;
                              onComplete({
                                hyperandrogenSymptoms,
                                ovulatorySymptoms,
                                pcomSymptoms,
                                height: heightVal,
                                weight: weightVal,
                                bmiManual,
                                hasInsulinResistance: !!hasInsulinResistance,
                                primaryConcern: opt.value,
                              });
                            }, 350);
                          }}
                          className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            selected 
                              ? "bg-pink-50/50 border-pink-300 shadow-sm" 
                              : "bg-white/40 border-gray-100 hover:bg-white/80 hover:border-gray-200"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            selected ? "border-[#782828] bg-[#782828]/10" : "border-gray-300"
                          }`}>
                            {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#782828]" />}
                          </div>
                          <div className="text-left">
                            <span className="font-sans font-medium text-sm text-gray-800">{opt.label}</span>
                            <span className="block text-xs text-gray-500 font-sans mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

            {/* Step Sidebar Guide Note Card in Question Area */}
            {step <= 3 && stepInfo[step] && (
              <div className="mt-4 p-4 rounded-2xl bg-white/60 border border-[#D9C3B0]/30 text-left">
                <span className="font-serif font-bold text-xs text-[#782828] flex items-center gap-1.5 mb-1">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  {stepInfo[step].title}
                </span>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  {stepInfo[step].content}
                </p>
              </div>
            )}

            {/* Bottom Actions for Checklist steps / bmi manual entry */}
            {(step <= 4) && (
              <div className="mt-4 pt-4 border-t border-dashed border-[#D9C3B0]/30 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full font-serif font-semibold text-sm shadow-sm transition-all cursor-pointer ${
                    isStepValid()
                      ? "bg-[#782828] text-white hover:bg-[#612020] hover:scale-[1.02]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>确认，下一题</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini Tip below Card */}
      <p className="text-[10px] text-gray-400 text-center font-sans mt-4">
        * 本评估仅用作日常科普与辅助知情决策，其结果不能代替执业医生的面诊和化验诊断。
      </p>
    </div>
  );
}

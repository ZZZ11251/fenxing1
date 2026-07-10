/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PcosType {
  A = "A", // 高雄激素 + 排卵障碍 + 多囊样改变
  B = "B", // 高雄激素 + 排卵障碍 + 无多囊
  C = "C", // 高雄激素 + 多囊样改变 + 无排卵障碍
  D = "D", // 排卵障碍 + 多囊样改变 + 无高雄激素
  NONE = "NONE", // 暂未达到典型PCOS诊断标准
}

export enum MetabolicType {
  OB_IR = "OB_IR", // 肥胖 (BMI >= 24) + 有胰岛素抵抗
  OB_NO_IR = "OB_NO_IR", // 肥胖 (BMI >= 24) + 无胰岛素抵抗
  NO_OB_IR = "NO_OB_IR", // 非肥胖 (BMI < 24) + 有胰岛素抵抗
  NO_OB_NO_IR = "NO_OB_NO_IR", // 非肥胖 (BMI < 24) + 无胰岛素抵抗
}

export type PrimaryConcern = "PREGNANCY" | "SYMPTOM_CONTROL" | "WELLNESS_TRACK";

export interface UserAnswers {
  hyperandrogenSymptoms: string[]; // Options chosen for Hyperandrogenism
  ovulatorySymptoms: string[];     // Options chosen for Ovulatory dysfunction
  pcomSymptoms: string[];          // Options chosen for Polycystic ovarian morphology
  height: number;                  // Height in cm
  weight: number;                  // Weight in kg
  bmiManual: "OBESE" | "NORMAL" | null; // Selected BMI if calculated manually
  hasInsulinResistance: boolean;   // Has Insulin Resistance
  primaryConcern: PrimaryConcern;  // Primary Concern
}

export interface DiagnosticResult {
  pcosType: PcosType;
  metabolicType: MetabolicType;
  primaryConcern: PrimaryConcern;
  bmi: number;
  isObese: boolean;
  hasHyperandrogenism: boolean;
  hasOvulatoryDysfunction: boolean;
  hasPcom: boolean;
  timestamp: string;
}

export interface ScienceMyth {
  id: string;
  myth: string;
  truth: string;
  explanation: string;
}

export interface Question {
  id: number;
  title: string;
  subtitle: string;
  type: "checklist" | "bmi" | "single";
  options?: { value: string; label: string; description?: string }[];
}

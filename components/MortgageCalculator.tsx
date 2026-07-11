"use client";

import { useMemo, useState } from "react";
import {
  calculateMortgage,
  getAjieReminder,
  getMortgageInfo,
  validateMortgageInputs,
  type MortgageValidationErrors,
} from "@/lib/mortgage";

function formatCurrency(value: number) {
  return Math.round(value).toLocaleString();
}

function formatPercent(value: number) {
  return value.toFixed(1);
}

function hasValue(value: string) {
  return value.trim() !== "";
}

function filterVisibleErrors(
  errors: MortgageValidationErrors,
  fields: Record<keyof MortgageValidationErrors, string>
): MortgageValidationErrors {
  const visible: MortgageValidationErrors = {};
  (Object.keys(errors) as (keyof MortgageValidationErrors)[]).forEach((key) => {
    if (errors[key] && hasValue(fields[key])) {
      visible[key] = errors[key];
    }
  });
  return visible;
}

interface InputFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  suffix?: string;
}

function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  suffix,
}: InputFieldProps) {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium tracking-wide text-neutral-500"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border bg-neutral-50/80 px-4 py-3.5 text-[17px] font-medium text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-4 ${
            error
              ? "border-red-300/80 focus:border-red-400 focus:ring-red-100"
              : "border-neutral-200/80 focus:border-blue-400 focus:ring-blue-100"
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-400">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-[13px] font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  unit: string;
  accent: string;
  icon: string;
}

function ResultCard({ label, value, unit, accent, icon }: ResultCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 shadow-[0_2px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02] sm:p-6`}
    >
      <div
        className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 blur-2xl ${accent}`}
      />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            {icon}
          </span>
          <p className="text-[13px] font-semibold tracking-wide text-neutral-500">
            {label}
          </p>
        </div>
        <p className="text-[28px] font-bold leading-none tracking-tight text-neutral-900 sm:text-[32px]">
          {value}
          <span className="ml-1.5 text-[15px] font-medium text-neutral-400">
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: string;
}

function InfoItem({ label, value, highlight }: InfoItemProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-3 text-center sm:px-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <p
        className={`text-lg font-bold tracking-tight sm:text-xl ${highlight ?? "text-neutral-800"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function MortgageCalculator() {
  const [housePrice, setHousePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");

  const parsed = useMemo(
    () => ({
      housePrice: Number(housePrice),
      downPayment: Number(downPayment),
      annualRate: Number(annualRate),
      years: Number(years),
    }),
    [housePrice, downPayment, annualRate, years]
  );

  const rawErrors = useMemo(
    () =>
      validateMortgageInputs(
        parsed.housePrice,
        parsed.downPayment,
        parsed.annualRate,
        parsed.years
      ),
    [parsed]
  );

  const errors = useMemo(
    () =>
      filterVisibleErrors(rawErrors, {
        housePrice,
        downPayment,
        annualRate,
        years,
      }),
    [rawErrors, housePrice, downPayment, annualRate, years]
  );

  const allFieldsFilled =
    hasValue(housePrice) &&
    hasValue(downPayment) &&
    hasValue(annualRate) &&
    hasValue(years);

  const isValid = allFieldsFilled && Object.keys(rawErrors).length === 0;

  const mortgageInfo = useMemo(() => {
    if (
      !hasValue(housePrice) ||
      !parsed.housePrice ||
      parsed.housePrice <= 0 ||
      rawErrors.downPayment
    ) {
      return null;
    }
    return getMortgageInfo(parsed.housePrice, parsed.downPayment);
  }, [housePrice, parsed.housePrice, parsed.downPayment, rawErrors.downPayment]);

  const result = useMemo(() => {
    if (!isValid) return null;
    return calculateMortgage(
      parsed.housePrice,
      parsed.downPayment,
      parsed.annualRate,
      parsed.years
    );
  }, [isValid, parsed]);

  const hasAnyInput =
    hasValue(housePrice) ||
    hasValue(downPayment) ||
    hasValue(annualRate) ||
    hasValue(years);

  return (
    <div className="w-full max-w-2xl">
      <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
        <div className="border-b border-neutral-100/80 px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-2xl shadow-lg shadow-blue-500/25">
              🏠
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                房貸試算器
              </h1>
              <p className="mt-0.5 text-[14px] font-medium text-neutral-400">
                輸入後即時計算，無需按鈕
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6 sm:space-y-6 sm:px-8 sm:py-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <InputField
              id="housePrice"
              label="房價"
              placeholder="例如 1500"
              value={housePrice}
              onChange={setHousePrice}
              error={errors.housePrice}
              suffix="萬元"
            />
            <InputField
              id="downPayment"
              label="自備款"
              placeholder="例如 300"
              value={downPayment}
              onChange={setDownPayment}
              error={errors.downPayment}
              suffix="萬元"
            />
            <InputField
              id="annualRate"
              label="年利率"
              placeholder="例如 2.1"
              value={annualRate}
              onChange={setAnnualRate}
              error={errors.annualRate}
              suffix="%"
            />
            <InputField
              id="years"
              label="貸款年限"
              placeholder="例如 30"
              value={years}
              onChange={setYears}
              error={errors.years}
              suffix="年"
            />
          </div>

          {mortgageInfo && (
            <div className="rounded-3xl border border-neutral-100 bg-neutral-50/60 p-1 backdrop-blur-sm">
              <div className="px-4 py-3">
                <p className="text-[13px] font-semibold tracking-wide text-neutral-500">
                  即時資訊
                </p>
              </div>
              <div className="grid grid-cols-1 divide-y divide-neutral-100 rounded-2xl bg-white/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <InfoItem
                  label="貸款金額"
                  value={`${mortgageInfo.loanAmount.toLocaleString()} 萬`}
                />
                <InfoItem
                  label="貸款成數"
                  value={`${formatPercent(mortgageInfo.loanRatio)}%`}
                  highlight="text-blue-600"
                />
                <InfoItem
                  label="自備款比例"
                  value={`${formatPercent(mortgageInfo.downPaymentRatio)}%`}
                  highlight="text-emerald-600"
                />
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
                  試算結果
                </h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-600">
                  即時更新
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <ResultCard
                  label="每月月付"
                  value={formatCurrency(result.monthlyPayment)}
                  unit="元"
                  accent="bg-emerald-400"
                  icon="💳"
                />
                <ResultCard
                  label="總利息"
                  value={formatCurrency(result.totalInterest)}
                  unit="元"
                  accent="bg-amber-400"
                  icon="📈"
                />
                <ResultCard
                  label="總還款"
                  value={formatCurrency(result.totalPayment)}
                  unit="元"
                  accent="bg-blue-400"
                  icon="🏦"
                />
                <ResultCard
                  label="貸款金額"
                  value={result.loanAmount.toLocaleString()}
                  unit="萬元"
                  accent="bg-violet-400"
                  icon="💰"
                />
              </div>

              <div className="rounded-3xl border border-amber-100/80 bg-gradient-to-br from-amber-50/90 to-orange-50/60 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-lg">
                    💡
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-amber-900">
                      阿傑提醒
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-amber-800/90">
                      {getAjieReminder(result.loanRatio)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasAnyInput && (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/40 px-6 py-10 text-center">
              <p className="text-[15px] font-medium text-neutral-400">
                填寫上方欄位，即可即時查看試算結果
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

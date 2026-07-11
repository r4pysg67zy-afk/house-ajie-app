export interface MortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanRatio: number;
  downPaymentRatio: number;
}

export interface MortgageValidationErrors {
  housePrice?: string;
  downPayment?: string;
  annualRate?: string;
  years?: string;
}

export function validateMortgageInputs(
  housePrice: number,
  downPayment: number,
  annualRate: number,
  years: number
): MortgageValidationErrors {
  const errors: MortgageValidationErrors = {};

  if (!housePrice || housePrice <= 0) {
    errors.housePrice = "房價必須大於 0";
  }

  if (downPayment > housePrice) {
    errors.downPayment = "自備款不能大於房價";
  }

  if (!annualRate || annualRate <= 0) {
    errors.annualRate = "利率必須大於 0";
  }

  if (!years || years <= 0) {
    errors.years = "年限必須大於 0";
  }

  return errors;
}

export function getMortgageInfo(housePrice: number, downPayment: number) {
  const loanAmount = housePrice - downPayment;
  const loanRatio = housePrice > 0 ? (loanAmount / housePrice) * 100 : 0;
  const downPaymentRatio =
    housePrice > 0 ? (downPayment / housePrice) * 100 : 0;

  return { loanAmount, loanRatio, downPaymentRatio };
}

export function getAjieReminder(loanRatio: number): string {
  if (loanRatio > 80) {
    return "貸款成數偏高，建議提高自備款，可降低每月壓力。";
  }
  if (loanRatio >= 70) {
    return "目前貸款成數合理，可依收入評估是否增加自備款。";
  }
  return "貸款成數良好，未來財務彈性較高。";
}

export function calculateMortgage(
  housePrice: number,
  downPayment: number,
  annualRate: number,
  years: number
): MortgageResult {
  const { loanAmount, loanRatio, downPaymentRatio } = getMortgageInfo(
    housePrice,
    downPayment
  );

  const principal = loanAmount * 10000;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;

  const monthlyPayment =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    loanAmount,
    monthlyPayment,
    totalPayment,
    totalInterest,
    loanRatio,
    downPaymentRatio,
  };
}

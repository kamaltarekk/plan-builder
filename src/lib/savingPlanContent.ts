import type {
  Allocation,
  AllocationKey,
  DurationMonths,
  GoalKey,
  SalaryRangeKey,
} from './savingPlanTypes';

// ─── Physical / domain constants ──────────────────────────────
export const SILVER_GRAMS_PER_OUNCE = 31.1034768;

export const HIGH_SALARY_DEFAULT = 90000;
export const HIGH_SALARY_MIN = 75000;
export const SALARY_MAX = 1000000;

export const PERCENTAGE_MIN = 1;
export const PERCENTAGE_MAX = 50;

// ─── Salary ranges ────────────────────────────────────────────
export interface SalaryRangeOption {
  key: SalaryRangeKey;
  label: string;
  midpoint: number;
}

export const SALARY_RANGES: readonly SalaryRangeOption[] = [
  { key: 'less_than_10000', label: 'أقل من 10,000 جنيه', midpoint: 7500 },
  { key: '10000_20000', label: '10,000 – 20,000 جنيه', midpoint: 15000 },
  { key: '20000_35000', label: '20,000 – 35,000 جنيه', midpoint: 27500 },
  { key: '35000_50000', label: '35,000 – 50,000 جنيه', midpoint: 42500 },
  { key: '50000_75000', label: '50,000 – 75,000 جنيه', midpoint: 62500 },
  {
    key: 'more_than_75000',
    label: 'أكثر من 75,000 جنيه',
    midpoint: HIGH_SALARY_DEFAULT,
  },
];

export const SALARY_MIDPOINTS: Record<SalaryRangeKey, number> = {
  less_than_10000: 7500,
  '10000_20000': 15000,
  '20000_35000': 27500,
  '35000_50000': 42500,
  '50000_75000': 62500,
  more_than_75000: HIGH_SALARY_DEFAULT,
};

// ─── Saving percentage presets ────────────────────────────────
export interface PercentageOption {
  value: number;
  label: string;
}

export const PERCENTAGE_OPTIONS: readonly PercentageOption[] = [
  { value: 5, label: '5% — بداية هادية' },
  { value: 10, label: '10% — خطة متوازنة' },
  { value: 15, label: '15% — خطة أسرع' },
  { value: 20, label: '20% — التزام أعلى' },
];

// ─── Goals ────────────────────────────────────────────────────
export interface GoalOption {
  key: GoalKey;
  label: string;
}

export const GOALS: readonly GoalOption[] = [
  { key: 'monthly_habit', label: 'أبدأ عادة ادخار شهرية' },
  { key: 'preserve_value', label: 'أحافظ على قيمة جزء من فلوسي' },
  { key: 'gold_1g', label: 'أوصل لأول 1 جرام ذهب' },
  { key: 'gold_5g_delivery', label: 'أوصل لأول 5 جرام ذهب للتسليم' },
  { key: 'silver_1oz', label: 'أوصل لأول 1 أونصة فضة' },
  { key: 'silver_500g_receipt', label: 'أوصل لأول 500 جرام فضة للاستلام' },
  { key: 'long_term', label: 'خطة طويلة الأجل بدون هدف محدد' },
];

export const GOAL_LABELS: Record<GoalKey, string> = {
  monthly_habit: 'أبدأ عادة ادخار شهرية',
  preserve_value: 'أحافظ على قيمة جزء من فلوسي',
  gold_1g: 'أوصل لأول 1 جرام ذهب',
  gold_5g_delivery: 'أوصل لأول 5 جرام ذهب للتسليم',
  silver_1oz: 'أوصل لأول 1 أونصة فضة',
  silver_500g_receipt: 'أوصل لأول 500 جرام فضة للاستلام',
  long_term: 'خطة طويلة الأجل بدون هدف محدد',
};

/** Gold goals expressed in grams of gold. */
export const GOAL_GOLD_GRAMS: Partial<Record<GoalKey, number>> = {
  gold_1g: 1,
  gold_5g_delivery: 5,
};

/** Silver goals expressed in grams of silver. */
export const GOAL_SILVER_GRAMS: Partial<Record<GoalKey, number>> = {
  silver_1oz: SILVER_GRAMS_PER_OUNCE,
  silver_500g_receipt: 500,
};

/** Goals that build a habit rather than chase a numeric milestone. */
export const BEHAVIORAL_GOALS: readonly GoalKey[] = [
  'monthly_habit',
  'preserve_value',
  'long_term',
];

// ─── Duration ─────────────────────────────────────────────────
export interface DurationOption {
  value: DurationMonths;
  label: string;
}

export const DURATIONS: readonly DurationOption[] = [
  { value: 6, label: '6 شهور' },
  { value: 12, label: 'سنة' },
  { value: 36, label: '3 سنين' },
  { value: 60, label: '5 سنين' },
];

export const DURATION_LABELS: Record<DurationMonths, string> = {
  6: '6 شهور',
  12: 'سنة',
  36: '3 سنين',
  60: '5 سنين',
};

// ─── Allocation ───────────────────────────────────────────────
export interface AllocationOption {
  key: AllocationKey;
  label: string;
  allocation: Allocation;
}

export const ALLOCATIONS: readonly AllocationOption[] = [
  { key: 'gold', label: 'ذهب', allocation: { gold: 100, silver: 0 } },
  { key: 'silver', label: 'فضة', allocation: { gold: 0, silver: 100 } },
  {
    key: 'gold70_silver30',
    label: '70% ذهب / 30% فضة',
    allocation: { gold: 70, silver: 30 },
  },
  {
    key: 'gold50_silver50',
    label: '50% ذهب / 50% فضة',
    allocation: { gold: 50, silver: 50 },
  },
  {
    key: 'gold30_silver70',
    label: '30% ذهب / 70% فضة',
    allocation: { gold: 30, silver: 70 },
  },
];

export const ALLOCATION_MAP: Record<AllocationKey, Allocation> = {
  gold: { gold: 100, silver: 0 },
  silver: { gold: 0, silver: 100 },
  gold70_silver30: { gold: 70, silver: 30 },
  gold50_silver50: { gold: 50, silver: 50 },
  gold30_silver70: { gold: 30, silver: 70 },
};

// ─── Copy (Egyptian Arabic) ───────────────────────────────────
export const COPY = {
  pageTitle: 'مخطط سبيكة للادخار بالذهب والفضة',
  hero: {
    eyebrow: 'مخطط سبيكة',
    headline: 'مرتبك ممكن يبني لك خطة ذهب أو فضة… حتى لو هتبدأ بنسبة صغيرة',
    subheadline:
      'اختار شريحة دخلك، النسبة اللي تقدر تخصصها، والهدف اللي عايز توصله — وسبيكة هتوضحلك خطة شهرية تقديرية بناءً على سعر اليوم.',
    cta: 'ابني خطتك الآن',
  },
  totalSteps: 5,
  steps: {
    salary: {
      question: 'دخلك الشهري تقريبًا في أي شريحة؟',
      support:
        'مش بنحتاج رقم دقيق، اختيار الشريحة كفاية عشان نبني لك خطة مناسبة.',
      highSalaryPrompt:
        'تحب نحسبها على 90,000 جنيه كتقدير؟ أو اكتب رقم تقريبي مختلف.',
      highSalaryFieldLabel: 'رقم تقريبي مختلف (اختياري)',
      highSalaryPlaceholder: '90,000',
    },
    percentage: {
      question: 'تحب تخصص كام من دخلك شهريًا لخطة الذهب أو الفضة؟',
      customLabel: 'نسبة مخصصة',
      customFieldLabel: 'اكتب النسبة اللي تناسبك (%)',
      customPlaceholder: 'مثال: 12',
    },
    goal: {
      question: 'هدفك الأساسي من الخطة إيه؟',
    },
    duration: {
      question: 'عايز الخطة تبقى لمدة قد إيه؟',
    },
    allocation: {
      question: 'تحب تبني خطتك على إيه؟',
    },
  },
  affordability: {
    calm: 'بداية هادية ومناسبة لو عايز تبدأ من غير ضغط.',
    balanced: 'خطة متوازنة تساعدك تبني عادة ادخار شهرية.',
    faster: 'خطة أسرع، مناسبة لو عندك هدف واضح وقدرة شهرية ثابتة.',
    heavy:
      'النسبة دي ممكن تكون ضاغطة لو عندك التزامات شهرية. جرّب تبدأ بنسبة أقل لو حابب تخلي الخطة أسهل في الالتزام.',
  },
  result: {
    introByRange: (income: string) =>
      `بناءً على شريحة دخلك، هنحسب الخطة على متوسط تقريبي ${income} شهريًا.`,
    introCustom: (income: string) =>
      `بناءً على الرقم التقريبي اللي اخترته، هنحسب الخطة على ${income} شهريًا.`,
    cards: {
      monthly: 'المبلغ الشهري التقريبي',
      total: 'إجمالي المساهمات خلال الخطة',
      equivalent: 'يعادل تقريبًا بسعر اليوم',
      goal: 'هدفك القادم',
      next: 'الخطوة التالية',
    },
    totalSuffix: (durationLabel: string) => `خلال ${durationLabel}`,
    nextStepLead: 'ابدأ تنفيذ خطتك على سبيكة',
    priceSource: 'الحساب مبني على السعر المرجعي الحالي داخل سبيكة',
    priceUpdatedPrefix: 'آخر تحديث للسعر:',
    behavioralMessage:
      'الخطة دي هدفها بناء عادة شهرية مستمرة، والأهم هو الالتزام بالمبلغ اللي اخترته.',
    goldMismatch:
      'اختيارك الحالي لا يحتوي على ذهب. غيّر التوزيع لو هدفك مرتبط بالذهب.',
    silverMismatch:
      'اختيارك الحالي لا يحتوي على فضة. غيّر التوزيع لو هدفك مرتبط بالفضة.',
    monthsToGoal: (months: string) => `متوقع توصل لهدفك خلال ${months} تقريبًا.`,
    disclaimer:
      'الأرقام تقديرية بناءً على السعر المرجعي الحالي داخل سبيكة. أسعار الذهب والفضة متغيرة، والكمية الفعلية تختلف حسب سعر الشراء وقت التنفيذ. هذه الخطة ليست نصيحة استثمارية.',
  },
  cta: {
    install: 'ابدأ أول خطوة على سبيكة',
    edit: 'عدّل الخطة',
    copy: 'انسخ ملخص الخطة',
    copied: 'تم نسخ ملخص الخطة',
  },
  download: {
    heading: 'عايز تحتفظ بخطتك؟',
    subheading: 'سيب اسمك ورقم موبايلك وحمّل خطتك PDF.',
    nameLabel: 'الاسم',
    namePlaceholder: 'اكتب اسمك',
    mobileLabel: 'رقم الموبايل',
    mobilePlaceholder: '01XXXXXXXXX',
    submit: 'حمّل الخطة PDF',
    generating: 'بنجهّز الـ PDF…',
    success: 'تم تجهيز خطتك وتحميلها ✅',
    error: 'حصلت مشكلة وإحنا بنجهّز الملف، جرّب تاني.',
  },
  pdf: {
    brand: 'سبيكة',
    title: 'مخطط سبيكة للادخار بالذهب والفضة',
    subtitle: 'خطة شهرية تقديرية بالذهب أو الفضة',
    ctaButton: 'افتح تطبيق سبيكة',
    ctaHint: 'اضغط هنا للدخول على التطبيق مباشرة',
    fileName: 'sabika-saving-plan.pdf',
  },
  priceUnavailable: 'أسعار الذهب أو الفضة غير متاحة حاليًا. جرّب مرة تانية بعد قليل.',
  nav: {
    next: 'التالي',
    back: 'رجوع',
    generate: 'اعرض خطتي',
    stepLabel: (current: number, total: number) =>
      `الخطوة ${current} من ${total}`,
  },
  validation: {
    salaryRequired: 'اختار شريحة دخلك الأول.',
    percentageRequired: 'اختار النسبة الأول.',
    goalRequired: 'اختار هدفك الأول.',
    durationRequired: 'اختار مدة الخطة الأول.',
    allocationRequired: 'اختار التوزيع الأول.',
    salaryNotNumber: 'اكتب رقم صحيح من فضلك.',
    salaryTooLow: 'لازم الرقم يكون 75,000 جنيه أو أكثر.',
    salaryTooHigh: 'الرقم كبير جدًا، اكتب رقم تقريبي معقول.',
    percentageNotNumber: 'اكتب نسبة صحيحة من فضلك.',
    percentageTooLow: 'أقل نسبة ممكنة هي 1%.',
    percentageTooHigh: 'أعلى نسبة ممكنة هي 50%.',
  },
  units: {
    gram: 'جرام',
    ounce: 'أونصة',
    gold: 'ذهب',
    silver: 'فضة',
    egp: 'جنيه',
    approx: 'تقريبًا',
  },
} as const;

export const SAFE_VALUE_PLACEHOLDER = '—';

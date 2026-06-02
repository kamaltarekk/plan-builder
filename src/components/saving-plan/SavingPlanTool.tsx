import { useEffect, useMemo, useReducer, useRef } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Stepper from '@/components/ui/Stepper';
import AllocationStep from './AllocationStep';
import DurationStep from './DurationStep';
import GoalStep from './GoalStep';
import PercentageStep, { type PercentageChoice } from './PercentageStep';
import ResultCards from './ResultCards';
import SalaryRangeStep from './SalaryRangeStep';
import { monthlySavingBucket, track } from '@/lib/analytics';
import { COPY, SALARY_MIDPOINTS } from '@/lib/savingPlanContent';
import { calculateSavingPlan } from '@/lib/savingPlanCalculator';
import { getReferencePrice } from '@/lib/priceProvider';
import {
  affordabilityMessage,
  validateCustomPercentage,
  validateCustomSalary,
  validatePlanInputs,
  type PlanDraft,
} from '@/lib/savingPlanValidation';
import type {
  AllocationKey,
  DurationMonths,
  GoalKey,
  SalaryRangeKey,
} from '@/lib/savingPlanTypes';

type Phase = 'form' | 'result';

interface State {
  phase: Phase;
  stepIndex: number;
  salaryRangeKey: SalaryRangeKey | null;
  customSalaryText: string;
  percentageChoice: PercentageChoice | null;
  customPercentageText: string;
  goal: GoalKey | null;
  durationMonths: DurationMonths | null;
  allocationKey: AllocationKey | null;
}

const INITIAL_STATE: State = {
  phase: 'form',
  stepIndex: 0,
  salaryRangeKey: null,
  customSalaryText: '',
  percentageChoice: null,
  customPercentageText: '',
  goal: null,
  durationMonths: null,
  allocationKey: null,
};

const LAST_STEP = COPY.totalSteps - 1;

type Action =
  | { type: 'SET_SALARY'; key: SalaryRangeKey }
  | { type: 'SET_CUSTOM_SALARY'; text: string }
  | { type: 'SET_PERCENTAGE'; choice: PercentageChoice }
  | { type: 'SET_CUSTOM_PERCENTAGE'; text: string }
  | { type: 'SET_GOAL'; goal: GoalKey }
  | { type: 'SET_DURATION'; months: DurationMonths }
  | { type: 'SET_ALLOCATION'; key: AllocationKey }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GENERATE' }
  | { type: 'EDIT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SALARY':
      return { ...state, salaryRangeKey: action.key };
    case 'SET_CUSTOM_SALARY':
      return { ...state, customSalaryText: action.text };
    case 'SET_PERCENTAGE':
      return { ...state, percentageChoice: action.choice };
    case 'SET_CUSTOM_PERCENTAGE':
      return { ...state, customPercentageText: action.text };
    case 'SET_GOAL':
      return { ...state, goal: action.goal };
    case 'SET_DURATION':
      return { ...state, durationMonths: action.months };
    case 'SET_ALLOCATION':
      return { ...state, allocationKey: action.key };
    case 'NEXT':
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, LAST_STEP) };
    case 'BACK':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    case 'GENERATE':
      return { ...state, phase: 'result' };
    case 'EDIT':
      return { ...state, phase: 'form' };
    default:
      return state;
  }
}

export default function SavingPlanTool() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('saving_plan_started');
  }, []);

  const priceResult = useMemo(() => getReferencePrice(), []);

  // ── Custom-field validation (derived each render) ──────────────
  const customSalaryResult = validateCustomSalary(state.customSalaryText);
  const hasCustomSalaryText =
    state.salaryRangeKey === 'more_than_75000' &&
    state.customSalaryText.trim() !== '';
  const customSalaryError =
    hasCustomSalaryText && !customSalaryResult.ok
      ? customSalaryResult.message
      : null;
  const resolvedCustomSalary =
    hasCustomSalaryText && customSalaryResult.ok ? customSalaryResult.value : null;

  const customPercentageResult = validateCustomPercentage(
    state.customPercentageText,
  );
  const hasCustomPercentageText =
    state.percentageChoice === 'custom' &&
    state.customPercentageText.trim() !== '';
  const customPercentageError =
    hasCustomPercentageText && !customPercentageResult.ok
      ? customPercentageResult.message
      : null;

  let resolvedPercentage: number | null = null;
  if (typeof state.percentageChoice === 'number') {
    resolvedPercentage = state.percentageChoice;
  } else if (
    state.percentageChoice === 'custom' &&
    hasCustomPercentageText &&
    customPercentageResult.ok
  ) {
    resolvedPercentage = customPercentageResult.value;
  }

  let resolvedIncome: number | null = null;
  if (state.salaryRangeKey === 'more_than_75000') {
    resolvedIncome = resolvedCustomSalary ?? SALARY_MIDPOINTS.more_than_75000;
  } else if (state.salaryRangeKey) {
    resolvedIncome = SALARY_MIDPOINTS[state.salaryRangeKey];
  }

  const resolvedMonthly =
    resolvedIncome != null && resolvedPercentage != null
      ? resolvedIncome * (resolvedPercentage / 100)
      : null;

  const affordability =
    resolvedPercentage != null ? affordabilityMessage(resolvedPercentage) : '';

  const stepValidity: boolean[] = [
    !!state.salaryRangeKey && !(hasCustomSalaryText && !customSalaryResult.ok),
    state.percentageChoice != null &&
      (state.percentageChoice !== 'custom' ||
        (hasCustomPercentageText && customPercentageResult.ok)),
    !!state.goal,
    state.durationMonths != null,
    !!state.allocationKey,
  ];
  const currentValid = stepValidity[state.stepIndex] ?? false;

  const draft: PlanDraft = {
    salaryRangeKey: state.salaryRangeKey,
    customSalaryValue: resolvedCustomSalary,
    savingPercentage: resolvedPercentage,
    goal: state.goal,
    durationMonths: state.durationMonths,
    allocationKey: state.allocationKey,
  };

  let calculation = null;
  if (state.phase === 'result' && priceResult.ok) {
    const validation = validatePlanInputs(draft);
    if (validation.ok) {
      calculation = calculateSavingPlan(validation.inputs, priceResult.price);
    }
  }

  function scrollToTop() {
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function emitStepEvent(index: number) {
    switch (index) {
      case 0:
        track('saving_plan_salary_range_selected', {
          salaryRangeKey: state.salaryRangeKey,
          ...(resolvedCustomSalary != null
            ? { customSalary: resolvedCustomSalary }
            : {}),
        });
        break;
      case 1:
        track('saving_plan_percentage_selected', {
          percentage: resolvedPercentage,
        });
        break;
      case 2:
        track('saving_plan_goal_selected', { goal: state.goal });
        break;
      case 3:
        track('saving_plan_duration_selected', {
          durationMonths: state.durationMonths,
        });
        break;
      case 4:
        track('saving_plan_allocation_selected', {
          allocationKey: state.allocationKey,
        });
        break;
      default:
        break;
    }
  }

  function handleNext() {
    if (!currentValid) return;
    emitStepEvent(state.stepIndex);
    if (state.stepIndex < LAST_STEP) {
      dispatch({ type: 'NEXT' });
      return;
    }
    track('saving_plan_generated', {
      salaryRangeKey: state.salaryRangeKey,
      percentage: resolvedPercentage,
      goal: state.goal,
      durationMonths: state.durationMonths,
      allocationKey: state.allocationKey,
      monthlySavingBucket:
        resolvedMonthly != null
          ? monthlySavingBucket(resolvedMonthly)
          : 'unknown',
      ...(resolvedCustomSalary != null
        ? { customSalary: resolvedCustomSalary }
        : {}),
    });
    dispatch({ type: 'GENERATE' });
    scrollToTop();
  }

  function handleEdit() {
    track('saving_plan_reset_clicked');
    dispatch({ type: 'EDIT' });
    scrollToTop();
  }

  const errorMessage = !priceResult.ok
    ? priceResult.reason
    : calculation && !calculation.ok
      ? calculation.error
      : COPY.priceUnavailable;

  return (
    <div ref={containerRef} id="saving-plan-tool" className="scroll-mt-6">
      <Card className="p-5 sm:p-7">
        {state.phase === 'result' ? (
          calculation && calculation.ok && priceResult.ok ? (
            <ResultCards
              result={calculation.result}
              price={priceResult.price}
              onCtaClick={() =>
                track('saving_plan_cta_clicked', { source: 'result' })
              }
              onEditClick={handleEdit}
              onCopyClick={() => track('saving_plan_copy_clicked')}
            />
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-base font-semibold text-sabika-ink">
                {errorMessage}
              </p>
              <Button variant="secondary" onClick={handleEdit}>
                {COPY.cta.edit}
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <Stepper current={state.stepIndex + 1} total={COPY.totalSteps} />

            {state.stepIndex === 0 ? (
              <SalaryRangeStep
                selected={state.salaryRangeKey}
                onSelect={(key) => dispatch({ type: 'SET_SALARY', key })}
                customSalaryText={state.customSalaryText}
                onCustomSalaryChange={(text) =>
                  dispatch({ type: 'SET_CUSTOM_SALARY', text })
                }
                customSalaryError={customSalaryError}
              />
            ) : null}

            {state.stepIndex === 1 ? (
              <PercentageStep
                choice={state.percentageChoice}
                onChoose={(choice) => dispatch({ type: 'SET_PERCENTAGE', choice })}
                customPercentageText={state.customPercentageText}
                onCustomPercentageChange={(text) =>
                  dispatch({ type: 'SET_CUSTOM_PERCENTAGE', text })
                }
                customPercentageError={customPercentageError}
                affordability={affordability}
              />
            ) : null}

            {state.stepIndex === 2 ? (
              <GoalStep
                selected={state.goal}
                onSelect={(goal) => dispatch({ type: 'SET_GOAL', goal })}
              />
            ) : null}

            {state.stepIndex === 3 ? (
              <DurationStep
                selected={state.durationMonths}
                onSelect={(months) => dispatch({ type: 'SET_DURATION', months })}
              />
            ) : null}

            {state.stepIndex === 4 ? (
              <AllocationStep
                selected={state.allocationKey}
                onSelect={(key) => dispatch({ type: 'SET_ALLOCATION', key })}
              />
            ) : null}

            <div className="flex items-center justify-between gap-3 pt-2">
              {state.stepIndex > 0 ? (
                <Button variant="ghost" onClick={() => dispatch({ type: 'BACK' })}>
                  {COPY.nav.back}
                </Button>
              ) : (
                <span />
              )}
              <Button onClick={handleNext} disabled={!currentValid}>
                {state.stepIndex < LAST_STEP ? COPY.nav.next : COPY.nav.generate}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

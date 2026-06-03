import { useEffect } from 'react';
import PlanDisclaimer from '@/components/saving-plan/PlanDisclaimer';
import SavingPlanTool from '@/components/saving-plan/SavingPlanTool';
import Logo from '@/components/ui/Logo';
import { COPY } from '@/lib/savingPlanContent';

export default function SavingPlanPage() {
  useEffect(() => {
    document.title = COPY.pageTitle;
  }, []);

  return (
    <main className="min-h-screen bg-sabika-cream">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 text-center sm:mb-10">
          <Logo className="mb-4 justify-center text-3xl" />
          <h1 className="text-2xl font-extrabold leading-tight text-sabika-ink sm:text-4xl">
            {COPY.hero.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-sabika-ink-soft sm:text-lg">
            {COPY.hero.subheadline}
          </p>
          <a
            href="#saving-plan-tool"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-sabika-gold px-6 py-3 text-base font-semibold text-sabika-ink transition-colors duration-150 hover:bg-sabika-gold-dark hover:text-white"
          >
            {COPY.hero.cta}
          </a>
        </header>

        <SavingPlanTool />

        <footer className="mt-8">
          <PlanDisclaimer className="text-center" />
        </footer>
      </div>
    </main>
  );
}

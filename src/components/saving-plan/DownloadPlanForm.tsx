import { type FormEvent, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import PdfPlanTemplate from './PdfPlanTemplate';
import { track } from '@/lib/analytics';
import { SABIKA_INSTALL_URL } from '@/lib/constants';
import { COPY } from '@/lib/savingPlanContent';
import { validateLeadMobile, validateLeadName } from '@/lib/leadValidation';
import { generatePlanPdf } from '@/lib/pdf/planPdf';
import type { MetalPrice, PlanResult } from '@/lib/savingPlanTypes';

type Status = 'idle' | 'generating' | 'done' | 'error';

interface DownloadPlanFormProps {
  result: PlanResult;
  price: MetalPrice;
}

export default function DownloadPlanForm({
  result,
  price,
}: DownloadPlanFormProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const templateRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nameResult = validateLeadName(name);
    const mobileResult = validateLeadMobile(mobile);
    setNameError(nameResult.ok ? null : nameResult.message);
    setMobileError(mobileResult.ok ? null : mobileResult.message);
    if (!nameResult.ok || !mobileResult.ok) return;
    if (!templateRef.current) return;

    // Note: name/mobile are intentionally NOT sent to analytics (PII).
    track('saving_plan_pdf_download_clicked', { source: 'result' });
    setStatus('generating');
    try {
      await generatePlanPdf({
        node: templateRef.current,
        fileName: COPY.pdf.fileName,
        installUrl: SABIKA_INSTALL_URL,
      });
      track('saving_plan_pdf_downloaded');
      setStatus('done');
    } catch {
      track('saving_plan_pdf_download_failed');
      setStatus('error');
    }
  }

  const generating = status === 'generating';

  return (
    <Card className="border border-sabika-silver-light bg-sabika-cream">
      <h3 className="text-lg font-bold text-sabika-ink">
        {COPY.download.heading}
      </h3>
      <p className="mt-1 text-sm text-sabika-ink-soft">
        {COPY.download.subheading}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
        <TextField
          id="lead-name"
          label={COPY.download.nameLabel}
          value={name}
          onChange={(value) => {
            setName(value);
            if (nameError) setNameError(null);
          }}
          placeholder={COPY.download.namePlaceholder}
          error={nameError}
          autoComplete="name"
        />
        <TextField
          id="lead-mobile"
          label={COPY.download.mobileLabel}
          value={mobile}
          onChange={(value) => {
            setMobile(value);
            if (mobileError) setMobileError(null);
          }}
          placeholder={COPY.download.mobilePlaceholder}
          error={mobileError}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
        />
        <Button type="submit" fullWidth disabled={generating}>
          {generating ? COPY.download.generating : COPY.download.submit}
        </Button>
      </form>

      {status === 'done' ? (
        <p role="status" className="mt-3 text-sm font-semibold text-green-700">
          {COPY.download.success}
        </p>
      ) : null}
      {status === 'error' ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
          {COPY.download.error}
        </p>
      ) : null}

      {/* Off-screen branded template captured for the PDF. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: '-10000px',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <div ref={templateRef}>
          <PdfPlanTemplate
            result={result}
            price={price}
            installUrl={SABIKA_INSTALL_URL}
          />
        </div>
      </div>
    </Card>
  );
}

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

interface QrShareCardProps {
  carId: string;
  make: string;
  model: string;
  vin: string;
}

export function QrShareCard({ carId, make, model, vin }: QrShareCardProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const publicBase = (import.meta.env.VITE_PUBLIC_URL as string | undefined)?.replace(/\/$/, '') || window.location.origin;
  const publicUrl = `${publicBase}/car/${carId}`;

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: '#3C3835',
        light: '#FAF7F0',
      },
      errorCorrectionLevel: 'M',
    }).catch(() => {
      // canvas init failure — silent
    });
  }, [publicUrl]);

  const downloadPng = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(publicUrl, {
        width: 1024,
        margin: 2,
        color: {
          dark: '#3C3835',
          light: '#FAF7F0',
        },
        errorCorrectionLevel: 'H',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `trve-${vin}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('QR download failed', err);
    }
  };

  const printQr = async () => {
    const dataUrl = await QRCode.toDataURL(publicUrl, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: { dark: '#000000', light: '#FFFFFF' },
    });
    const w = window.open('', '_blank', 'width=600,height=800');
    if (!w) return;
    w.document.write(`
      <html><head><title>TRVE — ${make} ${model}</title>
      <style>
        @page { size: A6; margin: 1cm; }
        body { margin: 0; padding: 2rem; font-family: -apple-system, system-ui, sans-serif; text-align: center; color: #3C3835; }
        img { max-width: 320px; width: 100%; }
        .label { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #B85C38; margin-bottom: 0.5rem; }
        .title { font-size: 22px; font-weight: 300; margin: 0.25rem 0 0.5rem; }
        .vin { font-family: ui-monospace, monospace; font-size: 12px; opacity: 0.6; margin-bottom: 1rem; }
        .footer { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.5; margin-top: 1rem; }
        .brand { color: #E67347; font-weight: 600; }
      </style>
      </head><body>
        <div class="label">Historia auta — skanuj QR</div>
        <div class="title">${make} ${model}</div>
        <div class="vin">${vin}</div>
        <img src="${dataUrl}" alt="QR" />
        <div class="footer">Powered by <span class="brand">TRVE</span></div>
        <script>window.onload = () => setTimeout(() => window.print(), 200);</script>
      </body></html>
    `);
    w.document.close();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="border border-border p-5">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        {t('app.cars.qr.title')}
      </h2>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* QR canvas */}
        <div
          className="flex-shrink-0 p-3 bg-[#FAF7F0] border border-border self-center sm:self-start"
          style={{ borderRadius: '6px 4px 8px 5px' }}
        >
          <canvas ref={canvasRef} />
        </div>

        {/* Actions + URL */}
        <div className="flex-1 min-w-0 w-full">
          <p className="text-sm text-muted-foreground mb-3">{t('app.cars.qr.body')}</p>

          {/* URL row */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={publicUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 min-w-0 h-9 px-2.5 border border-border bg-background text-xs font-mono outline-none"
            />
            <Button type="button" variant="ghost" size="sm" onClick={copyLink}>
              {copied ? t('app.cars.qr.copied') : t('app.cars.qr.copy')}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button type="button" size="sm" onClick={downloadPng}>
              {t('app.cars.qr.download')}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={printQr}>
              {t('app.cars.qr.print')}
            </Button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Button type="button" size="sm" variant="ghost">
                {t('app.cars.qr.open')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

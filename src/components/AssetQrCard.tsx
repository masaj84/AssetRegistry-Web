import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

interface AssetQrCardProps {
  recordHash: string;
  assetName?: string;
  assetId?: number | string;
}

export function AssetQrCard({ recordHash, assetName, assetId }: AssetQrCardProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const publicBase =
    (import.meta.env.VITE_PUBLIC_URL as string | undefined)?.replace(/\/$/, '') ||
    'https://trve.io';
  const publicUrl = `${publicBase}/verify/${recordHash}`;

  useEffect(() => {
    if (!canvasRef.current || !recordHash) return;
    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 240,
      margin: 1,
      color: { dark: '#161616', light: '#FFFFFF' },
      errorCorrectionLevel: 'M',
    }).catch(() => { /* silent */ });
  }, [publicUrl, recordHash]);

  const downloadPng = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(publicUrl, {
        width: 1024,
        margin: 2,
        color: { dark: '#161616', light: '#FFFFFF' },
        errorCorrectionLevel: 'H',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      const fileSlug = (assetName || `asset-${assetId ?? recordHash.slice(2, 10)}`).replace(/[^\w.-]+/g, '-').toLowerCase();
      link.download = `trve-${fileSlug}.png`;
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
    const safeName = (assetName || `Asset ${assetId ?? ''}`).replace(/</g, '&lt;');
    const shortHash = `${recordHash.slice(0, 10)}…${recordHash.slice(-8)}`;
    w.document.write(`
      <html><head><title>TRVE — ${safeName}</title>
      <style>
        @page { size: A6; margin: 1cm; }
        body { margin: 0; padding: 2rem; font-family: -apple-system, system-ui, sans-serif; text-align: center; color: #161616; }
        img { max-width: 320px; width: 100%; }
        .label { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #161616; margin-bottom: 0.5rem; opacity: 0.6; }
        .title { font-size: 22px; font-weight: 500; margin: 0.25rem 0 0.5rem; }
        .hash { font-family: ui-monospace, monospace; font-size: 11px; opacity: 0.55; margin-bottom: 1rem; word-break: break-all; }
        .footer { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55; margin-top: 1rem; }
        .brand { font-weight: 600; }
      </style>
      </head><body>
        <div class="label">Scan to verify on-chain</div>
        <div class="title">${safeName}</div>
        <div class="hash">${shortHash}</div>
        <img src="${dataUrl}" alt="QR" />
        <div class="footer">Verified by <span class="brand">TRVE_</span></div>
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

  if (!recordHash) {
    return (
      <div className="border border-border p-5">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
          {t('asset.qr.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('asset.qr.notAnchored')}</p>
      </div>
    );
  }

  return (
    <div className="border border-border p-5">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
        {t('asset.qr.title')}
      </h2>

      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="flex-shrink-0 p-3 bg-white border border-border self-center sm:self-start">
          <canvas ref={canvasRef} />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <p className="text-sm text-muted-foreground mb-3">{t('asset.qr.body')}</p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={publicUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 min-w-0 h-9 px-2.5 border border-border bg-background text-xs font-mono outline-none"
            />
            <Button type="button" variant="ghost" size="sm" onClick={copyLink}>
              {copied ? t('asset.qr.copied') : t('asset.qr.copy')}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button type="button" size="sm" onClick={downloadPng}>
              {t('asset.qr.download')}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={printQr}>
              {t('asset.qr.print')}
            </Button>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
              <Button type="button" size="sm" variant="ghost">
                {t('asset.qr.open')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

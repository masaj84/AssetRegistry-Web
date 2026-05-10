import type { ReactNode } from 'react';

interface AiSoonCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  variant?: 'public' | 'admin';
}

/**
 * Visual placeholder for an AI feature on the roadmap (see AssetRegistry-Docs/AI_FEATURES.md).
 * Shows prospects what's coming without implementing the logic yet.
 * Visually distinct from regular cards via dashed border + "Wkrótce" badge.
 */
export function AiSoonCard({ title, description, icon, variant = 'admin' }: AiSoonCardProps) {
  const isPublic = variant === 'public';

  return (
    <div
      className={
        isPublic
          ? 'border border-dashed rounded-lg p-5 bg-orange-50/30 dark:bg-orange-950/10 relative overflow-hidden'
          : 'border border-dashed border-border p-5 bg-foreground/[0.02] relative overflow-hidden'
      }
      style={
        isPublic
          ? {
              borderColor: '#E6734740',
              backgroundColor: '#E6734708',
              borderRadius: '12px 8px 14px 10px',
            }
          : undefined
      }
    >
      {/* "Wkrótce — AI" ribbon */}
      <div
        className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-mono font-semibold tracking-widest uppercase"
        style={{
          backgroundColor: '#E67347',
          color: '#FFF',
          borderRadius: '0 8px 0 6px',
          letterSpacing: '0.14em',
        }}
      >
        Wkrótce · AI
      </div>

      <div className="flex items-start gap-3 pr-20">
        {icon && (
          <div className="flex-shrink-0 mt-0.5 opacity-60" style={{ color: '#E67347' }}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-medium mb-1.5"
            style={{ color: isPublic ? '#3C3835' : undefined, opacity: isPublic ? 0.85 : 1 }}
          >
            {title}
          </h3>
          <p className="text-xs leading-relaxed opacity-65">{description}</p>
        </div>
      </div>
    </div>
  );
}

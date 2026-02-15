import { Badge } from '../../components/ui/Badge';

const plannedFeatures = [
  {
    title: 'Value Report',
    description: 'Total asset value breakdown by category',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Depreciation',
    description: 'Asset value loss analysis over time',
    icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
  },
  {
    title: 'Service Costs',
    description: 'Maintenance and repair cost breakdown',
    icon: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  },
  {
    title: 'Assignments',
    description: 'Assets assigned to team members',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    title: 'Data Export',
    description: 'Export to PDF, Excel and CSV formats',
    icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  },
  {
    title: 'Service Schedule',
    description: 'Calendar of planned inspections and services',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  },
];

export function ReportsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light mb-1">Reports</h1>
        <p className="text-muted-foreground">Analytics and asset summaries</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="border border-border dark:border-border/50 relative overflow-hidden dark:glow-mixed">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative py-16 px-6 text-center">
          <div className="w-20 h-20 border border-border dark:border-purple/40 flex items-center justify-center mx-auto mb-6 dark:bg-purple/10">
            <svg className="w-10 h-10 text-muted-foreground dark:text-purple-light" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>

          <Badge variant="default" className="mb-4">
            Coming Soon
          </Badge>

          <h2 className="text-2xl font-light mb-3 text-gradient">Reports module in development</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We're working on advanced reports and visualizations. You'll be able to generate
            asset value summaries, maintenance costs, depreciation analysis and more.
          </p>

          {/* Visual indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-2 h-2 bg-foreground/20 dark:bg-orange/30 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-foreground/40 dark:bg-magenta/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-foreground/60 dark:bg-purple/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Planned Features Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-light">Planned Features</h2>
          <p className="text-sm text-muted-foreground mt-1">What's coming to the reports module</p>
        </div>
        <div className="text-xs text-muted-foreground border border-border dark:border-border/50 px-3 py-1.5">
          {plannedFeatures.length} features planned
        </div>
      </div>

      {/* Planned Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plannedFeatures.map((feature, index) => (
          <div
            key={feature.title}
            className="border border-border dark:border-border/50 p-6 opacity-60 hover:opacity-80 transition-all group card-hover-glow"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-border dark:border-border/50 flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover:border-foreground/30 dark:group-hover:border-purple/40 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d={feature.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>

            {/* Feature number */}
            <div className="mt-4 pt-4 border-t border-border dark:border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">
                Feature #{String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-xs text-muted-foreground">
                Planned
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Section */}
      <div className="border border-border dark:border-orange/20 p-6 bg-foreground/[0.02] dark:bg-orange/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border border-border dark:border-orange/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-muted-foreground dark:text-orange" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Have suggestions?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We're building this for you. Let us know what reports and analytics would be most valuable for your use case.
            </p>
            <a
              href="mailto:hello@truvalue.co?subject=Reports Feature Suggestion"
              className="inline-flex items-center gap-2 text-sm text-foreground dark:text-orange hover:underline"
            >
              Send feedback
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

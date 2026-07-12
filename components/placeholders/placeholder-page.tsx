import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export type PlaceholderCard = {
  title: string;
  description: string;
  badge?: string;
  href?: string;
  icon?: React.ElementType;
};

export type PlaceholderPageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string }>;
  cards?: PlaceholderCard[];
  cta?: {
    label: string;
    href: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
  children?: React.ReactNode;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  stats,
  cards,
  cta,
  children,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-white py-16 text-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-gray-200 bg-linear-to-br from-[#0070f3]/8 to-[#7928ca]/8 p-8 sm:p-12">
          <div className="max-w-3xl">
            {eyebrow ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#0070f3]" />
                {eyebrow}
              </div>
            ) : null}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 text-lg leading-8 text-gray-600">{description}</p>
          </div>

          {stats && stats.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {cards && cards.length > 0 ? (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {card.badge ? (
                        <span className="mb-3 inline-flex rounded-full bg-[#0070f3]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0070f3]">
                          {card.badge}
                        </span>
                      ) : null}
                      <h2 className="text-xl font-semibold text-gray-900">{card.title}</h2>
                    </div>
                    {Icon ? <Icon className="h-6 w-6 text-[#0070f3]" /> : null}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{card.description}</p>
                  {card.href ? (
                    <Link href={card.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0070f3] transition-colors hover:text-[#7928ca]">
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </section>
        ) : null}

        {children}

        {cta ? (
          <section className="rounded-3xl bg-black px-8 py-10 text-white sm:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Ready to take the next step?</h2>
                <p className="mt-2 text-sm text-gray-300">Join Tech Rise Africa and help shape the next generation of builders.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={cta.href} className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100">
                  {cta.label}
                </Link>
                {cta.secondaryLabel && cta.secondaryHref ? (
                  <Link href={cta.secondaryHref} className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    {cta.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

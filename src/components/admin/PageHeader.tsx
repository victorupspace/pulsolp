import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-ink-200 pb-5 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <h1 className="text-[22px] font-bold leading-[1.2] tracking-[-0.015em] text-ink-900">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-[640px] text-[13px] leading-[1.55] text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

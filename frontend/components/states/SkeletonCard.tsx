export function SkeletonCard() {
  return (
    <div className="card-surface h-[430px] animate-pulse overflow-hidden">
      <div className="h-44 bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-44 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-20 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

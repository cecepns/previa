import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Tidak ada data', description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="rounded-full bg-slate-100 p-4">
        <Inbox className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="font-medium text-slate-700">{title}</h3>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}

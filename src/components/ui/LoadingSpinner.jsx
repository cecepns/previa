import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Memuat...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

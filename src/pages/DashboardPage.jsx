import { useEffect, useState } from 'react';
import { Users, HelpCircle, BookOpen, Video } from 'lucide-react';
import { getRequest, getErrorMessage } from '@/utils/request';
import { API_ENDPOINTS } from '@/utils/endpoints';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const statCards = [
  { key: 'users', label: 'Total Users', icon: Users, color: 'bg-blue-500' },
  { key: 'quizQuestions', label: 'Pertanyaan Kuis', icon: HelpCircle, color: 'bg-amber-500' },
  { key: 'literacyTopics', label: 'Topik Literasi', icon: BookOpen, color: 'bg-emerald-500' },
  { key: 'senamOtakVideos', label: 'Video Senam Otak', icon: Video, color: 'bg-violet-500' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getRequest(API_ENDPOINTS.ADMIN.DASHBOARD_STATS);
        setStats(result.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Ringkasan data aplikasi PREVIA</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-800">{stats?.[key] ?? 0}</p>
              </div>
              <div className={`rounded-xl p-3 text-white ${color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

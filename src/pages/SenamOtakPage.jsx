import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import useDataTable from '@/hooks/useDataTable';
import { postRequest, putRequest, deleteRequest, getErrorMessage } from '@/utils/request';
import { API_ENDPOINTS } from '@/utils/endpoints';
import { confirmDelete } from '@/utils/toast';
import SearchInput from '@/components/ui/SearchInput';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';

const emptyForm = {
  youtubeId: '',
  title: '',
  channel: '',
  duration: '',
  sortOrder: 0,
};

export default function SenamOtakPage() {
  const table = useDataTable({ endpoint: API_ENDPOINTS.ADMIN.SENAM_OTAK.LIST });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      youtubeId: item.youtubeId,
      title: item.title,
      channel: item.channel || '',
      duration: item.duration || '',
      sortOrder: item.sortOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.youtubeId.trim() || !form.title.trim()) {
      toast.error('YouTube ID dan judul wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await putRequest(API_ENDPOINTS.ADMIN.SENAM_OTAK.DETAIL(editing.id), form);
        toast.success('Video berhasil diperbarui');
      } else {
        await postRequest(API_ENDPOINTS.ADMIN.SENAM_OTAK.LIST, form);
        toast.success('Video berhasil ditambahkan');
      }
      setModalOpen(false);
      table.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = await confirmDelete(`Hapus video "${item.title}"?`);
    if (!confirmed) return;
    try {
      await deleteRequest(API_ENDPOINTS.ADMIN.SENAM_OTAK.DETAIL(item.id));
      toast.success('Video berhasil dihapus');
      table.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Senam Otak</h2>
          <p className="text-sm text-slate-500">Kelola video senam otak dari YouTube</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus size={18} />
          Tambah Video
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <SearchInput
            value={table.search}
            onChange={table.setSearch}
            placeholder="Cari judul, channel, atau YouTube ID..."
          />
        </div>

        {table.loading ? (
          <LoadingSpinner />
        ) : table.error ? (
          <div className="p-4 text-sm text-red-600">{table.error}</div>
        ) : table.data.length === 0 ? (
          <EmptyState title="Belum ada video" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">YouTube ID</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Durasi</th>
                  <th className="px-4 py-3">Urutan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://youtube.com/watch?v=${item.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {item.youtubeId}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{item.channel || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{item.duration || '-'}</td>
                    <td className="px-4 py-3 text-slate-500">{item.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!table.loading && table.data.length > 0 && (
          <Pagination
            page={table.pagination.page}
            totalPages={table.pagination.totalPages}
            limit={table.limit}
            limitOptions={table.limitOptions}
            total={table.pagination.total}
            onPageChange={table.setPage}
            onLimitChange={table.setLimit}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Video' : 'Tambah Video'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">YouTube Video ID</label>
            <input
              className="input-field"
              value={form.youtubeId}
              onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
              placeholder="dQw4w9WgXcQ"
              required
            />
            <p className="mt-1 text-xs text-slate-400">
              ID dari URL youtube.com/watch?v=<strong>ID</strong>
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Judul</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Channel</label>
              <input
                className="input-field"
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Durasi</label>
              <input
                className="input-field"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="10 min"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Urutan</label>
            <input
              type="number"
              className="input-field"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

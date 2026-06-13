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

const emptyForm = { title: '', readMinutes: 3, content: '' };

export default function LiteracyPage() {
  const table = useDataTable({ endpoint: API_ENDPOINTS.ADMIN.LITERACY.LIST });
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
      title: item.title,
      readMinutes: item.readMinutes || 3,
      content: item.content || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Judul wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await putRequest(API_ENDPOINTS.ADMIN.LITERACY.DETAIL(editing.id), form);
        toast.success('Topik berhasil diperbarui');
      } else {
        await postRequest(API_ENDPOINTS.ADMIN.LITERACY.LIST, form);
        toast.success('Topik berhasil ditambahkan');
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
    const confirmed = await confirmDelete(`Hapus topik "${item.title}"?`);
    if (!confirmed) return;
    try {
      await deleteRequest(API_ENDPOINTS.ADMIN.LITERACY.DETAIL(item.id));
      toast.success('Topik berhasil dihapus');
      table.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Literasi</h2>
          <p className="text-sm text-slate-500">Kelola topik literasi demensia</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus size={18} />
          Tambah Topik
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <SearchInput
            value={table.search}
            onChange={table.setSearch}
            placeholder="Cari judul atau konten..."
          />
        </div>

        {table.loading ? (
          <LoadingSpinner />
        ) : table.error ? (
          <div className="p-4 text-sm text-red-600">{table.error}</div>
        ) : table.data.length === 0 ? (
          <EmptyState title="Belum ada topik literasi" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Judul</th>
                  <th className="px-4 py-3">Waktu Baca</th>
                  <th className="px-4 py-3">Konten</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3 text-slate-500">{item.readMinutes} menit</td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-2 text-slate-500">{item.content}</p>
                    </td>
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
        title={editing ? 'Edit Topik' : 'Tambah Topik'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Judul</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Waktu Baca (menit)</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.readMinutes}
              onChange={(e) => setForm({ ...form, readMinutes: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Konten</label>
            <textarea
              className="input-field min-h-[200px]"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
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

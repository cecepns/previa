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

const emptyForm = { name: '', email: '', password: '' };

export default function UsersPage() {
  const table = useDataTable({ endpoint: API_ENDPOINTS.ADMIN.USERS.LIST });
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
    setForm({ name: item.name, email: item.email, password: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Nama dan email wajib diisi');
      return;
    }
    if (!editing && !form.password) {
      toast.error('Password wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await putRequest(API_ENDPOINTS.ADMIN.USERS.DETAIL(editing.id), payload);
        toast.success('User berhasil diperbarui');
      } else {
        await postRequest(API_ENDPOINTS.ADMIN.USERS.LIST, form);
        toast.success('User berhasil ditambahkan');
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
    const confirmed = await confirmDelete(`Hapus user "${item.name}"?`);
    if (!confirmed) return;
    try {
      await deleteRequest(API_ENDPOINTS.ADMIN.USERS.DETAIL(item.id));
      toast.success('User berhasil dihapus');
      table.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Users</h2>
          <p className="text-sm text-slate-500">Kelola pengguna aplikasi PREVIA</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus size={18} />
          Tambah User
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <SearchInput
            value={table.search}
            onChange={table.setSearch}
            placeholder="Cari nama atau email..."
          />
        </div>

        {table.loading ? (
          <LoadingSpinner />
        ) : table.error ? (
          <div className="p-4 text-sm text-red-600">{table.error}</div>
        ) : table.data.length === 0 ? (
          <EmptyState title="Belum ada user" description="Tambahkan user baru untuk memulai" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Terdaftar</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.email}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'}
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
        title={editing ? 'Edit User' : 'Tambah User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Nama</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Password {editing && <span className="text-slate-400">(kosongkan jika tidak diubah)</span>}
            </label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editing}
              minLength={6}
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

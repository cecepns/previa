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
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOption: 'A',
  explanation: '',
  sortOrder: 0,
};

export default function QuizPage() {
  const table = useDataTable({ endpoint: API_ENDPOINTS.ADMIN.QUIZ.LIST });
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
      questionText: item.questionText,
      optionA: item.optionA,
      optionB: item.optionB,
      optionC: item.optionC,
      optionD: item.optionD,
      correctOption: item.correctOption,
      explanation: item.explanation || '',
      sortOrder: item.sortOrder || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.questionText.trim() || !form.optionA || !form.optionB || !form.optionC || !form.optionD) {
      toast.error('Semua field pertanyaan wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await putRequest(API_ENDPOINTS.ADMIN.QUIZ.DETAIL(editing.id), form);
        toast.success('Pertanyaan berhasil diperbarui');
      } else {
        await postRequest(API_ENDPOINTS.ADMIN.QUIZ.LIST, form);
        toast.success('Pertanyaan berhasil ditambahkan');
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
    const confirmed = await confirmDelete('Hapus pertanyaan kuis ini?');
    if (!confirmed) return;
    try {
      await deleteRequest(API_ENDPOINTS.ADMIN.QUIZ.DETAIL(item.id));
      toast.success('Pertanyaan berhasil dihapus');
      table.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Kuis</h2>
          <p className="text-sm text-slate-500">Kelola pertanyaan kuis pengetahuan demensia</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus size={18} />
          Tambah Pertanyaan
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <SearchInput
            value={table.search}
            onChange={table.setSearch}
            placeholder="Cari pertanyaan..."
          />
        </div>

        {table.loading ? (
          <LoadingSpinner />
        ) : table.error ? (
          <div className="p-4 text-sm text-red-600">{table.error}</div>
        ) : table.data.length === 0 ? (
          <EmptyState title="Belum ada pertanyaan" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Pertanyaan</th>
                  <th className="px-4 py-3">Jawaban Benar</th>
                  <th className="px-4 py-3">Urutan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="max-w-md px-4 py-3">
                      <p className="line-clamp-2 font-medium">{item.questionText}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                        {item.correctOption}
                      </span>
                    </td>
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
        title={editing ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Pertanyaan</label>
            <textarea
              className="input-field min-h-[80px]"
              value={form.questionText}
              onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt}>
                <label className="mb-1 block text-sm font-medium">Opsi {opt}</label>
                <input
                  className="input-field"
                  value={form[`option${opt}`]}
                  onChange={(e) => setForm({ ...form, [`option${opt}`]: e.target.value })}
                  required
                />
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Jawaban Benar</label>
              <select
                className="input-field"
                value={form.correctOption}
                onChange={(e) => setForm({ ...form, correctOption: e.target.value })}
              >
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
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
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Penjelasan</label>
            <textarea
              className="input-field min-h-[60px]"
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
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

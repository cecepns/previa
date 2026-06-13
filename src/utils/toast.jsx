import toast from 'react-hot-toast';

export function confirmDelete(message = 'Yakin ingin menghapus data ini?') {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-800">{message}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-danger px-3 py-1.5 text-xs"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
            >
              Hapus
            </button>
            <button
              type="button"
              className="btn-secondary px-3 py-1.5 text-xs"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
            >
              Batal
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
}

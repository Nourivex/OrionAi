import React from 'react';

interface SidebarModalsProps {
  editModal: { open: boolean; chat: any | null };
  setEditModal: (modal: { open: boolean; chat: any | null }) => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
  handleEditSave: () => void;
  shareModal: { open: boolean; chat: any | null };
  setShareModal: (modal: { open: boolean; chat: any | null }) => void;
  handleShare: () => void;
  deleteModal: { open: boolean; chat: any | null };
  setDeleteModal: (modal: { open: boolean; chat: any | null }) => void;
  handleDelete: () => void;
}

const SidebarModals: React.FC<SidebarModalsProps> = ({
  editModal,
  setEditModal,
  editTitle,
  setEditTitle,
  handleEditSave,
  shareModal,
  setShareModal,
  handleShare,
  deleteModal,
  setDeleteModal,
  handleDelete,
}) => {
  return (
    <>
      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-base font-bold text-theme-text mb-3">Edit Title</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-primary-dark/10 rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary/30"
              placeholder="Enter new title..."
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditModal({ open: false, chat: null })}
                className="px-3 py-1.5 text-sm text-theme-text/70 hover:text-theme-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1.5 text-sm bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-base font-bold text-theme-text mb-2">Share Link</h2>
            <p className="text-xs text-theme-text/60 mb-3">Copy link to share this conversation.</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/chat/${shareModal.chat?.id}`}
                className="flex-1 px-3 py-2 bg-theme-bg border border-theme-primary-dark/10 rounded-lg text-xs text-theme-text"
              />
              <button
                onClick={handleShare}
                className="px-3 py-1.5 text-sm bg-theme-primary text-theme-onPrimary rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setShareModal({ open: false, chat: null })}
                className="px-3 py-1.5 text-sm text-theme-text/70 hover:text-theme-text transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl ring-1 ring-theme-primary-dark/5">
            <h2 className="text-base font-semibold text-theme-text mb-2">Delete Conversation</h2>
            <p className="text-sm text-theme-text/70 mb-4">
              Are you sure you want to delete
              <span className="font-medium text-theme-text"> "{deleteModal.chat?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, chat: null })}
                className="px-3 py-1.5 text-sm bg-transparent border border-theme-primary-dark/10 text-theme-text rounded-lg hover:bg-theme-surface/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarModals;

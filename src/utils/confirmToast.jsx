import toast from 'react-hot-toast';

/**
 * Shows a beautiful confirmation toast with Accept / Cancel actions.
 * Returns a Promise that resolves to `true` (confirmed) or `false` (cancelled).
 *
 * @param {string} message  – The confirmation message to display
 * @param {object} options  – Optional overrides
 * @param {string} options.confirmText  – Label for the confirm button (default: "Delete")
 * @param {string} options.cancelText   – Label for the cancel button (default: "Cancel")
 * @param {string} options.icon         – Emoji / icon shown in the toast (default: "⚠️")
 */
const confirmToast = (message, {
  confirmText = 'Delete',
  cancelText = 'Cancel',
  icon = '⚠️',
} = {}) => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1f2937',
            lineHeight: 1.5,
          }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
            <span>{message}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: '#fff',
                color: '#374151',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.target.style.background = '#f3f4f6'; }}
              onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
            >
              {cancelText}
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              }}
              onMouseEnter={(e) => { e.target.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.target.style.opacity = '1'; }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          padding: '16px 20px',
          borderRadius: '14px',
          background: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          maxWidth: '420px',
          width: '100%',
        },
      }
    );
  });
};

export default confirmToast;

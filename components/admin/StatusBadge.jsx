import { STATUS_COLORS } from '@/lib/admin-shared'

export default function StatusBadge({ status }) {
  return (
    <span style={{ background: (STATUS_COLORS[status] || '#666') + '22', color: STATUS_COLORS[status] || '#666', padding: '0.2rem 0.6rem', borderRadius: '2px', fontSize: '0.72rem', fontFamily: "'DM Mono', monospace" }}>
      {status}
    </span>
  )
}

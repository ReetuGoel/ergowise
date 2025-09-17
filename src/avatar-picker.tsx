import React from 'react';
import { useAuth } from './auth-context';

const DEFAULT_AVATARS = [
  '/logo192.png',
  '/logo512.png',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23fb923c"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23ea580c"/></svg>'
];

export function AvatarPicker({ size = 36 }: { size?: number }) {
  const { user, updateUser } = useAuth();

  const setAvatar = (url: string) => {
    updateUser({ avatar: url });
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
      {DEFAULT_AVATARS.map((a, i) => (
        <button
          key={i}
          onClick={() => setAvatar(a)}
          style={{
            border: user?.avatar === a ? '2px solid var(--color-accent)' : '2px solid var(--color-surface-alt2)',
            background: user?.avatar === a ? 'var(--color-surface-alt)' : 'transparent',
            padding: 2,
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'border 0.2s, background 0.2s',
            boxShadow: user?.avatar === a ? '0 2px 8px rgba(234,88,12,0.10)' : 'none',
            outline: 'none'
          }}
        >
          <img
            src={a}
            alt={`avatar-${i}`}
            width={size}
            height={size}
            style={{
              borderRadius: '50%',
              display: 'block',
              filter: user?.avatar === a ? 'none' : 'grayscale(60%)',
              opacity: user?.avatar === a ? 1 : 0.7,
              transition: 'filter 0.2s, opacity 0.2s'
            }}
          />
        </button>
      ))}
    </div>
  );
}

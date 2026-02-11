import React from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';

import appData from '@/app.data';
import Loader2 from '@/shared/components/loaders/Loader2';

export const GlobalLoader = observer(() => {
  const rootStore = appData;
  if (!rootStore.isLoading) return null;

  return createPortal(
    <div style={overlayStyle}>
      <Loader2 />
      <p style={spinnerStyle}>Loading...</p>
    </div>,
    document.body
  );
});

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  zIndex: 9999,
};

const spinnerStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '30px',
};

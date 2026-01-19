import React from 'react';

export const styles = {
  userIconImage: {
    width: 'var(--width-mypage-profile-small)',
    height: 'var(--height-mypage-profile-small)',
    objectFit: 'contain',
  } as React.CSSProperties,

  toolbarSelect: {
    padding: 'var(--padding-xs) var(--padding-sm)',
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: 'var(--font-size-sm)',
    backgroundColor: 'var(--color-white)',
  } as React.CSSProperties,

  colorPickerInput: {
    width: 'var(--width-mypage-icon-xs)',
    height: 'var(--height-mypage-icon-xs)',
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
  } as React.CSSProperties,

  copyIcon: {
    fontSize: 'var(--font-size-mypage-md)',
  } as React.CSSProperties,

  closeIcon: {
    fontSize: 'var(--font-size-mypage-lg)',
  } as React.CSSProperties,

  addIconLarge: {
    fontSize: 'var(--font-size-mypage-6xl)',
    color: 'var(--color-gray-400)',
  } as React.CSSProperties,

  addIconSmall: {
    fontSize: 'var(--font-size-mypage-xl)',
  } as React.CSSProperties,

  introMessageContainer: {
    marginTop: 'var(--padding-xl)',
  } as React.CSSProperties,
};

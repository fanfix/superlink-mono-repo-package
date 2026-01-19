import React from 'react';
import { Box, IconButton, OutlinedInput } from '@mui/material';
import { Typography } from '@superline/design-system';
import { InsertEmoticon, FormatColorFill } from '@mui/icons-material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { styles } from './styles';

interface TitleInputProps {
  value: string;
  color: string;
  showEmojiPicker: boolean;
  colorPickerRef: React.RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onEmojiClick: (emoji: EmojiClickData) => void;
  onToggleEmojiPicker: () => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({
  value,
  color,
  showEmojiPicker,
  colorPickerRef,
  onChange,
  onColorChange,
  onToggleEmojiPicker,
  onEmojiClick,
}) => {
  const inputWrapperStyles = {
    position: 'relative',
    width: '100%',
  };

  const iconButtonsContainerStyles = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    zIndex: 10,
  };

  const emojiPickerContainerStyles = {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    zIndex: 1001,
    marginBottom: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden',
  };
  return (
    <Box>
      <Typography sx={styles.label}>Title</Typography>
      <Box sx={inputWrapperStyles}>
        <OutlinedInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Title"
          sx={styles.titleInput(color)}
          fullWidth
        />
        <Box sx={iconButtonsContainerStyles}>
          <Box sx={styles.emojiPickerWrapper} data-emoji-picker>
            <IconButton size="small" onClick={onToggleEmojiPicker} sx={styles.emojiButton(showEmojiPicker)}>
              <InsertEmoticon sx={styles.emojiIcon} />
            </IconButton>
            {showEmojiPicker && (
              <Box
                data-emoji-picker
                sx={emojiPickerContainerStyles}
                onClick={(e) => e.stopPropagation()}
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={280}
                  height={320}
                  previewConfig={{ showPreview: false }}
                  searchDisabled={false}
                  skinTonesDisabled={true}
                />
              </Box>
            )}
          </Box>
          <Box sx={styles.colorPickerWrapper}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                colorPickerRef.current?.click();
              }}
              sx={styles.emojiButton(false)}
            >
              <FormatColorFill sx={styles.colorIcon} />
            </IconButton>
            <input
              ref={colorPickerRef}
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                zIndex: 11,
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};


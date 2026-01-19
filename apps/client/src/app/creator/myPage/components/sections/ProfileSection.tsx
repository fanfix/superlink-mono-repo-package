'use client';

import React, { useState, useEffect } from 'react';
import { Box, IconButton, OutlinedInput } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import CollapsibleSection from '../shared/CollapsibleSection';
import TextOptionsSection from './TextOptionsSection';
import PageLayoutSection from './PageLayoutSection';
import BackgroundColorSection from './BackgroundColorSection';
import BackgroundImageSection from './BackgroundImageSection';
import VerifiedCreatorModal from '../modals/VerifiedCreatorModal';
import ImageCropModal from '../modals/ImageCropModal';
import {
  Close as CloseIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Subscript,
  Superscript,
  FormatQuote,
  Link as LinkIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import SubScript from '@tiptap/extension-subscript';
import SuperscriptExtension from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import { styles } from './ProfileSectionStyles';
import { sharedModalStyles } from '../shared/modalStyles';

interface ProfileSectionProps {
  pageUrl: string;
  coverImage?: string;
  profileImage?: string;
  pageName: string;
  introMessage: string;
  selectedFont?: string;
  selectedTextColor?: string;
  selectedLayout?: 'layout1' | 'layout2';
  backgroundColor?: string;
  backgroundImage?: string;
  onPageUrlChange: (url: string) => void;
  onCoverImageChange: (fileOrUrl: File | string) => void;
  onProfileImageChange: (fileOrUrl: File | string) => void;
  onPageNameChange: (name: string) => void;
  onIntroMessageChange: (message: string) => void;
  onFontChange?: (font: string) => void;
  onTextColorChange?: (color: string) => void;
  onLayoutChange?: (layout: 'layout1' | 'layout2') => void;
  onBackgroundColorChange?: (color: string) => void;
  onBackgroundImageChange?: (fileOrUrl: File | string) => void;
}

export default function ProfileSection({
  pageUrl,
  coverImage,
  profileImage,
  pageName,
  introMessage,
  selectedFont = 'Aktiv Grotesk Extended',
  selectedTextColor = 'var(--color-mypage-text-black)',
  selectedLayout = 'layout1',
  backgroundColor = 'var(--color-mypage-background-white)',
  backgroundImage,
  onPageUrlChange,
  onCoverImageChange,
  onProfileImageChange,
  onPageNameChange,
  onIntroMessageChange,
  onFontChange,
  onTextColorChange,
  onLayoutChange,
  onBackgroundColorChange,
  onBackgroundImageChange,
}: ProfileSectionProps) {
  const [selectedFontSize, setSelectedFontSize] = useState('Normal');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('var(--color-mypage-background-yellow-highlight)');
  const [isVerifiedCreatorModalOpen, setIsVerifiedCreatorModalOpen] = useState(false);
  
  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [cropImageType, setCropImageType] = useState<'profile' | 'banner' | null>(null);

  // Tiptap Editor Setup
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Underline,
      SubScript,
      SuperscriptExtension,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
    ],
    content: introMessage,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      if (text.length <= 500) {
        onIntroMessageChange(html);
      } else {
        editor.commands.setContent(introMessage);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && introMessage !== editor.getHTML()) {
      editor.commands.setContent(introMessage);
    }
  }, [introMessage, editor]);

  const urlContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    marginBottom: 'var(--padding-xl)',
  };

  const urlInputWrapperStyles = {
    flex: 1,
    position: 'relative' as const,
  };

  const enableMessagingButtonStyles = {
    width: '100%',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: 'var(--padding-lg)',
    '&:hover': {
      backgroundColor: 'var(--color-mypage-text-dark-alt)',
    },
  };

  const urlPrefixStyles = {
    position: 'absolute' as const,
    left: 'var(--padding-mypage-2xl)',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-gray-500)',
    zIndex: 1,
    pointerEvents: 'none' as const,
    borderRight: '1px solid var(--color-gray-200)',
    paddingRight: 'var(--padding-md)',
  };

  const urlInputStyles = {
    ...sharedModalStyles.input,
    '& .MuiOutlinedInput-input': {
      ...sharedModalStyles.input['& .MuiOutlinedInput-input'],
      paddingLeft: 'var(--width-mypage-profile-container)',
    },
  };

  const copyButtonStyles = {
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    borderRadius: 'var(--border-radius-full)',
    padding: 'var(--padding-sm) var(--padding-lg)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'uppercase' as const,
    minWidth: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-xs)',
    '&:hover': {
      backgroundColor: 'var(--color-mypage-text-dark-alt)',
    },
  };

  const coverImageContainerStyles = {
    position: 'relative' as const,
    width: '100%',
    height: 'var(--height-mypage-profile-container)',
    borderRadius: 'var(--border-radius-lg)',
    overflow: 'hidden' as const,
    marginBottom: 'var(--padding-xl)',
    backgroundColor: 'var(--color-gray-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  const coverImageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  };

  const removeCoverButtonStyles = {
    position: 'absolute' as const,
    top: 'var(--padding-md)',
    right: 'var(--padding-md)',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    width: 'var(--width-mypage-profile-tiny)',
    height: 'var(--height-mypage-profile-tiny)',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'var(--color-white)',
    },
  };

  const profileImageContainerStyles = {
    position: 'relative' as const,
    width: 'var(--width-mypage-profile-container)',
    height: 'var(--width-mypage-profile-container)',
    margin: '0 auto',
    marginTop: '-60px',
    marginBottom: 'var(--padding-xl)',
  };

  const profileImageStyles = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    backgroundColor: 'var(--color-gray-200)',
  };

  const addProfileButtonStyles = {
    position: 'absolute' as const,
    bottom: '0',
    right: '0',
    top: '-4.5px',
    backgroundColor: 'var(--color-black)',
    color: 'var(--color-white)',
    width: 'var(--width-mypage-profile-xxs)',
    height: 'var(--height-mypage-profile-xxs)',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'var(--color-mypage-text-dark-alt)',
    },
  };

  const pageNameLabelStyles = {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-black)',
    marginBottom: 'var(--padding-sm)',
  };

  const pageNameInputStyles = {
    width: '100%',
    '& .MuiOutlinedInput-input': {
      fontSize: 'var(--font-size-md-1)',
      color: 'var(--color-gray-800)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-200)',
    },
  };

  const introMessageLabelStyles = {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    marginBottom: 'var(--padding-md)',
    color: 'var(--color-black)',
  };

  const toolbarStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-xs)',
    padding: 'var(--padding-sm)',
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: 'var(--padding-md)',
    flexWrap: 'wrap' as const,
    backgroundColor: 'var(--color-white)',
  };

  const toolbarButtonStyles = {
    minWidth: 'auto',
    padding: 'var(--padding-xs)',
    color: 'var(--color-gray-700)',
    '&:hover': {
      backgroundColor: 'var(--color-gray-100)',
    },
  };

  const editorContainerStyles = {
    border: '1px solid var(--color-gray-200)',
    borderRadius: 'var(--border-radius-md)',
    minHeight: 'var(--width-mypage-profile-container)',
    padding: 'var(--padding-md)',
    '& .ProseMirror': {
      outline: 'none',
      minHeight: 'var(--padding-mypage-14xl)',
      fontSize: 'var(--font-size-md-1)',
      fontFamily: 'inherit',
      '& p.is-editor-empty:first-of-type::before': {
        content: '"Tell others about yourself."',
        float: 'left',
        color: 'var(--color-gray-400)',
        pointerEvents: 'none',
        height: 0,
      },
      '& p': {
        margin: '0.5em 0',
      },
      '& h1': {
        fontSize: '2em',
        fontWeight: 'bold',
        margin: '0.5em 0',
      },
      '& h2': {
        fontSize: '1.5em',
        fontWeight: 'bold',
        margin: '0.5em 0',
      },
      '& h3': {
        fontSize: '1.17em',
        fontWeight: 'bold',
        margin: '0.5em 0',
      },
      '& blockquote': {
        borderLeft: 'var(--border-mypage-width-md) solid var(--color-mypage-text-gray-border)',
        paddingLeft: '1em',
        margin: '1em 0',
        fontStyle: 'italic',
      },
      '& a': {
        color: 'var(--color-mypage-background-blue-link)',
        textDecoration: 'underline',
      },
    },
  };

  const characterCountStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-500)',
    textAlign: 'right' as const,
    marginTop: 'var(--padding-xs)',
  };

  const pageUrlLabelStyles = {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-medium)',
    marginBottom: 'var(--padding-sm)',
    color: 'var(--color-black)',
  };

  const coverImageUploadLabelStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  const emptyProfileImageStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-gray-200)',
  };

  const highlightColorBoxStyles = {
    width: 'var(--width-mypage-icon-xxs)',
    height: 'var(--height-mypage-icon-xxs)',
    borderRadius: 'var(--border-radius-sm)',
  };

  const sectionTitleStyles = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    marginBottom: 'var(--padding-xl)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const backgroundOptionsContainerStyles = {
    marginTop: 'var(--padding-3xl)',
    display: 'flex',
    gap: 'var(--padding-xl)',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`superlink.io/${pageUrl}`);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Open crop modal for banner image (16:9 aspect ratio for banner)
      setSelectedImageFile(file);
      setCropImageType('banner');
      setCropModalOpen(true);
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Open crop modal for profile image (1:1 aspect ratio for circular profile)
      setSelectedImageFile(file);
      setCropImageType('profile');
      setCropModalOpen(true);
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleCropSave = (croppedFile: File) => {
    if (cropImageType === 'profile') {
      onProfileImageChange(croppedFile);
    } else if (cropImageType === 'banner') {
      onCoverImageChange(croppedFile);
    }
    setCropModalOpen(false);
    setSelectedImageFile(null);
    setCropImageType(null);
  };

  const handleCropClose = () => {
    setCropModalOpen(false);
    setSelectedImageFile(null);
    setCropImageType(null);
  };

  return (
    <CollapsibleSection title="PROFILE" defaultExpanded={true}>
      <Box>
        <Typography sx={pageUrlLabelStyles}>Your Page URL</Typography>
        <Box sx={urlContainerStyles}>
          <Box sx={urlInputWrapperStyles}>
            <Typography sx={urlPrefixStyles}>superlink.io/</Typography>
            <OutlinedInput
              value={pageUrl}
              onChange={(e) => onPageUrlChange(e.target.value)}
              sx={urlInputStyles}
              placeholder="username"
            />
          </Box>
          <Button variant="primary-dark" onClick={handleCopyUrl} sx={copyButtonStyles}>
            <CopyIcon sx={styles.copyIcon} />
            COPY URL
          </Button>
        </Box>
      </Box>

      <Box sx={coverImageContainerStyles}>
        {coverImage ? (
          <>
            <img src={coverImage} alt="Cover" style={coverImageStyles} />
            <IconButton sx={removeCoverButtonStyles} onClick={() => onCoverImageChange('')} size="small">
              <CloseIcon sx={styles.closeIcon} />
            </IconButton>
          </>
        ) : (
          <Box component="label" sx={coverImageUploadLabelStyles}>
            <input type="file" accept="image/*" onChange={handleCoverImageUpload} style={{ display: 'none' }} />
            <AddIcon sx={styles.addIconLarge} />
          </Box>
        )}
      </Box>

      <Box sx={profileImageContainerStyles}>
        {profileImage ? (
          <img src={profileImage} alt="Profile" style={profileImageStyles} />
        ) : (
          <Box
            sx={{
              ...profileImageStyles,
              ...emptyProfileImageStyles,
            }}
          >
            <img
              src="/assets/Client/user_icon.svg"
              alt="User Icon"
              style={styles.userIconImage}
            />
          </Box>
        )}
        <IconButton component="label" sx={addProfileButtonStyles} size="small">
          <input type="file" accept="image/*" onChange={handleProfileImageUpload} style={{ display: 'none' }} />
          <AddIcon sx={styles.addIconSmall} />
        </IconButton>
      </Box>

      <Box>
        <Typography sx={pageNameLabelStyles}>Page Name</Typography>
        <OutlinedInput value={pageName} onChange={(e) => onPageNameChange(e.target.value)} placeholder="Page Name" sx={pageNameInputStyles} />
      </Box>

      {editor && (
        <Box sx={styles.introMessageContainer}>
          <Typography sx={introMessageLabelStyles}>Intro Message</Typography>

          <Box sx={toolbarStyles}>
            <select
              value={selectedFontSize}
              onChange={(e) => {
                setSelectedFontSize(e.target.value);
                const level = e.target.value === 'Heading 1' ? 1 : e.target.value === 'Heading 2' ? 2 : e.target.value === 'Heading 3' ? 3 : null;
                if (level) {
                  editor.chain().focus().toggleHeading({ level }).run();
                } else {
                  editor.chain().focus().setParagraph().run();
                }
              }}
              style={styles.toolbarSelect}
            >
              <option>Normal</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Heading 3</option>
            </select>

            <select
              onChange={(e) => {
                const size = e.target.value;
                editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
              }}
              style={styles.toolbarSelect}
            >
              <option>12px</option>
              <option>14px</option>
              <option>16px</option>
              <option>18px</option>
              <option>20px</option>
            </select>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('bold') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBold fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('italic') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalic fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('underline') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlined fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('strike') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <StrikethroughS fontSize="small" />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-xs)' }}>
              <input
                type="color"
                value={selectedTextColor}
                onChange={(e) => {
                  onTextColorChange?.(e.target.value);
                  editor.chain().focus().setColor(e.target.value).run();
                }}
                style={styles.colorPickerInput}
              />
              <IconButton
                sx={toolbarButtonStyles}
                size="small"
                onClick={() => {
                  editor.chain().focus().toggleHighlight({ color: selectedHighlightColor }).run();
                }}
              >
                <Box
                  sx={{
                    ...highlightColorBoxStyles,
                    backgroundColor: selectedHighlightColor,
                  }}
                />
              </IconButton>
            </Box>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('subscript') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            >
              <Subscript fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('superscript') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            >
              <Superscript fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive({ textAlign: 'left' }) ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <FormatAlignLeft fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive({ textAlign: 'center' }) ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <FormatAlignCenter fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive({ textAlign: 'right' }) ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <FormatAlignRight fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('blockquote') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <FormatQuote fontSize="small" />
            </IconButton>

            <IconButton
              sx={{
                ...toolbarButtonStyles,
                ...(editor.isActive('link') ? { backgroundColor: 'var(--color-gray-200)' } : {}),
              }}
              size="small"
              onClick={() => {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                } else if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                }
              }}
            >
              <LinkIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={editorContainerStyles}>
            <EditorContent editor={editor} />
          </Box>

          <Typography sx={characterCountStyles}>{editor.getText().length}/500</Typography>
        </Box>
      )}

      <Box sx={{ marginTop: 'var(--padding-3xl)' }}>
        <Typography sx={sectionTitleStyles}>Text Options</Typography>
        <TextOptionsSection selectedFont={selectedFont} selectedColor={selectedTextColor} onFontChange={onFontChange} onColorChange={onTextColorChange} />
      </Box>

      <Box sx={{ marginTop: 'var(--padding-3xl)' }}>
        <Typography sx={sectionTitleStyles}>Page Layout</Typography>
        <PageLayoutSection selectedLayout={selectedLayout} onLayoutChange={onLayoutChange} />
      </Box>

      <Box sx={backgroundOptionsContainerStyles}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={sectionTitleStyles}>Background Color</Typography>
          <BackgroundColorSection selectedColor={backgroundColor} onColorChange={onBackgroundColorChange} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={sectionTitleStyles}>Background Image</Typography>
          <BackgroundImageSection backgroundImage={backgroundImage} onImageChange={onBackgroundImageChange} />
        </Box>
      </Box>
      <Box sx={{ marginTop: 'var(--padding-2xl)' }}>
        <Button variant="primary-dark" sx={enableMessagingButtonStyles} onClick={() => setIsVerifiedCreatorModalOpen(true)}>
          ENABLE MESSAGING
        </Button>
      </Box>

      <VerifiedCreatorModal
        open={isVerifiedCreatorModalOpen}
        onClose={() => setIsVerifiedCreatorModalOpen(false)}
        onContinue={() => {
          console.log('Continue to Stripe verification');
        }}
      />

      <ImageCropModal
        open={cropModalOpen}
        imageFile={selectedImageFile}
        aspectRatio={cropImageType === 'profile' ? 1 : cropImageType === 'banner' ? 16 / 9 : undefined}
        onClose={handleCropClose}
        onSave={handleCropSave}
        title={cropImageType === 'profile' ? 'Crop Profile Picture' : 'Crop Banner Image'}
      />
    </CollapsibleSection>
  );
}


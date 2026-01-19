'use client';

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Typography, Button } from '@superline/design-system';
import CollapsibleSection from '../shared/CollapsibleSection';
import AddCustomSectionModal from '../modals/AddCustomSectionModal';
import AddContentModal from '../modals/AddContentModal';
import AddEmbedSectionModal from '../AddEmbedSectionModal';
import AddEmailSectionModal from '../AddEmailSectionModal';
import AddTextSectionModal from '../AddTextSectionModal';
import UploadContentModal from '../UploadContentModal';
import AddEmbedModal from '../AddEmbedModal';
import { Warning as WarningIcon, Add as AddIcon, MoreVert as MoreVertIcon, Image as ImageIcon, Edit as EditIcon, DragIndicator as DragIndicatorIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { SortableContentItem } from './CustomSectionsEmbedsSection/components/SortableContentItem';
import { SortableSection } from './CustomSectionsEmbedsSection/components/SortableSection';
import type { UploadContentData } from '../UploadContentModal/types';
import type { ContentItem, CustomSection, TextSection } from '../MobilePreview/types';

interface CustomSectionsEmbedsSectionProps {
  coverImage?: string;
  contentItems?: ContentItem[];
  customSections?: CustomSection[];
  customSectionsOrder?: string[];
  textSections?: TextSection[];
  onAddContent?: (data: UploadContentData) => void;
  onUpdateContent?: (id: string, data: UploadContentData) => void;
  onDeleteContent?: (id: string) => void;
  onAddCustomSection?: (sectionName: string, layout: 'list' | 'row' | 'parallel-row', useContentImageAsBackground: boolean) => void;
  onUpdateCustomSection?: (id: string, sectionName: string, layout: 'list' | 'row' | 'parallel-row', useContentImageAsBackground: boolean) => void;
  onDeleteCustomSection?: (id: string) => void;
  onAddContentToCustomSection?: (sectionId: string, data: { thumbnail?: string; title: string; url: string; isEmail: boolean }) => void;
  onUpdateContentInCustomSection?: (sectionId: string, itemId: string, data: { thumbnail?: string; title: string; url: string; isEmail: boolean }) => void;
  onDeleteContentFromCustomSection?: (sectionId: string, itemId: string) => void;
  onReorderItemsInCustomSection?: (sectionId: string, newItems: ContentItem[]) => void;
  onReorderSections?: (sectionIds: string[]) => void;
  onAddEmbedSection?: (sectionName: string, layout: 'list' | 'row') => void;
  onAddTippingSection?: () => void;
  onAddEmailSection?: (title: string, content: string) => void;
  onUpdateEmailSection?: (id: string, title: string, content: string) => void;
  onDeleteEmailSection?: (id: string) => void;
  onAddTextSection?: (title: string, content: string) => void;
  onUpdateTextSection?: (id: string, title: string, content: string) => void;
  onDeleteTextSection?: (id: string) => void;
  onReorderTextSections?: (sectionIds: string[]) => void;
}

export default function CustomSectionsEmbedsSection({
  coverImage,
  contentItems = [],
  customSections = [],
  customSectionsOrder = ['exclusive-content'],
  textSections = [],
  onAddContent,
  onUpdateContent,
  onDeleteContent,
  onAddCustomSection,
  onUpdateCustomSection,
  onDeleteCustomSection,
  onAddContentToCustomSection,
  onUpdateContentInCustomSection,
  onDeleteContentFromCustomSection,
  onReorderItemsInCustomSection,
  onReorderSections,
  onAddEmbedSection,
  onAddTippingSection,
  onAddEmailSection,
  onUpdateEmailSection,
  onDeleteEmailSection,
  onAddTextSection,
  onUpdateTextSection,
  onDeleteTextSection,
  onReorderTextSections,
}: CustomSectionsEmbedsSectionProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEmbedSectionModalOpen, setIsEmbedSectionModalOpen] = useState(false);
  const [isCustomSectionModalOpen, setIsCustomSectionModalOpen] = useState(false);
  const [isEmailSectionModalOpen, setIsEmailSectionModalOpen] = useState(false);
  const [isTextSectionModalOpen, setIsTextSectionModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isAddEmbedModalOpen, setIsAddEmbedModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [editingContentItem, setEditingContentItem] = useState<{ sectionId: string; item: ContentItem } | null>(null);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [editingCustomSection, setEditingCustomSection] = useState<CustomSection | null>(null);
  const [editingTextSection, setEditingTextSection] = useState<TextSection | null>(null);
  const [editingEmailSection, setEditingEmailSection] = useState<TextSection | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use the provided order, or create default order with 'exclusive-content' first, then custom sections
  const allSectionIds = customSectionsOrder.length > 0 
    ? customSectionsOrder 
    : ['exclusive-content', ...customSections.map((s) => s.id)];
  
  // Ensure all current sections are in the order array
  const orderedSectionIds = [...allSectionIds];
  customSections.forEach((section) => {
    if (!orderedSectionIds.includes(section.id)) {
      orderedSectionIds.push(section.id);
    }
  });

  const handleSectionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderSections) {
      const oldIndex = orderedSectionIds.findIndex((id) => id === active.id);
      const newIndex = orderedSectionIds.findIndex((id) => id === over.id);
      const newSectionIds = arrayMove(orderedSectionIds, oldIndex, newIndex);
      onReorderSections(newSectionIds);
    }
  };

  const handleAddContent = () => {
    setEditingContent(null);
    setIsUploadModalOpen(true);
  };

  const handleEditContent = (contentItem: ContentItem) => {
    setEditingContent(contentItem);
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = (data: UploadContentData) => {
    if (editingContent && onUpdateContent) {
      onUpdateContent(editingContent.id, data);
    } else if (onAddContent) {
      onAddContent(data);
    }
    setEditingContent(null);
  };

  const handleUpdateContent = (id: string, data: UploadContentData) => {
    if (onUpdateContent) {
      onUpdateContent(id, data);
    }
    setEditingContent(null);
  };

  const handleDeleteContent = (id: string) => {
    if (onDeleteContent) {
      onDeleteContent(id);
    }
    setEditingContent(null);
  };

  // Get the first content item's image, or use coverImage as fallback
  const displayImage = contentItems.length > 0 && contentItems[0]?.imageUrl 
    ? contentItems[0].imageUrl 
    : coverImage;

  const warningAlertStyles = {
    marginBottom: 'var(--padding-lg)',
    backgroundColor: '#FEF3C7',
    border: 'none',
    borderRadius: 'var(--border-radius-md)',
    padding: 'var(--padding-md)',
    '& .MuiAlert-icon': {
      color: '#D97706',
      fontSize: '20px',
    },
    '& .MuiAlert-message': {
      width: '100%',
      padding: 0,
    },
  };

  const buttonContainerStyles = {
    display: 'grid',
    gridTemplateColumns:{ xs: '1fr', md: '1fr 1fr' },
    gap: 'var(--padding-md)',
  };

  const lightBlueButtonStyles = {
    width: '100%',
    backgroundColor: '#D6E0F5',
    color: 'var(--color-black)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    '&:hover': {
      backgroundColor: '#C5D4F0',
    },
  };

  const disabledButtonStyles = {
    ...lightBlueButtonStyles,
    backgroundColor: '#BEBEBE',
    color: 'var(--color-gray-600)',
    '&:hover': {
      backgroundColor: '#BEBEBE',
    },
    '&.Mui-disabled': {
      backgroundColor: '#BEBEBE',
      color: 'var(--color-gray-600)',
    },
  };

  const contentItemStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: 'var(--padding-md)',
    border: 'none',
    borderRadius: 'var(--border-radius-md)',
    marginBottom: 'var(--padding-lg)',
    backgroundColor: 'var(--color-gray-100)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const exclusiveContentHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--padding-md)',
  };

  const exclusiveContentTitleStyles = {
    fontWeight: 'var(--font-weight-semibold)',
    fontSize: 'var(--font-size-md-1)',
    color: 'var(--color-black)',
  };

  const contentCountStyles = {
    fontWeight: 'var(--font-weight-normal)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-600)',
  };

  const dragHandleButtonStyles = {
    color: 'var(--color-gray-500)',
    padding: '4px',
    cursor: 'grab',
    '&:active': {
      cursor: 'grabbing',
    },
  };

  const imagesContainerStyles = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--padding-sm)',
    marginBottom: 'var(--padding-md)',
  };

  const blurredImageContainerStyles = {
    width: '80px',
    height: '80px',
    borderRadius: 'var(--border-radius-sm)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    flexShrink: 0,
  };

  const blurredImageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    filter: 'blur(8px)',
    transform: 'scale(1.1)',
  };

  const centeredIconOverlayStyles = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const centeredIconStyles = {
    fontSize: '32px',
    color: '#FFFFFF',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
  };

  const addContentButtonStyles = {
    width: '100%',
    backgroundColor: '#D6E0F5',
    color: 'var(--color-black)',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    marginBottom: 'var(--padding-md)',
    '&:hover': {
      backgroundColor: '#C5D4F0',
    },
  };

  const stripeButtonStyles = {
    width: '100%',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    borderRadius: 'var(--border-radius-2xl)',
    padding: 'var(--padding-sm) var(--padding-xl)',
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    textTransform: 'none' as const,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-sm)',
    '&:hover': {
      backgroundColor: '#1a1a1a',
    },
  };

  const stripeLogoStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'Arial, sans-serif',
  };

  const customSectionItemCardStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--padding-md)',
    padding: 'var(--padding-md)',
    backgroundColor: 'var(--color-white)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--color-gray-200)',
  };

  const customSectionItemThumbnailStyles = {
    width: '60px',
    height: '60px',
    borderRadius: 'var(--border-radius-sm)',
    objectFit: 'cover' as const,
    flexShrink: 0,
    backgroundColor: 'var(--color-gray-200)',
  };

  const customSectionItemThumbnailPlaceholderStyles = {
    width: '60px',
    height: '60px',
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'var(--color-gray-200)',
    flexShrink: 0,
  };

  const customSectionItemContentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    minWidth: 0,
  };

  const customSectionItemTitleStyles = {
    fontSize: 'var(--font-size-md-1)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-black)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  };

  const customSectionItemUrlStyles = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-gray-600)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  };

  const customSectionItemDragHandleStyles = {
    color: 'var(--color-gray-500)',
    padding: '4px',
    cursor: 'grab',
    flexShrink: 0,
    '&:active': {
      cursor: 'grabbing',
    },
  };


  return (
    <CollapsibleSection title="CUSTOM SECTIONS & EMBEDS" defaultExpanded={true}>
      <Box sx={warningAlertStyles}>
        <Box sx={{ display: 'flex', gap: 'var(--padding-sm)', alignItems: 'flex-start' }}>
          <WarningIcon sx={{ color: '#D97706', fontSize: '20px', marginTop: '2px', flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--padding-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--color-black)' }}>
              PLEASE DON&apos;T UPLOAD NUDE CONTENT
            </Typography>
            <Typography sx={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)' }}>
              To keep our platform safe for everyone, uploading nude content is not allowed.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Sections with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionsDragEnd}
        id="sections-internal-dnd"
      >
        <SortableContext items={orderedSectionIds} strategy={verticalListSortingStrategy}>
          {/* Render sections in the specified order */}
          {orderedSectionIds.map((sectionId) => {
            if (sectionId === 'exclusive-content') {
              return (
                <SortableSection key={sectionId} id={sectionId}>
                  {({ dragHandleAttributes, dragHandleListeners }) => (
                    <Box sx={contentItemStyles}>
                      {/* Header with Title and Drag Handle */}
                      <Box sx={exclusiveContentHeaderStyles}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-xs)' }}>
                          <Typography sx={exclusiveContentTitleStyles}>
                            Exclusive Content
                          </Typography>
                          {contentItems.length > 0 && (
                            <Typography sx={contentCountStyles}>
                              ({contentItems.length})
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={dragHandleButtonStyles}
                          {...dragHandleAttributes}
                          {...dragHandleListeners}
                        >
                          <MoreVertIcon sx={{ fontSize: '20px', color: 'var(--color-gray-500)' }} />
                        </Box>
                      </Box>

                      {/* Images Preview Area */}
                      {contentItems.length > 0 ? (
                        <Box sx={imagesContainerStyles}>
                          {contentItems.map((item) => (
                            item.imageUrl && (
                              <Box 
                                key={item.id} 
                                sx={{ ...blurredImageContainerStyles, cursor: 'pointer' }}
                                onClick={() => handleEditContent(item)}
                              >
                                <Box component="img" src={item.imageUrl} alt={item.title || 'Exclusive Content'} sx={blurredImageStyles} />
                                <Box sx={centeredIconOverlayStyles}>
                                  <ImageIcon sx={centeredIconStyles} />
                                </Box>
                              </Box>
                            )
                          ))}
                        </Box>
                      ) : displayImage ? (
                        <Box sx={blurredImageContainerStyles}>
                          <Box component="img" src={displayImage} alt="Exclusive Content" sx={blurredImageStyles} />
                          <Box sx={centeredIconOverlayStyles}>
                            <ImageIcon sx={centeredIconStyles} />
                          </Box>
                        </Box>
                      ) : null}

                      {/* Add Content Button */}
                      <Button variant="primary-dark" onClick={handleAddContent} sx={addContentButtonStyles}>
                        <AddIcon sx={{ fontSize: '16px' }} />
                        Add Content
                      </Button>

                      {/* Stripe Button */}
                      <Button variant="primary-dark" onClick={() => {}} sx={stripeButtonStyles}>
                        <Box component="span" sx={stripeLogoStyles}>S</Box>
                        Connect Stripe and Activate Section
                      </Button>
                    </Box>
                  )}
                </SortableSection>
              );
            }
            
            // Custom section
            const section = customSections.find((s) => s.id === sectionId);
            if (!section) return null;
            
            return (
              <SortableSection key={section.id} id={section.id}>
              {({ dragHandleAttributes, dragHandleListeners }: any) => (
                <Box sx={contentItemStyles}>
                  <Box sx={exclusiveContentHeaderStyles}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-xs)' }}>
                      <Typography sx={exclusiveContentTitleStyles}>
                        {section.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-xs)' }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingCustomSection(section);
                          setIsCustomSectionModalOpen(true);
                        }}
                        sx={{ color: 'var(--color-gray-500)', padding: '4px' }}
                      >
                        <EditIcon sx={{ fontSize: '18px' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (onDeleteCustomSection) {
                            onDeleteCustomSection(section.id);
                          }
                        }}
                        sx={{ color: 'var(--color-gray-500)', padding: '4px' }}
                      >
                        <DeleteIcon sx={{ fontSize: '18px' }} />
                      </IconButton>
                      <Box
                        sx={dragHandleButtonStyles}
                        {...dragHandleAttributes}
                        {...dragHandleListeners}
                      >
                        <DragIndicatorIcon sx={{ fontSize: '20px', color: 'var(--color-gray-500)' }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Display Section Items with Drag and Drop */}
                  {section.items.length > 0 && (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event: DragEndEvent) => {
                        const { active, over } = event;
                        if (over && active.id !== over.id && onReorderItemsInCustomSection) {
                          const oldIndex = section.items.findIndex((item) => item.id === active.id);
                          const newIndex = section.items.findIndex((item) => item.id === over.id);
                          const newItems = arrayMove(section.items, oldIndex, newIndex);
                          onReorderItemsInCustomSection(section.id, newItems);
                        }
                      }}
                      id={`custom-section-items-${section.id}`}
                    >
                      <SortableContext items={section.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--padding-sm)', marginBottom: 'var(--padding-md)' }}>
                          {section.items.map((item) => (
                            <SortableContentItem
                              key={item.id}
                              item={item}
                              sectionId={section.id}
                              onEdit={(sectionId, item) => {
                                setEditingContentItem({ sectionId, item });
                                setIsAddContentModalOpen(true);
                              }}
                              onDelete={(sectionId, itemId) => {
                                if (onDeleteContentFromCustomSection) {
                                  onDeleteContentFromCustomSection(sectionId, itemId);
                                }
                              }}
                              styles={{
                                card: customSectionItemCardStyles,
                                thumbnail: customSectionItemThumbnailStyles,
                                thumbnailPlaceholder: customSectionItemThumbnailPlaceholderStyles,
                                content: customSectionItemContentStyles,
                                title: customSectionItemTitleStyles,
                                url: customSectionItemUrlStyles,
                                dragHandle: customSectionItemDragHandleStyles,
                              }}
                            />
                          ))}
                        </Box>
                      </SortableContext>
                    </DndContext>
                  )}

                  <Button
                    variant="primary-dark"
                    onClick={() => {
                      if (section.sectionType === 'embeds') {
                        setSelectedSectionId(section.id);
                        setIsAddEmbedModalOpen(true);
                      } else {
                        setSelectedSectionId(section.id);
                        setEditingContentItem(null);
                        setIsAddContentModalOpen(true);
                      }
                    }}
                    sx={addContentButtonStyles}
                  >
                    <AddIcon sx={{ fontSize: '16px' }} />
                    {section.sectionType === 'embeds' ? 'Add Embed' : 'Add Section'}
                  </Button>
                </Box>
              )}
              </SortableSection>
            );
          })}
        </SortableContext>
      </DndContext>

      {/* Display Text Sections (Email and Text) with Drag and Drop */}
      {textSections && Array.isArray(textSections) && textSections.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id && onReorderTextSections) {
              const oldIndex = textSections.findIndex((section) => section.id === active.id);
              const newIndex = textSections.findIndex((section) => section.id === over.id);
              const newSections = arrayMove(textSections, oldIndex, newIndex);
              onReorderTextSections(newSections.map((s) => s.id));
            }
          }}
          id="text-sections-dnd"
        >
          <SortableContext items={textSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {textSections.map((section) => {
              // Use type field to determine if it's an email section
              const isEmailSection = section.type === 'email' || 
                (section.type === undefined && (section.title.toLowerCase() === 'social' || section.title.toLowerCase() === 'email'));
              
              return (
                <SortableSection key={section.id} id={section.id}>
                  {({ dragHandleAttributes, dragHandleListeners }) => (
                    <Box sx={contentItemStyles}>
                      <Box sx={exclusiveContentHeaderStyles}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-xs)' }}>
                          <Typography sx={exclusiveContentTitleStyles}>
                            {section.title}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--padding-xs)' }}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (isEmailSection) {
                                setEditingEmailSection(section);
                                setIsEmailSectionModalOpen(true);
                              } else {
                                setEditingTextSection(section);
                                setIsTextSectionModalOpen(true);
                              }
                            }}
                            sx={{ color: 'var(--color-gray-500)', padding: '4px' }}
                          >
                            <EditIcon sx={{ fontSize: '18px' }} />
                          </IconButton>
                          <Box
                            sx={dragHandleButtonStyles}
                            {...dragHandleAttributes}
                            {...dragHandleListeners}
                          >
                            <DragIndicatorIcon sx={{ fontSize: '20px', color: 'var(--color-gray-500)' }} />
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ padding: 'var(--padding-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--border-radius-sm)' }}>
                        <Typography sx={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)' }}>
                          {section.content}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </SortableSection>
              );
            })}
          </SortableContext>
        </DndContext>
      )}

      <Box sx={buttonContainerStyles}>
        <Button variant="primary-dark" onClick={() => {
          setEditingCustomSection(null);
          setIsCustomSectionModalOpen(true);
        }} sx={lightBlueButtonStyles}>
          <AddIcon sx={{ fontSize: '16px' }} />
          Add Custom Section
        </Button>
        <Button variant="primary-dark" onClick={() => setIsEmbedSectionModalOpen(true)} sx={lightBlueButtonStyles}>
          <AddIcon sx={{ fontSize: '16px' }} />
          Add Embed Section
        </Button>
        <Button variant="primary-dark" onClick={onAddTippingSection} sx={disabledButtonStyles} disabled>
          <AddIcon sx={{ fontSize: '16px' }} />
          Add Tipping Section
        </Button>
        <Button variant="primary-dark" onClick={() => {
          setEditingEmailSection(null);
          setIsEmailSectionModalOpen(true);
        }} sx={lightBlueButtonStyles}>
          <AddIcon sx={{ fontSize: '16px' }} />
          Add Email Section
        </Button>
        <Button variant="primary-dark" onClick={() => {
          setEditingTextSection(null);
          setIsTextSectionModalOpen(true);
        }} sx={{ ...lightBlueButtonStyles, gridColumn: '1 / -1' }}>
          <AddIcon sx={{ fontSize: '16px' }} />
          Add Text Section
        </Button>
      </Box>

      <AddEmbedSectionModal
        open={isEmbedSectionModalOpen}
        onClose={() => setIsEmbedSectionModalOpen(false)}
        onAdd={(sectionName, layout) => {
          if (onAddEmbedSection) {
            onAddEmbedSection(sectionName, layout);
          }
        }}
      />

      <AddCustomSectionModal
        open={isCustomSectionModalOpen}
        onClose={() => {
          setIsCustomSectionModalOpen(false);
          setEditingCustomSection(null);
        }}
        editingSection={editingCustomSection}
        onAdd={(sectionName, layout, useContentImageAsBackground) => {
          if (onAddCustomSection) {
            onAddCustomSection(sectionName, layout, useContentImageAsBackground);
          }
          setIsCustomSectionModalOpen(false);
        }}
        onUpdate={(id, sectionName, layout, useContentImageAsBackground) => {
          if (onUpdateCustomSection) {
            onUpdateCustomSection(id, sectionName, layout, useContentImageAsBackground);
          }
          setIsCustomSectionModalOpen(false);
          setEditingCustomSection(null);
        }}
        onDelete={(id) => {
          if (onDeleteCustomSection) {
            onDeleteCustomSection(id);
          }
          setIsCustomSectionModalOpen(false);
          setEditingCustomSection(null);
        }}
      />

      <AddContentModal
        open={isAddContentModalOpen}
        sectionId={editingContentItem?.sectionId || selectedSectionId}
        editingItem={editingContentItem?.item}
        onClose={() => {
          setIsAddContentModalOpen(false);
          setSelectedSectionId('');
          setEditingContentItem(null);
        }}
        onAdd={(sectionId, data) => {
          if (editingContentItem && onUpdateContentInCustomSection) {
            onUpdateContentInCustomSection(sectionId, editingContentItem.item.id, data);
          } else if (onAddContentToCustomSection) {
            onAddContentToCustomSection(sectionId, data);
          }
          setIsAddContentModalOpen(false);
          setSelectedSectionId('');
          setEditingContentItem(null);
        }}
        onDelete={(sectionId, itemId) => {
          if (onDeleteContentFromCustomSection) {
            onDeleteContentFromCustomSection(sectionId, itemId);
          }
          setIsAddContentModalOpen(false);
          setEditingContentItem(null);
        }}
      />

      <AddEmailSectionModal
        open={isEmailSectionModalOpen}
        onClose={() => {
          setIsEmailSectionModalOpen(false);
          setEditingEmailSection(null);
        }}
        editingSection={editingEmailSection}
        onAdd={(data) => {
          if (onAddEmailSection) {
            onAddEmailSection(data.title, data.content);
          }
          setIsEmailSectionModalOpen(false);
          setEditingEmailSection(null);
        }}
        onUpdate={(id, data) => {
          if (onUpdateEmailSection) {
            onUpdateEmailSection(id, data.title, data.content);
          }
          setIsEmailSectionModalOpen(false);
          setEditingEmailSection(null);
        }}
        onDelete={(id) => {
          if (onDeleteEmailSection) {
            onDeleteEmailSection(id);
          }
          setIsEmailSectionModalOpen(false);
          setEditingEmailSection(null);
        }}
      />

      <AddTextSectionModal
        open={isTextSectionModalOpen}
        onClose={() => {
          setIsTextSectionModalOpen(false);
          setEditingTextSection(null);
        }}
        editingSection={editingTextSection}
        onAdd={(data) => {
          if (onAddTextSection) {
            onAddTextSection(data.title, data.content);
          }
          setIsTextSectionModalOpen(false);
          setEditingTextSection(null);
        }}
        onUpdate={(id, data) => {
          if (onUpdateTextSection) {
            onUpdateTextSection(id, data.title, data.content);
          }
          setIsTextSectionModalOpen(false);
          setEditingTextSection(null);
        }}
        onDelete={(id) => {
          if (onDeleteTextSection) {
            onDeleteTextSection(id);
          }
          setIsTextSectionModalOpen(false);
          setEditingTextSection(null);
        }}
      />

      <UploadContentModal
        open={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingContent(null);
        }}
        onAdd={handleUploadComplete}
        onUpdate={handleUpdateContent}
        onDelete={handleDeleteContent}
        editingContent={editingContent}
      />

      <AddEmbedModal
        open={isAddEmbedModalOpen}
        onClose={() => {
          setIsAddEmbedModalOpen(false);
          setSelectedSectionId(null);
        }}
        onAdd={async (data) => {
          if (selectedSectionId && onAddContentToCustomSection) {
            await onAddContentToCustomSection(selectedSectionId, {
              title: data.name,
              url: data.url,
              thumbnail: data.imageURL,
              isEmail: false,
              size: data.size,
            });
          }
          setIsAddEmbedModalOpen(false);
          setSelectedSectionId(null);
        }}
        customSectionId={selectedSectionId || ''}
      />
    </CollapsibleSection>
  );
}


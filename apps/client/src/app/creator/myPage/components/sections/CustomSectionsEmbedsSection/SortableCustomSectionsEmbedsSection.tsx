'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CustomSectionsEmbedsSection from '../CustomSectionsEmbedsSection';
import type { UploadContentData } from '../../UploadContentModal/types';
import type { ContentItem, TextSection } from '../../MobilePreview/types';

import type { CustomSection } from '../../MobilePreview/types';

interface SortableCustomSectionsEmbedsSectionProps {
  coverImage?: string;
  contentItems?: ContentItem[];
  customSections?: CustomSection[];
  customSectionsOrder?: string[];
  onAddContent?: (data: UploadContentData) => void;
  onUpdateContent?: (id: string, data: UploadContentData) => void;
  onDeleteContent?: (id: string) => void;
  onAddCustomSection?: (sectionName: string, layout: 'list' | 'row' | 'parallel-row', useContentImageAsBackground: boolean) => void;
  onUpdateCustomSection?: (id: string, sectionName: string, layout: 'list' | 'row' | 'parallel-row', useContentImageAsBackground: boolean) => void;
  onDeleteCustomSection?: (id: string) => void;
  onAddContentToCustomSection?: (sectionId: string, data: { thumbnail?: string; title: string; url: string; isEmail: boolean; content?: string }) => void;
  onUpdateContentInCustomSection?: (sectionId: string, itemId: string, data: { thumbnail?: string; title: string; url: string; isEmail: boolean; content?: string }) => void;
  onDeleteContentFromCustomSection?: (sectionId: string, itemId: string) => void;
  onReorderItemsInCustomSection?: (sectionId: string, newItems: ContentItem[]) => void;
  onReorderSections?: (sectionIds: string[]) => void;
  textSections?: TextSection[];
  onAddEmbedSection?: (sectionName: string, layout: 'list' | 'row') => void;
  onAddEmailSection?: (title: string, content: string) => void;
  onUpdateEmailSection?: (id: string, title: string, content: string) => void;
  onDeleteEmailSection?: (id: string) => void;
  onAddTextSection?: (title: string, content: string) => void;
  onUpdateTextSection?: (id: string, title: string, content: string) => void;
  onDeleteTextSection?: (id: string) => void;
  onReorderTextSections?: (sectionIds: string[]) => void;
}

export function SortableCustomSectionsEmbedsSection({
  coverImage,
  contentItems,
  customSections,
  customSectionsOrder,
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
  textSections,
  onAddEmbedSection,
  onAddEmailSection,
  onUpdateEmailSection,
  onDeleteEmailSection,
  onAddTextSection,
  onUpdateTextSection,
  onDeleteTextSection,
  onReorderTextSections,
}: SortableCustomSectionsEmbedsSectionProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: 'custom-sections-embeds',
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CustomSectionsEmbedsSection
        coverImage={coverImage}
        contentItems={contentItems}
        customSections={customSections}
        customSectionsOrder={customSectionsOrder}
        onAddContent={onAddContent}
        onUpdateContent={onUpdateContent}
        onDeleteContent={onDeleteContent}
        onAddCustomSection={onAddCustomSection}
        onUpdateCustomSection={onUpdateCustomSection}
        onDeleteCustomSection={onDeleteCustomSection}
        onAddContentToCustomSection={onAddContentToCustomSection}
        onUpdateContentInCustomSection={onUpdateContentInCustomSection}
        onDeleteContentFromCustomSection={onDeleteContentFromCustomSection}
        onReorderItemsInCustomSection={onReorderItemsInCustomSection}
        onReorderSections={onReorderSections}
        textSections={textSections}
        onAddEmbedSection={onAddEmbedSection}
        onAddEmailSection={onAddEmailSection}
        onUpdateEmailSection={onUpdateEmailSection}
        onDeleteEmailSection={onDeleteEmailSection}
        onAddTextSection={onAddTextSection}
        onUpdateTextSection={onUpdateTextSection}
        onDeleteTextSection={onDeleteTextSection}
        onReorderTextSections={onReorderTextSections}
      />
    </div>
  );
}

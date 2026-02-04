'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@superline/design-system';
import { Add as AddIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CollapsibleSection from '../../shared/CollapsibleSection';
import AddSocialLinkModal from '../../AddSocialLinkModal';
import EditSocialLinkModal from '../../EditSocialLinkModal';
import { SocialLinksSectionProps, SocialLink } from './types';
import { SortableLinkItem } from './components/SortableLinkItem';
import { styles } from './styles';
import { getSocialIcon } from './utils/getSocialIcon';

const DEFAULT_LINKS: SocialLink[] = [
  { 
    id: '1', 
    platform: 'Instagram', 
    url: 'https://www.instagram.com/', 
    icon: getSocialIcon('instagram', 20, '#FFFFFF') 
  },
  { 
    id: '2', 
    platform: 'Facebook', 
    url: 'https://www.facebook.com/', 
    icon: getSocialIcon('facebook', 20, '#FFFFFF') 
  },
];

export default function SocialLinksSection({
  links = DEFAULT_LINKS,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
  onReorder,
}: SocialLinksSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSocialLink = useCallback(
    (platform: string, url: string) => {
      onAddLink?.(platform, url);
    },
    [onAddLink]
  );

  const handleEditLink = useCallback(
    (link: SocialLink) => {
      setEditingLink(link);
      setIsEditModalOpen(true);
    },
    []
  );

  const handleUpdateLink = useCallback(
    (id: string, platform: string, url: string, username?: string) => {
      onUpdateLink?.(id, platform, url, username);
    },
    [onUpdateLink]
  );

  const handleDeleteLink = useCallback(
    (id: string) => {
      onRemoveLink?.(id);
    },
    [onRemoveLink]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = links.findIndex((link) => link.id === active.id);
        const newIndex = links.findIndex((link) => link.id === over.id);
        const newLinks = arrayMove(links, oldIndex, newIndex);
        onReorder?.(newLinks);
      }
    },
    [links, onReorder]
  );

  return (
    <CollapsibleSection title="SOCIAL LINKS" defaultExpanded={true}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} id="social-links-dnd">
        <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
          {links.map((link) => (
            <SortableLinkItem 
              key={link.id} 
              link={link} 
              onRemoveLink={onRemoveLink} 
              onEditLink={handleEditLink}
              isSortable={isMounted} 
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button variant="primary-dark" onClick={() => setIsAddModalOpen(true)} sx={styles.addButton}>
        <AddIcon sx={{ fontSize: '20px' }} />
        ADD SOCIAL LINK
      </Button>

      <AddSocialLinkModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddSocialLink} />
      <EditSocialLinkModal 
        open={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLink(null);
        }} 
        link={editingLink}
        onUpdate={handleUpdateLink}
        onDelete={handleDeleteLink}
      />
    </CollapsibleSection>
  );
}


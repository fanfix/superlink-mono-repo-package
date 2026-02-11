'use client';

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { Edit as EditIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import CollapsibleSection from '../../shared/CollapsibleSection';
import AddBrandKitModal from '../../AddBrandKitModal';
import EngagementsSection from '../EngagementsSection';
import PricingPackagesSection from '../PricingPackagesSection';
import { styles } from './styles';
import { BrandKitSectionProps } from './types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableBrandKitItem({ item, onEdit, onDelete }: { item: any; onEdit?: () => void; onDelete?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} sx={styles.brandKitItemCard}>
      <Box sx={styles.brandKitItemContent}>
        <Box
          sx={styles.brandKitDragHandle}
          {...attributes}
          {...listeners}
        >
          <MoreVertIcon sx={styles.dragHandleIcon} />
        </Box>
        {item.thumbnailUrl ? (
          <Box component="img" src={item.thumbnailUrl} alt={item.description} sx={styles.brandKitLogo} />
        ) : (
          <Box sx={styles.brandKitLogoPlaceholder}>
            <Box
              component="img"
              src="/assets/Client/user_icon.svg"
              alt="Placeholder"
              sx={styles.placeholderIcon}
            />
          </Box>
        )}
        <Typography sx={styles.brandKitName}>{item.description}</Typography>
      </Box>
      <IconButton
        size="small"
        onClick={onEdit}
        sx={styles.editButton}
      >
        <EditIcon sx={styles.editIcon} />
      </IconButton>
    </Box>
  );
}

export default function BrandKitSection({
  brandKitItems = [],
  onAddBrandKit,
  onUpdateBrandKit,
  onDeleteBrandKit,
  onReorderBrandKit,
  engagements = [],
  onAddEngagement,
  onUpdateEngagement,
  onDeleteEngagement,
  onReorderEngagements,
  pricing = [],
  onAddPricing,
  onUpdatePricing,
  onDeletePricing,
  onReorderPricing,
}: BrandKitSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context }) => {
        // Simple keyboard handling
        return undefined;
      },
    })
  );

  const handleAdd = (thumbnail: File | null, description: string) => {
    onAddBrandKit?.(thumbnail, description);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdate = (thumbnail: File | null, description: string) => {
    if (editingItem && onUpdateBrandKit) {
      onUpdateBrandKit(editingItem.id, thumbnail, description);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (editingItem && onDeleteBrandKit) {
      onDeleteBrandKit(editingItem.id);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderBrandKit) {
      const oldIndex = brandKitItems.findIndex((item) => item.id === active.id);
      const newIndex = brandKitItems.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(brandKitItems, oldIndex, newIndex);
      onReorderBrandKit(newItems.map((item) => item.id));
    }
  };

  const hasBrandKit = brandKitItems.length > 0;

  return (
    <>
      <CollapsibleSection title="BRAND KIT" defaultExpanded={true}>
        {hasBrandKit && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            id="brand-kit-dnd"
          >
            <SortableContext items={brandKitItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <Box sx={styles.brandKitItemsContainer}>
                {brandKitItems.map((item) => (
                  <SortableBrandKitItem
                    key={item.id}
                    item={item}
                    onEdit={() => {
                      setEditingItem(item);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
        )}
        {!hasBrandKit && (
          <Button variant="primary-dark" onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }} sx={styles.addButton}>
            + Add Brand Kit
          </Button>
        )}
        {/* Child sections inside parent border: Engagements & Pricing */}
        {hasBrandKit && (
          <Box sx={styles.childSectionsWrapper}>
            <EngagementsSection
              engagements={engagements}
              onAddEngagement={onAddEngagement}
              onUpdateEngagement={onUpdateEngagement}
              onDeleteEngagement={onDeleteEngagement}
              onReorderEngagements={onReorderEngagements}
            />
            <PricingPackagesSection
              pricing={pricing}
              onAddPricing={onAddPricing}
              onUpdatePricing={onUpdatePricing}
              onDeletePricing={onDeletePricing}
              onReorderPricing={onReorderPricing}
            />
          </Box>
        )}
      </CollapsibleSection>

      <AddBrandKitModal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onAdd={editingItem ? handleUpdate : handleAdd}
        editingItem={editingItem}
        onDelete={editingItem ? handleDelete : undefined}
      />
    </>
  );
}


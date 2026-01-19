'use client';

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import CollapsibleSection from '../../shared/CollapsibleSection';
import AddPricingModal from '../../AddPricingModal';
import { styles } from './styles';
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

interface Pricing {
  id: string;
  title: string;
  price: string;
}

interface PricingPackagesSectionProps {
  pricing?: Pricing[];
  onAddPricing?: (data: { title: string; price: string }) => void;
  onUpdatePricing?: (id: string, data: { title: string; price: string }) => void;
  onDeletePricing?: (id: string) => void;
  onReorderPricing?: (itemIds: string[]) => void;
}

interface SortablePricingItemProps {
  item: Pricing;
  onEdit: (item: Pricing) => void;
}

function SortablePricingItem({ item, onEdit }: SortablePricingItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onEdit(item);
  };

  return (
    <Box ref={setNodeRef} style={style} sx={styles.pricingItemCard}>
      <Box sx={styles.pricingItemContent}>
        <Box
          sx={styles.pricingDragHandle}
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertIcon sx={{ fontSize: '20px', color: 'var(--color-gray-500)' }} />
        </Box>
        <Typography sx={styles.pricingTitle}>{item.title}</Typography>
        <Typography sx={styles.pricingPrice}>{item.price}</Typography>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{
            padding: '4px',
            color: 'var(--color-gray-500)',
            marginLeft: 'auto',
          }}
        >
          <MoreVertIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function PricingPackagesSection({ 
  pricing = [], 
  onAddPricing,
  onUpdatePricing,
  onDeletePricing,
  onReorderPricing,
}: PricingPackagesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context }) => {
        return undefined;
      },
    })
  );

  const handleAdd = (data: { title: string; price: string }) => {
    onAddPricing?.(data);
    setIsModalOpen(false);
    setEditingPricing(null);
  };

  const handleUpdate = (id: string, data: { title: string; price: string }) => {
    if (onUpdatePricing) {
      onUpdatePricing(id, data);
    }
    setIsModalOpen(false);
    setEditingPricing(null);
  };

  const handleDelete = () => {
    if (editingPricing && onDeletePricing) {
      onDeletePricing(editingPricing.id);
    }
    setIsModalOpen(false);
    setEditingPricing(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderPricing) {
      const oldIndex = pricing.findIndex((item) => item.id === active.id);
      const newIndex = pricing.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(pricing, oldIndex, newIndex);
      onReorderPricing(newItems.map((item) => item.id));
    }
  };

  return (
    <>
      <CollapsibleSection title="PRICING & PACKAGES" defaultExpanded={true}>
        {pricing.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            id="pricing-dnd"
          >
            <SortableContext items={pricing.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <Box sx={styles.pricingContainer}>
                {pricing.map((item) => (
                  <SortablePricingItem
                    key={item.id}
                    item={item}
                    onEdit={(item) => {
                      setEditingPricing(item);
                      setIsModalOpen(true);
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
            setEditingPricing(null);
            setIsModalOpen(true);
          }}
          sx={styles.addButton}
        >
          + Add Pricing
        </Button>
      </CollapsibleSection>

      <AddPricingModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPricing(null);
        }}
        onAdd={handleAdd}
        onUpdate={editingPricing ? handleUpdate : undefined}
        onDelete={editingPricing ? handleDelete : undefined}
        editingPricing={editingPricing}
      />
    </>
  );
}


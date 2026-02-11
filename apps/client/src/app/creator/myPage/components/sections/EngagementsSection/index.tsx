'use client';

import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Button, Typography } from '@superline/design-system';
import { DragIndicator as DragIndicatorIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import CollapsibleSection from '../../shared/CollapsibleSection';
import AddEngagementModal from '../../AddEngagementModal';
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
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Engagement {
  id: string;
  title: string;
  count: string;
}

interface EngagementsSectionProps {
  engagements?: Engagement[];
  onAddEngagement?: (data: { title: string; count: string }) => void;
  onUpdateEngagement?: (id: string, data: { title: string; count: string }) => void;
  onDeleteEngagement?: (id: string) => void;
  onReorderEngagements?: (itemIds: string[]) => void;
}

interface SortableEngagementItemProps {
  item: Engagement;
  onEdit: (item: Engagement) => void;
}

function SortableEngagementItem({ item, onEdit }: SortableEngagementItemProps) {
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
    <Box ref={setNodeRef} style={style} sx={styles.engagementItemCard}>
      <Box sx={styles.engagementItemContent}>
        <Box
          sx={styles.engagementDragHandle}
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <DragIndicatorIcon sx={{ fontSize: '20px', color: 'var(--color-gray-500)' }} />
        </Box>
        <Typography sx={styles.engagementTitle}>{item.title}</Typography>
        <Typography sx={styles.engagementCount}>{item.count}</Typography>
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

export default function EngagementsSection({ 
  engagements = [], 
  onAddEngagement,
  onUpdateEngagement,
  onDeleteEngagement,
  onReorderEngagements,
}: EngagementsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEngagement, setEditingEngagement] = useState<Engagement | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = (data: { title: string; count: string }) => {
    onAddEngagement?.(data);
    setIsModalOpen(false);
    setEditingEngagement(null);
  };

  const handleUpdate = (id: string, data: { title: string; count: string }) => {
    if (onUpdateEngagement) {
      onUpdateEngagement(id, data);
    }
    setIsModalOpen(false);
    setEditingEngagement(null);
  };

  const handleDelete = () => {
    if (editingEngagement && onDeleteEngagement) {
      onDeleteEngagement(editingEngagement.id);
    }
    setIsModalOpen(false);
    setEditingEngagement(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderEngagements) {
      const oldIndex = engagements.findIndex((item) => item.id === active.id);
      const newIndex = engagements.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(engagements, oldIndex, newIndex);
      onReorderEngagements(newItems.map((item) => item.id));
    }
  };

  return (
    <>
      <CollapsibleSection title="ENGAGEMENTS" defaultExpanded={true}>
        {engagements.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            id="engagements-dnd"
          >
            <SortableContext items={engagements.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <Box sx={styles.engagementsContainer}>
                {engagements.map((item) => (
                  <SortableEngagementItem
                    key={item.id}
                    item={item}
                    onEdit={(item) => {
                      setEditingEngagement(item);
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
            setEditingEngagement(null);
            setIsModalOpen(true);
          }}
          sx={styles.addButton}
        >
          + Add Engagements
        </Button>
      </CollapsibleSection>

      <AddEngagementModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEngagement(null);
        }}
        onAdd={handleAdd}
        onUpdate={editingEngagement ? handleUpdate : undefined}
        onDelete={editingEngagement ? handleDelete : undefined}
        editingEngagement={editingEngagement}
      />
    </>
  );
}


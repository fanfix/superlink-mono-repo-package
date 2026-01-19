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
import AddCustomButtonModal from '../../AddCustomButtonModal';
import { SortableButtonItem } from './components/SortableButtonItem';
import { styles } from './styles';
import { CustomButtonsSectionProps } from './types';

export default function CustomButtonsSection({
  buttons = [],
  onAddButton,
  onUpdateButton,
  onDeleteButton,
  onReorder,
  onToggleActive,
}: CustomButtonsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<{ id: string; buttonText: string; type: 'email' | 'url'; value: string } | null>(null);
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

  const handleAdd = useCallback(
    (data: { buttonText: string; type: 'email' | 'url'; value: string }) => {
      onAddButton?.(data);
      setEditingButton(null);
    },
    [onAddButton]
  );

  const handleUpdate = useCallback(
    (id: string, data: { buttonText: string; type: 'email' | 'url'; value: string }) => {
      onUpdateButton?.(id, data);
      setEditingButton(null);
    },
    [onUpdateButton]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDeleteButton?.(id);
      setEditingButton(null);
    },
    [onDeleteButton]
  );

  const handleEditButton = useCallback((button: { id: string; buttonText: string; type: 'email' | 'url'; value: string }) => {
    setEditingButton(button);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingButton(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = buttons.findIndex((button) => button.id === active.id);
        const newIndex = buttons.findIndex((button) => button.id === over.id);
        const newButtons = arrayMove(buttons, oldIndex, newIndex);
        onReorder?.(newButtons);
      }
    },
    [buttons, onReorder]
  );

  return (
    <CollapsibleSection title="CUSTOM BUTTONS" defaultExpanded={true}>
      {buttons.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} id="custom-buttons-dnd">
          <SortableContext items={buttons.map((button) => button.id)} strategy={verticalListSortingStrategy}>
            {buttons.map((button) => (
              <SortableButtonItem
                key={button.id}
                button={button}
                onToggleActive={onToggleActive}
                onEdit={handleEditButton}
                isSortable={isMounted}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      <Button variant="primary-dark" onClick={() => {
        setEditingButton(null);
        setIsModalOpen(true);
      }} sx={styles.addButton}>
        <AddIcon sx={{ fontSize: '20px' }} />
        Add Custom Button
      </Button>

      <AddCustomButtonModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        editingButton={editingButton}
      />
    </CollapsibleSection>
  );
}


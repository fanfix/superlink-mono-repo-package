import { useCustomSections } from '../contexts/CustomSectionsContext';

export const useAddCustomSection = () => {
  const { addCustomSection, adding, error } = useCustomSections();
  return {
    execute: addCustomSection,
    loading: adding,
    error,
  };
};

export const useUpdateCustomSection = () => {
  const { updateCustomSection, updating, error } = useCustomSections();
  return {
    execute: updateCustomSection,
    loading: updating,
    error,
  };
};

export const useRemoveCustomSection = () => {
  const { removeCustomSection, removing, error } = useCustomSections();
  return {
    execute: removeCustomSection,
    loading: removing,
    error,
  };
};

export const useReorderCustomSections = () => {
  const { reorderCustomSections, reordering, error } = useCustomSections();
  return {
    execute: reorderCustomSections,
    loading: reordering,
    error,
  };
};

export const useAddCustomSectionLink = () => {
  const { addCustomSectionLink, addingLink, error } = useCustomSections();
  return {
    execute: addCustomSectionLink,
    loading: addingLink,
    error,
  };
};

export const useUpdateCustomSectionLink = () => {
  const { updateCustomSectionLink, updatingLink, error } = useCustomSections();
  return {
    execute: updateCustomSectionLink,
    loading: updatingLink,
    error,
  };
};

export const useRemoveCustomSectionLink = () => {
  const { removeCustomSectionLink, removingLink, error } = useCustomSections();
  return {
    execute: removeCustomSectionLink,
    loading: removingLink,
    error,
  };
};


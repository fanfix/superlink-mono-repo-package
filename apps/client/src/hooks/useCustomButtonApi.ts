import { useCustomButtons } from '../contexts/CustomButtonsContext';

export const useAddCustomButton = () => {
  const { addCustomButton, adding, error } = useCustomButtons();
  return {
    execute: addCustomButton,
    loading: adding,
    error,
  };
};

export const useUpdateCustomButton = () => {
  const { updateCustomButton, updating, error } = useCustomButtons();
  return {
    execute: updateCustomButton,
    loading: updating,
    error,
  };
};

export const useUpdateFavoriteCustomButton = () => {
  const { updateFavoriteCustomButton, togglingFavorite, error } = useCustomButtons();
  return {
    execute: updateFavoriteCustomButton,
    loading: togglingFavorite,
    error,
  };
};

export const useRemoveCustomButton = () => {
  const { removeCustomButton, removing, error } = useCustomButtons();
  return {
    execute: removeCustomButton,
    loading: removing,
    error,
  };
};


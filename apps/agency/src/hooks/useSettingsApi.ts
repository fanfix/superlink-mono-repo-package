/**
 * useSettingsApi Hook
 * Custom hook for settings API calls with individual loading states
 */

import {
  getPayoutMethod,
  getEmailRecipients,
  getStripeAccountDetails,
  getStripeDashboardLink,
  toggleAgencyPayoutMethod,
} from '../api/services/settingsService';
import { useApiCall } from './useApiCall';

export const useSettingsApi = () => {
  const fetchPayoutMethod = useApiCall(getPayoutMethod);
  const fetchEmailRecipients = useApiCall(getEmailRecipients);
  const fetchStripeAccountDetails = useApiCall(getStripeAccountDetails);
  const fetchStripeDashboardLink = useApiCall(getStripeDashboardLink);
  const updatePayoutMethod = useApiCall(toggleAgencyPayoutMethod);

  return {
    fetchPayoutMethod,
    fetchEmailRecipients,
    fetchStripeAccountDetails,
    fetchStripeDashboardLink,
    updatePayoutMethod,
    // Helper to check if any operation is loading
    loading:
      fetchPayoutMethod.loading ||
      fetchEmailRecipients.loading ||
      fetchStripeAccountDetails.loading ||
      fetchStripeDashboardLink.loading ||
      updatePayoutMethod.loading,
    // Helper to get first error if any
    error:
      fetchPayoutMethod.error ||
      fetchEmailRecipients.error ||
      fetchStripeAccountDetails.error ||
      fetchStripeDashboardLink.error ||
      updatePayoutMethod.error,
  };
};

export default useSettingsApi;


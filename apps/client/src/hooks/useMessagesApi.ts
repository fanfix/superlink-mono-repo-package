/**
 * Messages API Hook
 * Custom hook for messaging/chat-related API calls
 */

import { useApiCall } from './useApiCall';
import {
  getChatsApi,
  getMessagesApi,
  sendMessageApi,
  markMessageReadApi,
  getChannelsApi,
  getMessageSuggestionApi,
} from '../api/services/messagesService';
import type {
  Chat,
  Message,
  SendMessageInput,
  SendMessageResponse,
  PaginationParams,
  ChannelsResponse,
} from '../api/types';

/**
 * Hook for get chats list API
 */
export const useGetChats = () => {
  return useApiCall<Chat[], [string, PaginationParams?]>(getChatsApi);
};

/**
 * Hook for get messages API
 */
export const useGetMessages = () => {
  return useApiCall<Message[], [string, PaginationParams?]>(getMessagesApi);
};

/**
 * Hook for send message API
 */
export const useSendMessage = () => {
  return useApiCall<SendMessageResponse, [SendMessageInput]>(sendMessageApi);
};

/**
 * Hook for mark message read API
 */
export const useMarkMessageRead = () => {
  return useApiCall<{ id: string }, [string]>(markMessageReadApi);
};

/**
 * Hook for get channels earnings API
 */
export const useGetChannels = () => {
  return useApiCall<ChannelsResponse, [string]>(getChannelsApi);
};

/**
 * Hook for get message suggestions API
 */
export const useGetMessageSuggestion = () => {
  return useApiCall<string[], [string]>(getMessageSuggestionApi);
};


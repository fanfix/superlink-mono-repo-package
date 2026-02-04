/**
 * Messages Service
 * Handles all messaging/chat-related API calls
 */

import { executeGraphQL } from '../config/graphqlClient';
import {
  Chat,
  ChannelsResponse,
  Message,
  SendMessageInput,
  SendMessageResponse,
  PaginationParams,
  createApiError,
} from '../types';
import restClient from '../config/restClient';
import {
  GET_CHATS_QUERY,
  GET_MESSAGES_QUERY,
  SEND_MESSAGE_MUTATION,
  MARK_MESSAGE_READ_MUTATION,
  GET_CHANNELS_QUERY,
} from '../queries';

/**
 * Get Chats List
 */
export const getChatsApi = async (
  bioId: string,
  pagination?: PaginationParams
): Promise<Chat[]> => {
  try {
    const response = await executeGraphQL<{ getChats: Chat[] }>({
      operationName: 'GetChats',
      query: GET_CHATS_QUERY,
      variables: {
        bioId,
        limit: pagination?.limit || 20,
        offset: pagination?.offset || 0,
      },
    });

    return response.data.getChats;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Messages for a Chat
 */
export const getMessagesApi = async (
  chatId: string,
  pagination?: PaginationParams
): Promise<Message[]> => {
  try {
    const response = await executeGraphQL<{ getMessages: Message[] }>({
      operationName: 'GetMessages',
      query: GET_MESSAGES_QUERY,
      variables: {
        chatId,
        limit: pagination?.limit || 50,
        offset: pagination?.offset || 0,
      },
    });

    return response.data.getMessages;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Send Message
 */
export const sendMessageApi = async (input: SendMessageInput): Promise<SendMessageResponse> => {
  try {
    const response = await executeGraphQL<{ sendMessage: SendMessageResponse }>({
      operationName: 'SendMessage',
      query: SEND_MESSAGE_MUTATION,
      variables: { input },
    });

    return response.data.sendMessage;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Mark Message as Read
 */
export const markMessageReadApi = async (messageId: string): Promise<{ id: string }> => {
  try {
    const response = await executeGraphQL<{ markMessageRead: { id: string } }>({
      operationName: 'MarkMessageRead',
      query: MARK_MESSAGE_READ_MUTATION,
      variables: { messageId },
    });

    return response.data.markMessageRead;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Channels Earnings
 * Returns earnings data for all channels (succeeded, pending, missed)
 */
export const getChannelsApi = async (userId: string): Promise<ChannelsResponse> => {
  try {
    const response = await executeGraphQL<{ channels: ChannelsResponse }>({
      operationName: 'GetChannels',
      query: GET_CHANNELS_QUERY,
      variables: { userId },
    });

    return response.data.channels;
  } catch (error: any) {
    throw createApiError(error);
  }
};

/**
 * Get Message Suggestions
 * Returns AI-generated message suggestions
 */
export const getMessageSuggestionApi = async (messages: string): Promise<string[]> => {
  try {
    const response = await restClient.post<{ completions: { text: string }[] }>('/messages/suggestion', {
      messages,
    });
    
    const suggestions = response.data.completions.map((item) => item.text);
    return suggestions.length > 5 ? suggestions.slice(0, 5) : suggestions;
  } catch (error: any) {
    throw createApiError(error);
  }
};

export default {
  getChatsApi,
  getMessagesApi,
  sendMessageApi,
  markMessageReadApi,
  getChannelsApi,
  getMessageSuggestionApi,
};


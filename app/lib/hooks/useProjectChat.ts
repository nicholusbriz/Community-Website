// app/lib/hooks/useProjectChat.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api/client';

interface SendMessageData {
  content: string;
}

interface SendReplyData {
  content: string;
  parentId: string;
}

interface EditMessageData {
  messageId: string;
  content: string;
}

export function useProjectChat(projectId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['project-chat', projectId],
    queryFn: () => api.get(`/api/projects/${projectId}/chat`),
    enabled: !!projectId,
    refetchInterval: 5000,
    staleTime: 30 * 1000,
  });

  const sendMessage = useMutation({
    mutationFn: (data: SendMessageData) => 
      api.post(`/api/projects/${projectId}/chat`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-chat', projectId] });
    },
  });

  const sendReply = useMutation({
    mutationFn: (data: SendReplyData) => {
      const { content, parentId } = data;
      return api.post(`/api/projects/${projectId}/chat/${parentId}/reply`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-chat', projectId] });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: (messageId: string) => 
      api.delete(`/api/projects/${projectId}/chat/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-chat', projectId] });
    },
  });

  const editMessage = useMutation({
    mutationFn: (data: EditMessageData) => {
      const { messageId, content } = data;
      return api.put(`/api/projects/${projectId}/chat/${messageId}`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-chat', projectId] });
    },
  });

  return {
    data,
    isLoading,
    error,
    sendMessage: sendMessage.mutateAsync,
    sendReply: sendReply.mutateAsync,
    deleteMessage: deleteMessage.mutateAsync,
    editMessage: editMessage.mutateAsync,
    isSending: sendMessage.isPending,
    isDeleting: deleteMessage.isPending,
  };
}
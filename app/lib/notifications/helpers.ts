// app/lib/notifications/helpers.ts
import { prisma } from '@/app/lib/prisma';

type NotificationType = 'SYSTEM' | 'PROJECT' | 'TASK' | 'REQUEST' | 'MENTION';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  projectId?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, title, message, type = 'SYSTEM', link, projectId } = params;

  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link: link || null,
      projectId: projectId || null,
      isRead: false,
    },
  });
}

// Specific notification creators
export async function notifyJoinRequest(
  projectId: string,
  requesterName: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { title: true, ownerId: true },
  });

  if (!project) return;

  await createNotification({
    userId: project.ownerId,
    title: 'New Join Request',
    message: `${requesterName} has requested to join "${project.title}"`,
    type: 'REQUEST',
    link: `/dashboard/projects/${projectId}/join-requests`,
    projectId: projectId,
  });
}

export async function notifyJoinRequestApproved(
  projectId: string,
  userId: string,
  projectTitle: string
) {
  await createNotification({
    userId,
    title: 'Join Request Approved',
    message: `Your request to join "${projectTitle}" has been approved!`,
    type: 'REQUEST',
    link: `/projects/${projectId}`,
    projectId: projectId,
  });
}

export async function notifyJoinRequestRejected(
  projectId: string,
  userId: string,
  projectTitle: string,
  reason?: string
) {
  const message = reason 
    ? `Your request to join "${projectTitle}" was rejected: ${reason}`
    : `Your request to join "${projectTitle}" was rejected.`;

  await createNotification({
    userId,
    title: 'Join Request Rejected',
    message,
    type: 'REQUEST',
    projectId: projectId,
  });
}

export async function notifyTaskAssigned(
  projectId: string,
  taskId: string,
  assigneeId: string,
  taskTitle: string,
  assignerName: string
) {
  await createNotification({
    userId: assigneeId,
    title: 'Task Assigned',
    message: `${assignerName} assigned you "${taskTitle}"`,
    type: 'TASK',
    link: `/dashboard/projects/${projectId}/tasks/${taskId}/edit`,
    projectId: projectId,
  });
}

export async function notifyTaskCompleted(
  projectId: string,
  taskId: string,
  userId: string,
  taskTitle: string,
  completerName: string
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assignedById: true },
  });

  if (!task || !task.assignedById) return;

  await createNotification({
    userId: task.assignedById,
    title: 'Task Completed',
    message: `${completerName} completed "${taskTitle}"`,
    type: 'TASK',
    link: `/dashboard/projects/${projectId}/tasks/${taskId}/edit`,
    projectId: projectId,
  });
}

export async function notifyNewMessage(
  projectId: string,
  senderId: string,
  senderName: string,
  content: string,
  parentId?: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { title: true },
  });

  if (!project) return;

  // Get all project members except the sender
  const members = await prisma.projectMember.findMany({
    where: { 
      projectId: projectId,
      userId: { not: senderId },
    },
    select: { userId: true },
  });

  const messagePreview = content.length > 50 ? content.slice(0, 50) + '...' : content;

  // Notify all members
  for (const member of members) {
    await createNotification({
      userId: member.userId,
      title: `New message in "${project.title}"`,
      message: `${senderName}: ${messagePreview}`,
      type: 'MENTION',
      link: `/dashboard/projects/${projectId}/chat`,
      projectId: projectId,
    });
  }
}

export async function notifyMemberJoined(
  projectId: string,
  memberName: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { title: true, ownerId: true },
  });

  if (!project) return;

  await createNotification({
    userId: project.ownerId,
    title: 'New Member Joined',
    message: `${memberName} has joined "${project.title}"`,
    type: 'PROJECT',
    link: `/dashboard/projects/${projectId}/members`,
    projectId: projectId,
  });
}

export async function notifyMemberLeft(
  projectId: string,
  memberName: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { title: true, ownerId: true },
  });

  if (!project) return;

  await createNotification({
    userId: project.ownerId,
    title: 'Member Left',
    message: `${memberName} has left "${project.title}"`,
    type: 'PROJECT',
    link: `/dashboard/projects/${projectId}/members`,
    projectId: projectId,
  });
}

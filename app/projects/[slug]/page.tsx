// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { getAuthUserSafe } from '@/app/lib/auth/api-utils';
import { NextRequest } from 'next/server';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Users, 
  GitBranch, 
  Code, 
  Target, 
  Clock, 
  ExternalLink, 
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  UserPlus,
  Settings,
  ListChecks,
  Award,
  AlertCircle,
  Crown,
  User,
  Plus,
  Circle,
  RefreshCw,
  Play,
  Eye,
  Archive
} from 'lucide-react';
// ✅ Import types from @prisma/client directly
import { ProjectStatus, TaskStatus, type Task, type ProjectMember } from '@prisma/client';
import { ProjectActions } from './components/ProjectActions';
import { ProjectLinks } from './components/ProjectLinks';

// ✅ Import cookies from next/headers
import { cookies } from 'next/headers';

// ✅ Import getToken
import { getToken } from 'next-auth/jwt';

// Fetch project data with all relations
async function getProject(slug: string, userId?: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { 
        slug: slug,
        isArchived: false,
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
            icon: true,
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              }
            }
          }
        },
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        joinRequests: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          where: {
            status: 'PENDING'
          }
        },
        _count: {
          select: {
            members: true,
            tasks: true,
            joinRequests: true,
          }
        }
      }
    });
    
    if (!project) return null;
    
    // Check if current user is a member
    let userRole: string | null = null;
    let isMember = false;
    let isOwner = false;
    let joinRequestStatus: string | null = null;
    
    if (userId) {
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: userId,
            projectId: project.id
          }
        }
      });
      
      if (membership) {
        isMember = true;
        if (project.ownerId === userId) {
          userRole = 'OWNER';
          isOwner = true;
        } else {
          userRole = 'MEMBER';
        }
      }
      
      // Check for pending join request
      const joinRequest = await prisma.joinRequest.findFirst({
        where: {
          projectId: project.id,
          userId: userId,
          status: 'PENDING'
        }
      });
      
      if (joinRequest) {
        joinRequestStatus = joinRequest.status;
      }
    }
    
    return {
      ...project,
      userRole,
      isMember,
      isOwner,
      joinRequestStatus
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Server Action for Status Change
async function handleStatusChange(projectId: string, newStatus: string, userId: string) {
  'use server';
  
  if (!userId) {
    return { error: 'You must be logged in' };
  }
  
  try {
    // Verify user is owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });
    
    if (!project) {
      return { error: 'Project not found' };
    }
    
    if (project.ownerId !== userId) {
      return { error: 'Only the project owner can change status' };
    }
    
    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus as ProjectStatus }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error changing status:', error);
    return { error: 'Failed to update project status' };
  }
}

// Server Action for Task Status Update
async function updateTaskStatus(taskId: string, newStatus: string, userId: string) {
  'use server';
  
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });
    
    if (!task) return { error: 'Task not found' };
    
    // Verify user is the task assignee or project owner
    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      select: { ownerId: true }
    });
    
    const isOwner = project?.ownerId === userId;
    const isAssignee = task.assignedToId === userId;
    
    if (!isOwner && !isAssignee) {
      return { error: 'You do not have permission to update this task' };
    }
    
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus as TaskStatus }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating task:', error);
    return { error: 'Failed to update task' };
  }
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Get auth token using cookies from next/headers
  let userId: string | undefined = undefined;
  let isAuthenticated = false;
  
  try {
    // Get cookies from the request
    const cookieStore = await cookies();
    
    // Create a request-like object with cookies
    const req = {
      headers: new Headers(),
      cookies: cookieStore,
      nextUrl: new URL('http://localhost:3000'),
    } as any;
    
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (token?.id) {
      userId = token.id as string;
      isAuthenticated = true;
      console.log('✅ User authenticated:', { userId });
    } else {
      console.log('❌ No user authenticated - viewing as guest');
    }
  } catch (error) {
    console.log('❌ Auth error - viewing as guest:', error);
  }
  
  const project = await getProject(slug, userId);
  
  if (!project) {
    notFound();
  }
  
  // Use isOwner from the project data
  const isOwner = userId ? project.ownerId === userId : false;
  
  // Status badge configuration
  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: ClockIcon },
    OPEN: { label: 'Open for Members', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: GitBranch },
    COMPLETED: { label: 'Completed', color: 'bg-purple-100 text-purple-700', icon: Award },
    ON_HOLD: { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-700', icon: Archive },
  };
  
  const status = statusConfig[project.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;
  
  // Check if project is accepting members
  const isAcceptingMembers = project.status === 'OPEN' && project._count.members < project.maxTeamSize;
  
  // Format dates
  const createdAt = new Date(project.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get difficulty badge color
  const difficultyColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-700',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-700',
    ADVANCED: 'bg-orange-100 text-orange-700',
  };
  
  // Task status colors
  const taskStatusColors: Record<string, string> = {
    BACKLOG: 'bg-gray-100 text-gray-700',
    TODO: 'bg-blue-100 text-blue-700',
    IN_PROGRESS: 'bg-purple-100 text-purple-700',
    REVIEW: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    BLOCKED: 'bg-red-100 text-red-700',
  };
  
  // Check if user can manage project (Only Owner)
  const canManage = isOwner;
  
  // Status action buttons for workflow
  const statusActions: Record<string, { label: string; action: string; icon: React.ElementType; color: string }> = {
    DRAFT: { label: 'Open for Members', action: 'OPEN', icon: Play, color: 'green' },
    IN_PROGRESS: { label: 'Complete Project', action: 'COMPLETED', icon: CheckCircle, color: 'purple' },
    ON_HOLD: { label: 'Resume Project', action: 'IN_PROGRESS', icon: RefreshCw, color: 'blue' },
  };
  
  const currentAction = statusActions[project.status];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className={`p-6 ${project.group ? `bg-${project.group.color}-50` : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    {project.group && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium text-${project.group.color}-700 bg-${project.group.color}-100 px-3 py-1 rounded-full`}>
                          {project.group.icon} {project.group.name}
                        </span>
                      </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} flex items-center gap-1`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[project.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                        {project.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project._count.members} / {project.maxTeamSize} members
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <ListChecks className="w-4 h-4" />
                        {project.tasks.filter((t: Task) => t.status === 'COMPLETED').length || 0}/{project._count.tasks} tasks done
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {project.views} views
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Change Button for Owner */}
                  {canManage && currentAction && (
                    <form action={async () => {
                      'use server';
                      await handleStatusChange(project.id, currentAction.action, userId!);
                    }}>
                      <button
                        type="submit"
                        className={`px-4 py-2 bg-${currentAction.color}-600 text-white rounded-lg text-sm font-medium hover:bg-${currentAction.color}-700 transition-colors flex items-center gap-2`}
                      >
                        <currentAction.icon className="w-4 h-4" />
                        {currentAction.label}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              
              {/* Project Details */}
              <div className="p-6 space-y-6">
                {/* Owner Info with link to developer profile */}
                <Link
                  href={`/developers/${project.ownerId}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {project.owner?.image ? (
                      <Image 
                        src={project.owner.image} 
                        alt={project.owner.name || 'Owner'} 
                        width={40} 
                        height={40} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {project.owner?.name?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Project Owner</p>
                    <p className="font-medium text-gray-900 group-hover:text-[#1B2A56] transition-colors">
                      {project.owner?.name || 'Unknown'}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#1B2A56] transition-colors" />
                  <span className="text-sm text-gray-500">
                    Created {createdAt}
                  </span>
                </Link>
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
                
                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech: string, index: number) => (
                        <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Goals */}
                {project.goals && project.goals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Project Goals
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {project.goals.map((goal: string, index: number) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Project Links - Using ProjectLinks component */}
                <ProjectLinks 
                  repositoryUrl={project.repositoryUrl} 
                  demoUrl={project.demoUrl} 
                />
                
                {/* Duration */}
                {project.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Estimated duration: {project.duration}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tasks Section - Only visible to members */}
            {project.isMember && project.tasks && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                    {canManage && (
                      <Link
                        href={`/dashboard/projects/${project.id}/tasks/new`}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Task
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {project.tasks.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No tasks created yet.
                    </div>
                  ) : (
                    project.tasks.map((task: Task & { assignedTo: { id: string; name: string | null; image: string | null } | null }) => (
                      <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {task.status === 'COMPLETED' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${taskStatusColors[task.status] || 'bg-gray-100 text-gray-700'}`}>
                                {task.status.replace('_', ' ')}
                              </span>
                              {task.assignedTo && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {task.assignedTo.name}
                                </span>
                              )}
                              {task.dueDate && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          {canManage && (
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/projects/${project.id}/tasks/${task.id}/edit`}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </Link>
                              {task.status !== 'COMPLETED' && (
                                <form action={async () => {
                                  'use server';
                                  await updateTaskStatus(task.id, 'COMPLETED', userId!);
                                }}>
                                  <button
                                    type="submit"
                                    className="text-sm text-green-600 hover:text-green-800"
                                  >
                                    Complete
                                  </button>
                                </form>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
              
              <ProjectActions
                project={project}
                userId={userId}
                isAuthenticated={isAuthenticated}
                isMember={project.isMember}
                isOwner={isOwner}
                joinRequestStatus={project.joinRequestStatus}
                isAcceptingMembers={isAcceptingMembers}
                projectId={project.id}
              />
            </div>
            
            {/* Membership Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Membership</h3>
              
              {project.isMember ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">You&apos;re a member</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Role: <span className="font-medium capitalize">{project.userRole?.toLowerCase()}</span>
                  </p>
                  {isOwner && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                      <Crown className="w-4 h-4 inline mr-2" />
                      You own this project. You can manage all aspects.
                    </div>
                  )}
                </div>
              ) : project.joinRequestStatus === 'PENDING' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-yellow-600">
                    <ClockIcon className="w-5 h-5" />
                    <span className="font-medium">Request Pending</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your request to join this project is awaiting approval.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {isAuthenticated ? 'You are not a member of this project.' : 'Log in to join this project.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Members List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Members ({project.members?.length || 0})
              </h3>
              
              <div className="space-y-3">
                {project.members?.slice(0, 5).map((member: ProjectMember & { user: { id: string; name: string | null; image: string | null; email: string | null } }) => {
                  const isProjectOwner = member.userId === project.ownerId;
                  return (
                    <div key={member.userId} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {member.user.image ? (
                          <Image 
                            src={member.user.image} 
                            alt={member.user.name || 'User'} 
                            width={32} 
                            height={32} 
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 text-sm font-medium">
                            {member.user.name?.charAt(0) || '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {isProjectOwner ? (
                            <>
                              <Crown className="w-3 h-3 text-yellow-500" />
                              Owner
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-gray-400" />
                              Member
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {project.members && project.members.length > 5 && (
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all {project.members.length} members
                  </button>
                )}
              </div>
            </div>
            
            {/* Project Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-medium">{project._count.tasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed Tasks</span>
                  <span className="font-medium text-green-600">
                    {project.tasks.filter((t: Task) => t.status === 'COMPLETED').length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Join Requests</span>
                  <span className="font-medium text-yellow-600">{project._count.joinRequests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {project._count.tasks > 0 
                      ? Math.round((project.tasks.filter((t: Task) => t.status === 'COMPLETED').length / project._count.tasks) * 100)
                      : 0}%
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${project._count.tasks > 0 
                        ? (project.tasks.filter((t: Task) => t.status === 'COMPLETED').length / project._count.tasks) * 100 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths for all published projects
export async function generateStaticParams() {
  try {
    const projects = await prisma.project.findMany({
      where: { 
        isArchived: false,
        status: { 
          in: ['OPEN', 'IN_PROGRESS', 'COMPLETED'] 
        }
      },
      select: { slug: true }
    });
    
    return projects.map((project: { slug: string }) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// DashboardPage.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsGrid } from './components/StatsGrid';
import { ProgressSection } from './components/ProgressSection';
import { TaskDistribution } from './components/TaskDistribution';
import { MembersSection } from './components/MembersSection';
import { JoinRequestsSection } from './components/JoinRequestsSection';
import { ActivitySection } from './components/ActivitySection';
import { ChatWidget } from './components/ChatWidget';
import { RecentTasks } from './components/RecentTasks';
import { ErrorState } from './components/ErrorState';

interface DashboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const { actions, isLoading: authLoading, user } = useAuth();
  const isAuthenticated = actions.isAuthenticated();

  // Fetch all dashboard data
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    removeMember,
    approveRequest,
    rejectRequest,
    sendMessage,
    sendReply,
    makeProjectLead // Add this new function
  } = useDashboardData(id);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/join?callbackUrl=/dashboard/projects');
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading state
  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error || !data?.project) {
    return (
      <ErrorState 
        error={error} 
        onRetry={() => refetch()} 
        projectId={id}
      />
    );
  }

  const { project, analytics, members, owner, joinRequests, activities, chat } = data;
  const isOwner = user?.id === project?.ownerId;
  
  // Safe access with fallbacks
  const taskStats = analytics?.taskStats || [];
  const pendingRequests = joinRequests?.filter((r: any) => r.status === 'PENDING')?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <DashboardHeader 
          project={project} 
          isOwner={isOwner}
          pendingRequests={pendingRequests}
          onRefresh={refetch}
          projectId={id}
        />

        {/* Stats Grid */}
        <StatsGrid 
          project={project}
          analytics={analytics}
          pendingRequests={pendingRequests}
        />

        {/* Progress & Task Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProgressSection project={project} />
          <TaskDistribution tasks={taskStats} />
        </div>

        {/* Members Section - Removed onAddMember prop */}
        <MembersSection 
          members={members || []}
          owner={owner}
          isOwner={isOwner}
          projectId={id}
          onRemoveMember={removeMember}
          onMakeProjectLead={makeProjectLead} // Add this prop
        />

        {/* Join Requests Section */}
        {isOwner && (
          <JoinRequestsSection 
            requests={joinRequests || []}
            onApprove={approveRequest}
            onReject={rejectRequest}
            onRefresh={refetch}
          />
        )}

        {/* Activity Section */}
        <ActivitySection 
          activities={activities || []}
          onRefresh={refetch}
        />

        {/* Chat Widget */}
        <ChatWidget 
          chat={{
            messages: chat?.messages || [],
            isLoading: chat?.isLoading || false
          }}
          projectId={id}
          isMember={true}
          onSendMessage={sendMessage}
          onSendReply={sendReply}
        />

        {/* Recent Tasks */}
        <RecentTasks 
          tasks={project.tasks || []}
          projectId={id}
        />
      </div>
    </div>
  );
}
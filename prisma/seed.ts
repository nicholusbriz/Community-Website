// prisma/seed.ts
import { hash } from 'bcryptjs'
import { prisma } from '@/app/lib/prisma'

async function main() {
  console.log('🌱 Starting seed...')

  // ============================================================
  // 1️⃣ SEED ROLES
  // ============================================================
  console.log('📝 Seeding roles...')

  const roles = [
    { name: 'USER', description: 'Standard user with basic access' },
    { name: 'PROJECT_LEAD', description: 'Project team lead with management capabilities' },
    { name: 'ADMIN', description: 'Administrator with full platform management access' },
    { name: 'SUPERADMIN', description: 'System-level controls and full platform access' },
  ]

  const createdRoles: Record<string, any> = {}
  for (const role of roles) {
    createdRoles[role.name] = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    })
    console.log(`  ✅ Role: ${role.name}`)
  }

  // ============================================================
  // 2️⃣ SEED USERS (Password: password123)
  // ============================================================
  console.log('📝 Seeding users...')

  const hashedPassword = await hash('password123', 10)

  const usersData = [
    {
      name: 'Alex Johnson',
      email: 'superadmin@devcollab.com',
      username: 'alexj',
      roleName: 'SUPERADMIN',
      bio: 'System administrator and platform founder',
      location: 'Nairobi, Kenya',
      skills: ['System Architecture', 'DevOps', 'Full Stack'],
      github: 'https://github.com/alexj',
      linkedin: 'https://linkedin.com/in/alexj',
    },
    {
      name: 'Sarah Chen',
      email: 'admin@devcollab.com',
      username: 'sarahc',
      roleName: 'ADMIN',
      bio: 'Platform administrator and community manager',
      location: 'Cape Town, South Africa',
      skills: ['Community Management', 'Project Management', 'React'],
      github: 'https://github.com/sarahc',
      linkedin: 'https://linkedin.com/in/sarahc',
    },
    {
      name: 'Michael Okafor',
      email: 'admin2@devcollab.com',
      username: 'michaelo',
      roleName: 'ADMIN',
      bio: 'Technical administrator',
      location: 'Lagos, Nigeria',
      skills: ['Node.js', 'PostgreSQL', 'Cloud Architecture'],
      github: 'https://github.com/michaelo',
      linkedin: 'https://linkedin.com/in/michaelo',
    },
    {
      name: 'Grace Muthoni',
      email: 'lead@devcollab.com',
      username: 'gracem',
      roleName: 'PROJECT_LEAD',
      bio: 'Full stack developer and team lead',
      location: 'Kigali, Rwanda',
      skills: ['React', 'Node.js', 'TypeScript', 'Python'],
      github: 'https://github.com/gracem',
      linkedin: 'https://linkedin.com/in/gracem',
    },
    {
      name: 'David Kiprop',
      email: 'lead2@devcollab.com',
      username: 'davidk',
      roleName: 'PROJECT_LEAD',
      bio: 'Mobile developer and team lead',
      location: 'Nairobi, Kenya',
      skills: ['React Native', 'Flutter', 'Firebase'],
      github: 'https://github.com/davidk',
      linkedin: 'https://linkedin.com/in/davidk',
    },
    {
      name: 'John Doe',
      email: 'user@devcollab.com',
      username: 'johnd',
      roleName: 'USER',
      bio: 'Computer Science student and developer',
      location: 'Kampala, Uganda',
      skills: ['JavaScript', 'React', 'Node.js'],
      github: 'https://github.com/johnd',
      linkedin: null,
    },
    {
      name: 'Jane Smith',
      email: 'user2@devcollab.com',
      username: 'janes',
      roleName: 'USER',
      bio: 'Aspiring full stack developer',
      location: 'Lusaka, Zambia',
      skills: ['Python', 'Django', 'React'],
      github: 'https://github.com/janes',
      linkedin: 'https://linkedin.com/in/janes',
    },
    {
      name: 'Peter Njoroge',
      email: 'peter@devcollab.com',
      username: 'petern',
      roleName: 'USER',
      bio: 'Software engineering student',
      location: 'Nairobi, Kenya',
      skills: ['C++', 'Java', 'Android'],
      github: 'https://github.com/petern',
      linkedin: null,
    },
    {
      name: 'Mary Akinyi',
      email: 'mary@devcollab.com',
      username: 'marya',
      roleName: 'USER',
      bio: 'Junior developer',
      location: 'Mombasa, Kenya',
      skills: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/marya',
      linkedin: 'https://linkedin.com/in/marya',
    },
    {
      name: 'Samuel Ochieng',
      email: 'samuel@devcollab.com',
      username: 'samuelo',
      roleName: 'USER',
      bio: 'IT student',
      location: 'Kisumu, Kenya',
      skills: ['PHP', 'Laravel', 'MySQL'],
      github: 'https://github.com/samuelo',
      linkedin: null,
    },
  ]

  const createdUsers: Record<string, any> = {}
  for (const userData of usersData) {
    const roleId = createdRoles[userData.roleName].id
    createdUsers[userData.email] = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        username: userData.username,
        roleId: roleId,
        bio: userData.bio,
        location: userData.location,
        skills: userData.skills,
        github: userData.github,
        linkedin: userData.linkedin,
        isActive: true,
      },
    })
    console.log(`  ✅ User: ${userData.name} (${userData.roleName})`)
  }

  // ============================================================
  // 3️⃣ SEED PROJECT GROUPS
  // ============================================================
  console.log('📝 Seeding project groups...')

  const groupsData = [
    { name: 'Web Development', slug: 'web-development', description: 'Projects focused on web applications and websites', icon: 'Globe', color: '#3B82F6' },
    { name: 'Mobile Development', slug: 'mobile-development', description: 'Projects for iOS and Android apps', icon: 'Smartphone', color: '#10B981' },
    { name: 'Data Science', slug: 'data-science', description: 'Projects involving data analysis and machine learning', icon: 'Database', color: '#8B5CF6' },
    { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Projects focused on security and penetration testing', icon: 'Shield', color: '#EF4444' },
    { name: 'Graphic Design', slug: 'graphic-design', description: 'Projects for UI/UX and visual design', icon: 'Palette', color: '#F59E0B' },
    { name: 'DevOps', slug: 'devops', description: 'Projects focused on deployment and infrastructure', icon: 'Server', color: '#EC4899' },
    { name: 'AI & Machine Learning', slug: 'ai-ml', description: 'Projects involving artificial intelligence', icon: 'Brain', color: '#14B8A6' },
    { name: 'Blockchain', slug: 'blockchain', description: 'Projects involving blockchain and Web3', icon: 'Link', color: '#F472B6' },
    { name: 'Game Development', slug: 'game-development', description: 'Projects for building games', icon: 'Gamepad', color: '#8B5CF6' },
    { name: 'Open Source', slug: 'open-source', description: 'Open source community projects', icon: 'Github', color: '#6B7280' },
  ]

  const createdGroups: Record<string, any> = {}
  for (const groupData of groupsData) {
    createdGroups[groupData.slug] = await prisma.projectGroup.upsert({
      where: { slug: groupData.slug },
      update: {},
      create: {
        name: groupData.name,
        slug: groupData.slug,
        description: groupData.description,
        icon: groupData.icon,
        color: groupData.color,
        createdById: createdUsers['admin@devcollab.com'].id,
        isActive: true,
      },
    })
    console.log(`  ✅ Group: ${groupData.name}`)
  }

  // ============================================================
  // 4️⃣ SEED PROJECTS (Updated for simplified schema)
  // ============================================================
  console.log('📝 Seeding projects...')

  const projectsData = [
    {
      title: 'EcoTrack - Environmental Monitoring',
      slug: 'ecotrack',
      description: 'Track environmental data using IoT sensors and community reporting',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
      goals: ['Real-time dashboard', 'Sensor API', 'Community reporting'],
      maxTeamSize: 8,
      status: 'IN_PROGRESS' as const,
      difficulty: 'INTERMEDIATE' as const,
      duration: '3 months',
      repositoryUrl: 'https://github.com/ecotrack',
      demoUrl: 'https://ecotrack.demo.com',
      requirements: 'React and Node.js experience',
      learningOutcomes: ['Full-stack development', 'Environmental awareness'],
      groupSlug: 'data-science',
      creatorEmail: 'lead@devcollab.com',
      leadEmail: 'lead@devcollab.com',
      isVerified: true,
      isFeatured: true,
    },
    {
      title: 'DevPortfolio Pro',
      slug: 'devportfolio',
      description: 'Professional portfolio builder with GitHub integration',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
      goals: ['GitHub integration', 'Project gallery', 'Resume builder'],
      maxTeamSize: 6,
      status: 'OPEN' as const,
      difficulty: 'BEGINNER' as const,
      duration: '2 months',
      repositoryUrl: 'https://github.com/devportfolio',
      demoUrl: 'https://devportfolio.demo.com',
      requirements: 'Next.js basics',
      learningOutcomes: ['Next.js', 'Portfolio building'],
      groupSlug: 'web-development',
      creatorEmail: 'lead2@devcollab.com',
      leadEmail: 'lead2@devcollab.com',
      isVerified: true,
      isFeatured: true,
    },
    {
      title: 'AI Chat Assistant',
      slug: 'aichat',
      description: 'AI-powered chatbot for customer support automation',
      techStack: ['Python', 'FastAPI', 'React', 'TensorFlow'],
      goals: ['NLP model', 'Chat interface', 'Admin dashboard'],
      maxTeamSize: 10,
      status: 'IN_PROGRESS' as const,
      difficulty: 'ADVANCED' as const,
      duration: '4 months',
      repositoryUrl: 'https://github.com/aichat',
      demoUrl: 'https://aichat.demo.com',
      requirements: 'Python and React',
      learningOutcomes: ['AI/ML', 'Full-stack development'],
      groupSlug: 'ai-ml',
      creatorEmail: 'admin@devcollab.com',
      leadEmail: 'lead@devcollab.com',
      isVerified: true,
      isFeatured: true,
    },
    {
      title: 'Community Learning Hub',
      slug: 'learnhub',
      description: 'Platform for sharing knowledge and earning badges',
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      goals: ['Learning paths', 'Badge system', 'Real-time chat'],
      maxTeamSize: 12,
      status: 'OPEN' as const,
      difficulty: 'INTERMEDIATE' as const,
      duration: '3 months',
      repositoryUrl: 'https://github.com/learnhub',
      demoUrl: 'https://learnhub.demo.com',
      requirements: 'React and Node.js',
      learningOutcomes: ['Community building', 'Real-time features'],
      groupSlug: 'web-development',
      creatorEmail: 'user@devcollab.com',
      leadEmail: 'lead2@devcollab.com',
      isVerified: false,
      isFeatured: false,
    },
    {
      title: 'HealthTrack Mobile',
      slug: 'healthtrack',
      description: 'Mobile app for tracking health metrics',
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'Firebase'],
      goals: ['Health dashboard', 'Appointment booking', 'Push notifications'],
      maxTeamSize: 8,
      status: 'OPEN' as const,
      difficulty: 'INTERMEDIATE' as const,
      duration: '5 months',
      repositoryUrl: 'https://github.com/healthtrack',
      demoUrl: 'https://healthtrack.demo.com',
      requirements: 'React Native',
      learningOutcomes: ['Mobile development', 'Healthcare app'],
      groupSlug: 'mobile-development',
      creatorEmail: 'user2@devcollab.com',
      leadEmail: 'lead@devcollab.com',
      isVerified: false,
      isFeatured: false,
    },
    {
      title: 'SecurePay Blockchain',
      slug: 'securepay',
      description: 'Blockchain-based payment processing system',
      techStack: ['Solidity', 'React', 'Node.js', 'Web3.js'],
      goals: ['Smart contracts', 'Payment gateway', 'Wallet integration'],
      maxTeamSize: 6,
      status: 'OPEN' as const,
      difficulty: 'ADVANCED' as const,
      duration: '6 months',
      repositoryUrl: 'https://github.com/securepay',
      demoUrl: 'https://securepay.demo.com',
      requirements: 'Blockchain experience',
      learningOutcomes: ['Blockchain', 'Smart contracts'],
      groupSlug: 'blockchain',
      creatorEmail: 'admin@devcollab.com',
      leadEmail: 'lead@devcollab.com',
      isVerified: true,
      isFeatured: true,
    },
    {
      title: 'CyberShield Security',
      slug: 'cybershield',
      description: 'Penetration testing and security analysis platform',
      techStack: ['Python', 'React', 'PostgreSQL'],
      goals: ['Vulnerability scanner', 'Security reports', 'Threat analysis'],
      maxTeamSize: 8,
      status: 'IN_PROGRESS' as const,
      difficulty: 'ADVANCED' as const,
      duration: '4 months',
      repositoryUrl: 'https://github.com/cybershield',
      demoUrl: 'https://cybershield.demo.com',
      requirements: 'Security experience',
      learningOutcomes: ['Cybersecurity', 'Penetration testing'],
      groupSlug: 'cybersecurity',
      creatorEmail: 'admin@devcollab.com',
      leadEmail: 'lead2@devcollab.com',
      isVerified: true,
      isFeatured: false,
    },
    {
      title: 'GameForge Studio',
      slug: 'gameforge',
      description: 'Game development and design platform',
      techStack: ['Unity', 'C#', 'React'],
      goals: ['Game editor', 'Asset library', 'Multiplayer support'],
      maxTeamSize: 10,
      status: 'OPEN' as const,
      difficulty: 'INTERMEDIATE' as const,
      duration: '8 months',
      repositoryUrl: 'https://github.com/gameforge',
      demoUrl: 'https://gameforge.demo.com',
      requirements: 'Unity experience',
      learningOutcomes: ['Game development', 'C#'],
      groupSlug: 'game-development',
      creatorEmail: 'lead@devcollab.com',
      leadEmail: 'lead@devcollab.com',
      isVerified: false,
      isFeatured: false,
    },
    {
      title: 'DesignSystem Pro',
      slug: 'designsystem',
      description: 'UI/UX design system and component library',
      techStack: ['Figma', 'React', 'Storybook', 'Tailwind'],
      goals: ['Component library', 'Design tokens', 'Documentation'],
      maxTeamSize: 5,
      status: 'COMPLETED' as const,
      difficulty: 'BEGINNER' as const,
      duration: '2 months',
      repositoryUrl: 'https://github.com/designsystem',
      demoUrl: 'https://designsystem.demo.com',
      requirements: 'Design experience',
      learningOutcomes: ['UI/UX', 'Design systems'],
      groupSlug: 'graphic-design',
      creatorEmail: 'lead2@devcollab.com',
      leadEmail: 'lead2@devcollab.com',
      isVerified: true,
      isFeatured: true,
    },
    {
      title: 'OpenHealth Initiative',
      slug: 'openhealth',
      description: 'Open source healthcare data platform',
      techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
      goals: ['Data pipeline', 'Analytics dashboard', 'API endpoints'],
      maxTeamSize: 12,
      status: 'IN_PROGRESS' as const,
      difficulty: 'INTERMEDIATE' as const,
      duration: '6 months',
      repositoryUrl: 'https://github.com/openhealth',
      demoUrl: 'https://openhealth.demo.com',
      requirements: 'Python and React',
      learningOutcomes: ['Open source', 'Healthcare data'],
      groupSlug: 'open-source',
      creatorEmail: 'user@devcollab.com',
      leadEmail: 'lead@devcollab.com',
      isVerified: false,
      isFeatured: false,
    },
    {
      title: 'DevOps Pipeline',
      slug: 'devops-pipeline',
      description: 'CI/CD pipeline automation and monitoring',
      techStack: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
      goals: ['Pipeline automation', 'Monitoring', 'Infrastructure as Code'],
      maxTeamSize: 7,
      status: 'OPEN' as const,
      difficulty: 'ADVANCED' as const,
      duration: '3 months',
      repositoryUrl: 'https://github.com/devops-pipeline',
      demoUrl: 'https://devops-pipeline.demo.com',
      requirements: 'DevOps experience',
      learningOutcomes: ['DevOps', 'CI/CD'],
      groupSlug: 'devops',
      creatorEmail: 'admin@devcollab.com',
      leadEmail: 'lead2@devcollab.com',
      isVerified: true,
      isFeatured: false,
    },
  ]

  const createdProjects: Record<string, any> = {}
  for (const projectData of projectsData) {
    const groupId = createdGroups[projectData.groupSlug]?.id
    const creatorId = createdUsers[projectData.creatorEmail]?.id
    const leadId = createdUsers[projectData.leadEmail]?.id

    if (!groupId || !creatorId || !leadId) {
      console.log(`  ⚠️ Skipping ${projectData.title} - missing references`)
      continue
    }

    createdProjects[projectData.slug] = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: {
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        techStack: projectData.techStack,
        goals: projectData.goals,
        maxTeamSize: projectData.maxTeamSize,
        status: projectData.status,
        difficulty: projectData.difficulty,
        duration: projectData.duration,
        repositoryUrl: projectData.repositoryUrl,
        demoUrl: projectData.demoUrl,
        requirements: projectData.requirements,
        learningOutcomes: projectData.learningOutcomes,
        groupId: groupId,
        createdById: creatorId,
        ownerId: creatorId,
        isVerified: projectData.isVerified,
        isFeatured: projectData.isFeatured,
      },
    })
    console.log(`  ✅ Project: ${projectData.title}`)
  }

  // ============================================================
  // 5️⃣ ADD PROJECT MEMBERS
  // ============================================================
  console.log('📝 Adding project members...')

  const memberAssignments = [
    { projectSlug: 'ecotrack', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'ecotrack', userEmail: 'user@devcollab.com' },
    { projectSlug: 'ecotrack', userEmail: 'peter@devcollab.com' },
    { projectSlug: 'devportfolio', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'devportfolio', userEmail: 'admin@devcollab.com' },
    { projectSlug: 'devportfolio', userEmail: 'mary@devcollab.com' },
    { projectSlug: 'aichat', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'aichat', userEmail: 'user2@devcollab.com' },
    { projectSlug: 'learnhub', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'learnhub', userEmail: 'user@devcollab.com' },
    { projectSlug: 'learnhub', userEmail: 'peter@devcollab.com' },
    { projectSlug: 'healthtrack', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'healthtrack', userEmail: 'user2@devcollab.com' },
    { projectSlug: 'securepay', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'securepay', userEmail: 'samuel@devcollab.com' },
    { projectSlug: 'cybershield', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'cybershield', userEmail: 'peter@devcollab.com' },
    { projectSlug: 'gameforge', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'gameforge', userEmail: 'mary@devcollab.com' },
    { projectSlug: 'designsystem', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'designsystem', userEmail: 'admin2@devcollab.com' },
    { projectSlug: 'openhealth', userEmail: 'user@devcollab.com' },
    { projectSlug: 'openhealth', userEmail: 'samuel@devcollab.com' },
    { projectSlug: 'devops-pipeline', userEmail: 'admin@devcollab.com' },
    { projectSlug: 'devops-pipeline', userEmail: 'lead2@devcollab.com' },
  ]

  for (const assignment of memberAssignments) {
    const project = createdProjects[assignment.projectSlug]
    const user = createdUsers[assignment.userEmail]

    if (project && user) {
      await prisma.projectMember.upsert({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: project.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          projectId: project.id,
          status: 'ACTIVE',
          contributionScore: Math.floor(Math.random() * 50) + 10,
          tasksCompleted: Math.floor(Math.random() * 10) + 1,
        },
      })
    }
  }
  console.log('  ✅ Project members added')

  // ============================================================
  // 6️⃣ ADD PROJECT LEADS
  // ============================================================
  console.log('📝 Adding project leads...')

  const leadAssignments = [
    { projectSlug: 'ecotrack', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'devportfolio', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'aichat', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'learnhub', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'healthtrack', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'securepay', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'cybershield', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'gameforge', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'designsystem', userEmail: 'lead2@devcollab.com' },
    { projectSlug: 'openhealth', userEmail: 'lead@devcollab.com' },
    { projectSlug: 'devops-pipeline', userEmail: 'lead2@devcollab.com' },
  ]

  const adminUser = createdUsers['admin@devcollab.com']

  for (const assignment of leadAssignments) {
    const project = createdProjects[assignment.projectSlug]
    const user = createdUsers[assignment.userEmail]

    if (project && user && adminUser) {
      await prisma.projectLead.upsert({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: project.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          projectId: project.id,
          assignedById: adminUser.id,
        },
      })
    }
  }
  console.log('  ✅ Project leads added')

  // ============================================================
  // 7️⃣ SEED TASKS (Updated for simplified TaskStatus)
  // ============================================================
  console.log('📝 Seeding tasks...')

  const tasksData = [
    {
      title: 'Design Dashboard UI',
      description: 'Create wireframes and mockups for the environmental monitoring dashboard',
      projectSlug: 'ecotrack',
      assigneeEmail: 'lead@devcollab.com',
      assignerEmail: 'lead@devcollab.com',
      status: 'ASSIGNED' as const,
      priority: 'HIGH' as const,
      labels: ['design', 'ui'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Implement Sensor API',
      description: 'Build REST API for IoT sensor data ingestion',
      projectSlug: 'ecotrack',
      assigneeEmail: 'user@devcollab.com',
      assignerEmail: 'lead@devcollab.com',
      status: 'TODO' as const,
      priority: 'CRITICAL' as const,
      labels: ['backend', 'api'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Community Reporting Feature',
      description: 'Build form and map for community environmental reports',
      projectSlug: 'ecotrack',
      assigneeEmail: 'peter@devcollab.com',
      assignerEmail: 'lead@devcollab.com',
      status: 'UNASSIGNED' as const,
      priority: 'MEDIUM' as const,
      labels: ['frontend', 'feature'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'GitHub Integration',
      description: 'Connect portfolio with GitHub API to showcase repositories',
      projectSlug: 'devportfolio',
      assigneeEmail: 'lead2@devcollab.com',
      assignerEmail: 'lead2@devcollab.com',
      status: 'COMPLETED' as const,
      priority: 'HIGH' as const,
      labels: ['integration', 'api'],
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Project Gallery',
      description: 'Build gallery component to showcase project screenshots',
      projectSlug: 'devportfolio',
      assigneeEmail: 'admin@devcollab.com',
      assignerEmail: 'lead2@devcollab.com',
      status: 'ASSIGNED' as const,
      priority: 'MEDIUM' as const,
      labels: ['frontend', 'ui'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Resume Builder',
      description: 'Create interactive resume building feature',
      projectSlug: 'devportfolio',
      assigneeEmail: 'mary@devcollab.com',
      assignerEmail: 'lead2@devcollab.com',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      labels: ['feature', 'frontend'],
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'NLP Model Training',
      description: 'Train NLP model for intent recognition and response generation',
      projectSlug: 'aichat',
      assigneeEmail: 'lead@devcollab.com',
      assignerEmail: 'lead@devcollab.com',
      status: 'ASSIGNED' as const,
      priority: 'CRITICAL' as const,
      labels: ['ai', 'machine-learning'],
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Chat Interface UI',
      description: 'Build responsive chat interface with message history',
      projectSlug: 'aichat',
      assigneeEmail: 'admin@devcollab.com',
      assignerEmail: 'lead@devcollab.com',
      status: 'UNASSIGNED' as const,
      priority: 'HIGH' as const,
      labels: ['frontend', 'ui'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Smart Contract Development',
      description: 'Develop and test smart contracts for payment processing',
      projectSlug: 'securepay',
      assigneeEmail: 'lead@devcollab.com',
      assignerEmail: 'admin@devcollab.com',
      status: 'ASSIGNED' as const,
      priority: 'CRITICAL' as const,
      labels: ['blockchain', 'smart-contracts'],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Payment Gateway Integration',
      description: 'Implement payment gateway with wallet integration',
      projectSlug: 'securepay',
      assigneeEmail: 'samuel@devcollab.com',
      assignerEmail: 'admin@devcollab.com',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      labels: ['integration', 'payment'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Vulnerability Scanner',
      description: 'Build vulnerability scanning engine',
      projectSlug: 'cybershield',
      assigneeEmail: 'lead2@devcollab.com',
      assignerEmail: 'admin@devcollab.com',
      status: 'ASSIGNED' as const,
      priority: 'CRITICAL' as const,
      labels: ['security', 'scanning'],
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Security Reports Dashboard',
      description: 'Create dashboard for security reports and analytics',
      projectSlug: 'cybershield',
      assigneeEmail: 'peter@devcollab.com',
      assignerEmail: 'admin@devcollab.com',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      labels: ['dashboard', 'reports'],
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const taskData of tasksData) {
    const project = createdProjects[taskData.projectSlug]
    const assignee = createdUsers[taskData.assigneeEmail]
    const assigner = createdUsers[taskData.assignerEmail]

    if (project && assignee && assigner) {
      const existingTask = await prisma.task.findFirst({
        where: {
          title: taskData.title,
          projectId: project.id,
        },
      })

      if (!existingTask) {
        await prisma.task.create({
          data: {
            title: taskData.title,
            description: taskData.description,
            projectId: project.id,
            assignedToId: assignee.id,
            assignedById: assigner.id,
            status: taskData.status,
            priority: taskData.priority,
            labels: taskData.labels,
            dueDate: taskData.dueDate,
          },
        })
      }
    }
  }
  console.log('  ✅ Tasks added')

  // ============================================================
  // 8️⃣ SEED JOIN REQUESTS
  // ============================================================
  console.log('📝 Seeding join requests...')

  const joinRequestsData = [
    {
      projectSlug: 'ecotrack',
      userEmail: 'mary@devcollab.com',
      status: 'PENDING' as const,
      message: 'I have experience with environmental data and would love to contribute to this project.',
      skills: ['Python', 'Data Analysis', 'React'],
      experience: '2 years',
    },
    {
      projectSlug: 'aichat',
      userEmail: 'samuel@devcollab.com',
      status: 'PENDING' as const,
      message: 'I have experience with AI and NLP. I would like to contribute to this project.',
      skills: ['Python', 'TensorFlow', 'NLP'],
      experience: '3 years',
    },
    {
      projectSlug: 'ecotrack',
      userEmail: 'peter@devcollab.com',
      status: 'APPROVED' as const,
      message: 'I have experience with IoT sensors and data processing.',
      skills: ['IoT', 'Python', 'Data Processing'],
      experience: '3 years',
      reviewerEmail: 'lead@devcollab.com',
      reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      projectSlug: 'securepay',
      userEmail: 'user2@devcollab.com',
      status: 'REJECTED' as const,
      message: 'I would like to join this blockchain project.',
      skills: ['PHP', 'Laravel'],
      experience: '1 year',
      reviewerEmail: 'lead@devcollab.com',
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      rejectionReason: 'We are looking for developers with blockchain/Solidity experience for this project.',
    },
  ]

  for (const requestData of joinRequestsData) {
    const project = createdProjects[requestData.projectSlug]
    const user = createdUsers[requestData.userEmail]
    const reviewer = requestData.reviewerEmail ? createdUsers[requestData.reviewerEmail] : undefined

    if (project && user) {
      const existingRequest = await prisma.joinRequest.findFirst({
        where: {
          userId: user.id,
          projectId: project.id,
        },
      })

      if (!existingRequest) {
        await prisma.joinRequest.create({
          data: {
            userId: user.id,
            projectId: project.id,
            status: requestData.status,
            message: requestData.message,
            skills: requestData.skills,
            experience: requestData.experience,
            reviewedById: reviewer?.id,
            reviewedAt: requestData.reviewedAt,
            rejectionReason: requestData.rejectionReason,
          },
        })
      }
    }
  }
  console.log('  ✅ Join requests added')

  // ============================================================
  // 9️⃣ SEED PROJECT MESSAGES
  // ============================================================
  console.log('📝 Seeding project messages...')

  const messagesData = [
    {
      projectSlug: 'ecotrack',
      userEmail: 'lead@devcollab.com',
      content: 'Welcome everyone to the EcoTrack project! I am excited to work with all of you on this important environmental initiative.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      projectSlug: 'ecotrack',
      userEmail: 'user@devcollab.com',
      content: 'Thank you for having me! I have some ideas for the dashboard design I would like to share.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      projectSlug: 'ecotrack',
      userEmail: 'lead@devcollab.com',
      content: 'Great! Please share your ideas in the project files section. I have created a folder for design mockups.',
      mentions: ['user@devcollab.com'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      projectSlug: 'ecotrack',
      userEmail: 'peter@devcollab.com',
      content: 'I have started working on the sensor API. I should have a draft ready by tomorrow.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ]

  for (const messageData of messagesData) {
    const project = createdProjects[messageData.projectSlug]
    const user = createdUsers[messageData.userEmail]

    if (project && user) {
      await prisma.projectMessage.create({
        data: {
          content: messageData.content,
          projectId: project.id,
          userId: user.id,
          mentions: messageData.mentions || [],
          createdAt: messageData.createdAt,
        },
      })
    }
  }
  console.log('  ✅ Project messages added')

  // ============================================================
  // 🔟 SEED NOTIFICATIONS
  // ============================================================
  console.log('📝 Seeding notifications...')

  const notificationsData = [
    {
      userEmail: 'user@devcollab.com',
      projectSlug: 'ecotrack',
      title: 'Welcome to EcoTrack',
      message: 'You have been added to the EcoTrack project team.',
      type: 'PROJECT' as const,
      link: '/projects/ecotrack/dashboard',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      userEmail: 'peter@devcollab.com',
      projectSlug: 'ecotrack',
      title: 'Join Request Approved',
      message: 'Your request to join EcoTrack has been approved! Welcome to the team.',
      type: 'REQUEST' as const,
      link: '/projects/ecotrack/dashboard',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      userEmail: 'lead@devcollab.com',
      projectSlug: 'ecotrack',
      title: 'New Task Assigned',
      message: 'You have been assigned a new task: Design Dashboard UI',
      type: 'TASK' as const,
      link: '/projects/ecotrack/tasks',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      userEmail: 'mary@devcollab.com',
      projectSlug: 'devportfolio',
      title: 'Join Request Pending',
      message: 'Your request to join DevPortfolio Pro is pending review.',
      type: 'REQUEST' as const,
      link: '/projects/devportfolio',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      userEmail: 'samuel@devcollab.com',
      projectSlug: 'aichat',
      title: 'Join Request Pending',
      message: 'Your request to join AI Chat Assistant is pending review.',
      type: 'REQUEST' as const,
      link: '/projects/aichat',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      userEmail: 'user2@devcollab.com',
      title: 'Welcome to DevCollab Hub',
      message: 'Welcome to the platform! Start exploring projects and connect with developers.',
      type: 'SYSTEM' as const,
      link: '/projects',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]

  for (const notifData of notificationsData) {
    const user = createdUsers[notifData.userEmail]
    const project = notifData.projectSlug ? createdProjects[notifData.projectSlug] : undefined

    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          projectId: project?.id,
          title: notifData.title,
          message: notifData.message,
          type: notifData.type,
          link: notifData.link,
          createdAt: notifData.createdAt,
        },
      })
    }
  }
  console.log('  ✅ Notifications added')

  // ============================================================
  // 1️⃣1️⃣ UPDATE PROJECT MEMBER COUNTS
  // ============================================================
  console.log('📝 Updating project member counts...')

  for (const slug in createdProjects) {
    const project = createdProjects[slug]
    const count = await prisma.projectMember.count({
      where: { projectId: project.id },
    })
    await prisma.project.update({
      where: { id: project.id },
      data: { currentMembers: count },
    })
  }
  console.log('  ✅ Project member counts updated')

  // ============================================================
  // 📊 SUMMARY
  // ============================================================
  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`  ✅ ${Object.keys(createdRoles).length} roles created`)
  console.log(`  ✅ ${Object.keys(createdUsers).length} users created`)
  console.log(`  ✅ ${Object.keys(createdGroups).length} groups created`)
  console.log(`  ✅ ${Object.keys(createdProjects).length} projects created`)
  console.log(`  ✅ ${memberAssignments.length} project members added`)
  console.log(`  ✅ ${leadAssignments.length} project leads added`)
  console.log(`  ✅ ${tasksData.length} tasks created`)
  console.log(`  ✅ ${joinRequestsData.length} join requests created`)
  console.log(`  ✅ ${messagesData.length} messages created`)
  console.log(`  ✅ ${notificationsData.length} notifications created`)

  console.log('\n📧 Test Users:')
  console.log('  superadmin@devcollab.com → password123 (SUPERADMIN)')
  console.log('  admin@devcollab.com → password123 (ADMIN)')
  console.log('  admin2@devcollab.com → password123 (ADMIN)')
  console.log('  lead@devcollab.com → password123 (PROJECT_LEAD)')
  console.log('  lead2@devcollab.com → password123 (PROJECT_LEAD)')
  console.log('  user@devcollab.com → password123 (USER)')
  console.log('  user2@devcollab.com → password123 (USER)')
  console.log('  peter@devcollab.com → password123 (USER)')
  console.log('  mary@devcollab.com → password123 (USER)')
  console.log('  samuel@devcollab.com → password123 (USER)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
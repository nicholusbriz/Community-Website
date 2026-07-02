# Community Ecosystem Website

A comprehensive community platform where members can collaborate, learn, communicate, manage projects, share knowledge, and participate in community activities.

## Objective

To build a community platform that enables seamless collaboration and communication among community members through various integrated modules.

## Proposed Modules

1. **User Authentication** - Secure registration and login system
2. **User Profile Management** - Personalized user profiles
3. **Project Management** - Create and manage community projects
4. **Task Assignment** - Assign and track tasks within teams
5. **Community Forum** - Discussion boards and community posts
6. **Events Management** - Organize and manage community events
7. **Learning Resources** - Share educational content and resources
8. **Team Chat & Messaging** - Real-time communication tools
9. **Admin Dashboard** - Administrative control panel
10. **Reports & Analytics** - Data insights and reporting

## Team Responsibilities

### 1. System Analysis & Design
- Gather system requirements
- Identify actors and use cases
- Create UML diagrams using StarUML:
  - Use Case Diagram
  - Class Diagram
  - Sequence Diagram
  - Activity Diagram
  - ER Diagram

### 2. Frontend Development
- Design responsive user interfaces
- Develop pages using HTML, CSS, JavaScript, Bootstrap, or React

### 3. Backend Development
- Develop REST APIs
- Handle authentication and authorization
- Connect the frontend with the database
- Implement business logic

### 4. Database Team
- Design the database
- Create tables and relationships
- Optimize queries and ensure data integrity

### 5. UI/UX Team
- Design wireframes and prototypes
- Maintain a consistent user experience

### 6. Cybersecurity Team
- Secure authentication
- Protect against SQL Injection and XSS
- Implement access control and data protection

### 7. Testing & Quality Assurance
- Perform functional testing
- Report bugs
- Verify all modules work correctly

## Main Actors

- **Visitor** - Unauthenticated users browsing the platform
- **Member** - Registered community members
- **Team Leader** - Members with project management privileges
- **Administrator** - System administrators with full access

## Core Features

- User Registration & Login
- User Profiles
- Community Posts
- Comments & Likes
- Project Creation
- Task Assignment
- Team Messaging
- Events Management
- Learning Resources
- Admin Dashboard
- Reports

## Technologies

### Frontend
- HTML, CSS, JavaScript
- React (Next.js 16.2.10)
- Tailwind CSS 4
- TypeScript

### Backend (Planned)
- Node.js & Express or Python & Django

### Database (Planned)
- MySQL or PostgreSQL

### Development Tools
- Version Control: Git & GitHub
- System Modeling: StarUML

## Deliverables

- Software Requirements Specification (SRS)
- Complete UML Diagrams
- Database Design
- Frontend Implementation
- Backend APIs
- Testing Report
- Final Deployment

## Design Theme

The project uses a nature-inspired green and brown color scheme:

### Light Mode
- Primary: `#2e7d32` (Forest Green)
- Background: `#f8f5f0` (Warm Beige)
- Card: `#f8f5f0` (Warm Beige)
- Foreground: `#3e2723` (Dark Brown)
- Accent: `#c8e6c9` (Light Green)

### Dark Mode
- Primary: `#4caf50` (Green)
- Background: `#1c2a1f` (Dark Green)
- Card: `#2d3a2e` (Dark Green)
- Foreground: `#f0ebe5` (Light Beige)
- Accent: `#388e3c` (Medium Green)

### Typography
- Sans-serif: Montserrat
- Serif: Merriweather
- Mono: Source Code Pro

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Community-Website/my-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
Community-Website/
├── my-app/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── globals.css       # Global styles and theme
│   │   └── layout.tsx        # Root layout
│   ├── package.json          # Dependencies
│   └── tsconfig.json         # TypeScript configuration
└── README.md                 # This file
```

## Contributing

Let's work together, communicate regularly, and deliver a professional community platform that showcases our skills and teamwork.

## License

This project is developed for educational purposes as part of the System Analysis & Design course.

export const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: 'avatar1' },
  { id: 2, name: 'Bob Williams', email: 'bob@example.com', avatar: 'avatar2' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'avatar3' },
  { id: 4, name: 'Diana Miller', email: 'diana@example.com', avatar: 'avatar4' },
];

export const workspaces = [
  { id: 1, name: 'SaaS Innovations' },
  { id: 2, name: 'Digital Marketing Agency' },
  { id: 3, name: 'E-commerce Ventures' },
];

export const leads = [
  { id: 1, name: 'Tech Solutions Inc.', contact: 'contact@techsolutions.com', status: 'New', assignedTo: 1, value: 5000 },
  { id: 2, name: 'Global Imports Co.', contact: 'info@globalimports.com', status: 'Contacted', assignedTo: 1, value: 12000 },
  { id: 3, name: 'Creative Designs LLC', contact: 'hello@creativedesigns.com', status: 'Qualified', assignedTo: 2, value: 7500 },
  { id: 4, name: 'Innovate Startups', contact: 'pitch@innovate.com', status: 'Proposal', assignedTo: 3, value: 25000 },
  { id: 5, name: 'Local Eatery Group', contact: 'catering@localeats.com', status: 'Negotiation', assignedTo: 2, value: 3000 },
  { id: 6, name: 'HealthFirst Clinics', contact: 'partners@healthfirst.com', status: 'Won', assignedTo: 4, value: 18000 },
  { id: 7, name: 'Legacy Bank', contact: 'services@legacybank.com', status: 'Lost', assignedTo: 1, value: 10000 },
  { id: 8, 'name': 'NextGen Software', 'contact': 'sales@nextgen.dev', 'status': 'New', 'assignedTo': 3, 'value': 22000 },
];

export const tasks = [
  { id: 1, title: 'Follow up with Tech Solutions Inc.', assignedTo: 1, dueDate: '2024-08-15', status: 'In Progress', leadId: 1 },
  { id: 2, title: 'Prepare proposal for Innovate Startups', assignedTo: 3, dueDate: '2024-08-10', status: 'Completed', leadId: 4 },
  { id: 3, title: 'Schedule demo for Creative Designs LLC', assignedTo: 2, dueDate: '2024-08-12', status: 'In Progress', leadId: 3 },
  { id: 4, title: 'Initial call with Local Eatery Group', assignedTo: 2, dueDate: '2024-08-20', status: 'Not Started', leadId: 5 },
  { id: 5, title: 'Send contract to HealthFirst Clinics', assignedTo: 4, dueDate: '2024-08-05', status: 'Completed', leadId: 6 },
];

export const calls = [
  { id: 1, leadId: 2, type: 'Outgoing', duration: '5:32', status: 'Completed', audioUrl: '#', timestamp: '2024-08-01 10:15 AM' },
  { id: 2, leadId: 3, type: 'Incoming', duration: '12:10', status: 'Completed', audioUrl: '#', timestamp: '2024-08-02 02:45 PM' },
  { id: 3, leadId: 4, type: 'Outgoing', duration: '8:55', status: 'Completed', audioUrl: '#', timestamp: '2024-08-03 11:00 AM' },
  { id: 4, leadId: 5, type: 'Missed', duration: '0:00', status: 'Missed', audioUrl: null, timestamp: '2024-08-04 09:30 AM' },
];

export const activities = [
  { id: 1, userId: 1, action: 'Created Task', objectType: 'Task', objectId: 1, timestamp: '2024-08-01 09:00 AM', ipAddress: '192.168.1.1' },
  { id: 2, userId: 2, action: 'Updated Lead Status', objectType: 'Lead', objectId: 3, details: 'New -> Qualified', timestamp: '2024-08-01 09:30 AM', ipAddress: '192.168.1.5' },
  { id: 3, userId: 3, action: 'Logged Call', objectType: 'Call', objectId: 3, timestamp: '2024-08-03 11:08 AM', ipAddress: '10.0.0.2' },
  { id: 4, userId: 4, action: 'Updated Settings', objectType: 'Workspace', objectId: 1, details: 'Notifications enabled', timestamp: '2024-08-05 04:00 PM', ipAddress: '172.16.0.10' },
  { id: 5, userId: 1, action: 'Changed Lead Status', objectType: 'Lead', objectId: 7, details: 'Negotiation -> Lost', timestamp: '2024-08-06 10:00 AM', ipAddress: '192.168.1.1' },
];

export const notifications = [
    { id: 1, title: 'New task assigned', description: 'Follow up with Tech Solutions Inc. has been assigned to you.', timestamp: '2024-08-01 09:00 AM', read: false },
    { id: 2, title: 'Lead status updated', description: 'Bob Williams updated Creative Designs LLC to "Qualified".', timestamp: '2024-08-01 09:30 AM', read: false },
    { id: 3, title: 'Call logged', description: 'A call with Innovate Startups was logged.', timestamp: '2024-08-03 11:08 AM', read: true },
    { id: 4, title: 'Settings updated', description: 'Notifications have been enabled in your workspace.', timestamp: '2024-08-05 04:00 PM', read: true },
];

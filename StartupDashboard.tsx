import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { LogOut, Rocket, Users, Filter, Send, CheckCircle, Clock, X } from 'lucide-react';
import { ProjectCreationForm } from './ProjectCreationForm';
import { InvestorCard } from './InvestorCard';
import { FilterPanel } from './FilterPanel';
import { FloatingLogo } from './FloatingLogo';
import { NotificationSystem } from './NotificationSystem';
import { ConnectionRequestModal } from './ConnectionRequestModal';
import type { StartupProject, Investor, ConnectionRequest, Notification } from '../App';

interface StartupDashboardProps {
  currentUser: any;
  onLogout: () => void;
  sendConnectionRequest: (
    toUserId: string, 
    toUserName: string, 
    toUserCompany: string, 
    toUserRole: 'startup' | 'investor',
    message?: string,
    projectName?: string
  ) => void;
  respondToConnectionRequest: (requestId: string, response: 'accepted' | 'rejected') => void;
  connectionRequests: ConnectionRequest[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  incomingRequests: ConnectionRequest[];
  outgoingRequests: ConnectionRequest[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
}

// Mock investor data
const mockInvestors: Investor[] = [
  {
    id: 'investor1',
    name: 'Sarah Chen',
    company: 'TechVentures Capital',
    focusAreas: ['HealthTech', 'AI', 'SaaS'],
    fundingStage: ['Seed', 'Series A'],
    description: 'Early-stage investor focused on healthcare innovation and AI-driven solutions. 15+ years experience in tech investing.',
    location: 'San Francisco, CA'
  },
  {
    id: 'investor2',
    name: 'Michael Rodriguez',
    company: 'GreenFund Partners',
    focusAreas: ['Sustainability', 'CleanTech', 'AgriTech'],
    fundingStage: ['Pre-seed', 'Seed'],
    description: 'Passionate about sustainable technology and environmental impact. Focus on early-stage climate solutions.',
    location: 'Austin, TX'
  },
  {
    id: 'investor3',
    name: 'Lisa Wang',
    company: 'EdTech Innovations',
    focusAreas: ['EdTech', 'FinTech', 'Consumer'],
    fundingStage: ['Seed', 'Series A', 'Series B'],
    description: 'Former educator turned investor. Specializes in education technology and financial inclusion platforms.',
    location: 'Boston, MA'
  },
  {
    id: 'investor4',
    name: 'David Kumar',
    company: 'AI Ventures',
    focusAreas: ['AI', 'Machine Learning', 'Enterprise'],
    fundingStage: ['Series A', 'Series B'],
    description: 'Deep tech investor with PhD in Computer Science. Focus on enterprise AI and machine learning applications.',
    location: 'New York, NY'
  }
];

export function StartupDashboard({ 
  currentUser, 
  onLogout, 
  sendConnectionRequest,
  respondToConnectionRequest,
  connectionRequests,
  notifications,
  unreadNotificationsCount,
  incomingRequests,
  outgoingRequests,
  markNotificationAsRead,
  markAllNotificationsAsRead
}: StartupDashboardProps) {
  const [activeTab, setActiveTab] = useState('project');
  const [project, setProject] = useState<StartupProject | null>(null);
  const [filteredInvestors, setFilteredInvestors] = useState(mockInvestors);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleProjectCreated = (projectData: StartupProject) => {
    setProject(projectData);
    setActiveTab('investors');
  };

  const handleFilterChange = (filters: any) => {
    let filtered = mockInvestors;
    
    if (filters.focusAreas.length > 0) {
      filtered = filtered.filter(investor => 
        investor.focusAreas.some(area => filters.focusAreas.includes(area))
      );
    }
    
    if (filters.fundingStages.length > 0) {
      filtered = filtered.filter(investor => 
        investor.fundingStage.some(stage => filters.fundingStages.includes(stage))
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(investor => 
        investor.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    setFilteredInvestors(filtered);
  };

  const handleSendRequest = (investor: Investor) => {
    setSelectedInvestor(investor);
    setShowRequestModal(true);
  };

  const handleConnectionRequest = (
    toUserId: string, 
    toUserName: string, 
    toUserCompany: string, 
    toUserRole: 'startup' | 'investor',
    message?: string
  ) => {
    sendConnectionRequest(toUserId, toUserName, toUserCompany, toUserRole, message, project?.name);
    setShowRequestModal(false);
    setSelectedInvestor(null);
  };

  const getRequestStatus = (investorId: string) => {
    const request = outgoingRequests.find(req => req.toUserId === investorId);
    return request?.status || null;
  };

  return (
    <div className="min-h-screen sky-gradient relative">
      <FloatingLogo variant="primary" position="top-right" animation="float" />
      <FloatingLogo variant="secondary" position="bottom-left" animation="delayed" size="sm" />
      
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-white">FundLink</h1>
                <p className="text-sm text-blue-200">Startup Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationSystem
                notifications={notifications}
                unreadCount={unreadNotificationsCount}
                incomingRequests={incomingRequests}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={() => markAllNotificationsAsRead(currentUser.id)}
                onRespondToRequest={respondToConnectionRequest}
              />
              <div className="text-right">
                <p className="text-white">{currentUser.name}</p>
                <p className="text-sm text-blue-200">{currentUser.company}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg bg-white/10 border-white/20">
            <TabsTrigger value="project" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200">
              Project Setup
            </TabsTrigger>
            <TabsTrigger value="investors" disabled={!project} className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200 disabled:text-blue-300/50">
              Find Investors
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200">
              My Connections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="mt-8">
            {!project ? (
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Create Your Project Profile</CardTitle>
                  <p className="text-blue-200">
                    Complete your project profile to start connecting with investors. 
                    This information will be visible only to verified investors.
                  </p>
                </CardHeader>
                <CardContent>
                  <ProjectCreationForm 
                    onProjectCreated={handleProjectCreated}
                    currentUser={currentUser}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <span>Your Project: {project.name}</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-white mb-2">Idea</h4>
                    <p className="text-blue-200">{project.idea}</p>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Category</h4>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{project.category}</Badge>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Target Audience</h4>
                    <p className="text-blue-200">{project.targetAudience}</p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('investors')}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-none"
                  >
                    <Users className="w-4 h-4" />
                    Find Investors
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="investors" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white">Discover Investors</h2>
                  <p className="text-blue-200">
                    Connect with investors interested in your category: {project?.category}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <Card className="glass-card border-white/20">
                  <CardContent className="pt-6">
                    <FilterPanel onFilterChange={handleFilterChange} type="investor" />
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6">
                {filteredInvestors.map(investor => {
                  const requestStatus = getRequestStatus(investor.id);
                  return (
                    <InvestorCard
                      key={investor.id}
                      investor={investor}
                      onSendRequest={() => handleSendRequest(investor)}
                      requestStatus={requestStatus}
                    />
                  );
                })}
              </div>

              {filteredInvestors.length === 0 && (
                <Card className="text-center py-12 glass-card border-white/20">
                  <CardContent>
                    <Users className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-white">No investors found</h3>
                    <p className="text-blue-200">
                      Try adjusting your filters to find more investors.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-white">Connection Requests</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Outgoing Requests */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Sent Requests ({outgoingRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {outgoingRequests.length === 0 ? (
                      <p className="text-blue-200 text-center py-4">No requests sent yet</p>
                    ) : (
                      <div className="space-y-3">
                        {outgoingRequests.map(request => (
                          <div key={request.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <p className="text-white">{request.fromUserName}</p>
                              <p className="text-sm text-blue-200">{request.fromUserCompany}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {request.status === 'pending' && (
                                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </Badge>
                              )}
                              {request.status === 'accepted' && (
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Accepted
                                </Badge>
                              )}
                              {request.status === 'rejected' && (
                                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 flex items-center gap-1">
                                  <X className="w-3 h-3" />
                                  Declined
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Incoming Requests */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Received Requests ({incomingRequests.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {incomingRequests.length === 0 ? (
                      <p className="text-blue-200 text-center py-4">No incoming requests</p>
                    ) : (
                      <div className="space-y-3">
                        {incomingRequests.map(request => (
                          <div key={request.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-white">{request.fromUserName}</p>
                                <p className="text-sm text-blue-200">{request.fromUserCompany}</p>
                              </div>
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {request.fromUserRole}
                              </Badge>
                            </div>
                            {request.message && (
                              <p className="text-blue-200 text-sm mb-3">{request.message}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => respondToConnectionRequest(request.id, 'accepted')}
                                className="flex-1 bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => respondToConnectionRequest(request.id, 'rejected')}
                                variant="outline"
                                className="flex-1 bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                              >
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ConnectionRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSendRequest={handleConnectionRequest}
        recipient={selectedInvestor}
        recipientType="investor"
        senderRole="startup"
        senderProject={project || undefined}
      />
    </div>
  );
}
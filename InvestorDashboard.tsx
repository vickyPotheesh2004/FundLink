import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, TrendingUp, Filter, Search, Bookmark, Send, Users, CheckCircle, Clock, X } from 'lucide-react';
import { StartupCard } from './StartupCard';
import { FilterPanel } from './FilterPanel';
import { FloatingLogo } from './FloatingLogo';
import { NotificationSystem } from './NotificationSystem';
import { ConnectionRequestModal } from './ConnectionRequestModal';
import type { StartupProject, ConnectionRequest, Notification } from '../App';

interface InvestorDashboardProps {
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

// Mock startup data
const mockStartups: StartupProject[] = [
  {
    id: 'startup1',
    name: 'MedAssist AI',
    idea: 'AI-powered diagnostic assistant that helps doctors analyze medical images and provide preliminary diagnoses with 95% accuracy.',
    implementation: 'Healthcare industry, starting with hospitals in North America and expanding to developing countries.',
    targetAudience: 'Healthcare providers, hospitals, diagnostic centers, and medical professionals.',
    problemSolution: 'Addresses the shortage of radiologists and reduces diagnostic errors. Provides faster, more accurate preliminary diagnoses.',
    category: 'HealthTech',
    userId: 'startup1'
  },
  {
    id: 'startup2',
    name: 'EcoFarm Solutions',
    idea: 'IoT-based smart farming platform that optimizes crop yield while reducing water usage by 40% through precision agriculture.',
    implementation: 'Agricultural sector, focusing on medium to large farms in water-scarce regions globally.',
    targetAudience: 'Commercial farmers, agricultural cooperatives, and agtech companies.',
    problemSolution: 'Solves water scarcity in agriculture and improves crop yields through data-driven farming decisions.',
    category: 'AgriTech',
    userId: 'startup2'
  },
  {
    id: 'startup3',
    name: 'LearnPath',
    idea: 'Personalized AI tutor that adapts to individual learning styles and provides customized educational content for K-12 students.',
    implementation: 'Education sector, targeting schools and homeschooling families in English-speaking markets.',
    targetAudience: 'K-12 students, parents, teachers, and educational institutions.',
    problemSolution: 'Addresses the one-size-fits-all problem in education by providing personalized learning experiences.',
    category: 'EdTech',
    userId: 'startup3'
  },
  {
    id: 'startup4',
    name: 'CyberShield',
    idea: 'Real-time cybersecurity platform that uses machine learning to detect and prevent cyber threats before they impact businesses.',
    implementation: 'Enterprise market, focusing on small to medium businesses that lack robust cybersecurity infrastructure.',
    targetAudience: 'SMB business owners, IT managers, and companies with limited cybersecurity resources.',
    problemSolution: 'Provides enterprise-level cybersecurity protection at an affordable price point for smaller businesses.',
    category: 'Cybersecurity',
    userId: 'startup4'
  },
  {
    id: 'startup5',
    name: 'GreenEnergy Hub',
    idea: 'Peer-to-peer renewable energy trading platform that allows households to buy and sell excess solar energy.',
    implementation: 'Residential energy market, starting in regions with high solar adoption like California and Australia.',
    targetAudience: 'Homeowners with solar panels, environmentally conscious consumers, and energy cooperatives.',
    problemSolution: 'Enables better utilization of renewable energy and provides additional income for solar panel owners.',
    category: 'CleanTech',
    userId: 'startup5'
  }
];

export function InvestorDashboard({ 
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
}: InvestorDashboardProps) {
  const [activeTab, setActiveTab] = useState('startups');
  const [filteredStartups, setFilteredStartups] = useState(mockStartups);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedStartups, setBookmarkedStartups] = useState<string[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<StartupProject | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleFilterChange = (filters: any) => {
    let filtered = mockStartups;
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(startup => 
        filters.categories.includes(startup.category)
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredStartups(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = mockStartups;
    
    if (query) {
      filtered = filtered.filter(startup =>
        startup.name.toLowerCase().includes(query.toLowerCase()) ||
        startup.idea.toLowerCase().includes(query.toLowerCase()) ||
        startup.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredStartups(filtered);
  };

  const handleBookmark = (startupId: string) => {
    setBookmarkedStartups(prev => 
      prev.includes(startupId) 
        ? prev.filter(id => id !== startupId)
        : [...prev, startupId]
    );
  };

  const handleSendRequest = (startup: StartupProject) => {
    setSelectedStartup(startup);
    setShowRequestModal(true);
  };

  const handleConnectionRequest = (
    toUserId: string, 
    toUserName: string, 
    toUserCompany: string, 
    toUserRole: 'startup' | 'investor',
    message?: string
  ) => {
    sendConnectionRequest(toUserId, toUserName, toUserCompany, toUserRole, message);
    setShowRequestModal(false);
    setSelectedStartup(null);
  };

  const getRequestStatus = (startupId: string) => {
    const request = outgoingRequests.find(req => req.toUserId === startupId);
    return request?.status || null;
  };

  return (
    <div className="min-h-screen sky-gradient relative">
      <FloatingLogo variant="secondary" position="top-left" animation="float" />
      <FloatingLogo variant="accent" position="bottom-right" animation="delayed" size="sm" />
      
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-white">FundLink</h1>
                <p className="text-sm text-blue-200">Investor Dashboard</p>
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
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/10 border-white/20">
            <TabsTrigger value="startups" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200">
              Discover Startups
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-blue-200">
              My Connections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="startups" className="mt-8">
            <div className="space-y-6">
              {/* Header Section */}
              <div>
                <h2 className="text-white">Discover Startups</h2>
                <p className="text-blue-200">
                  Browse innovative startup ideas seeking investment. Connect with founders that match your investment criteria.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
                  <Input
                    placeholder="Search startups by name, idea, or category..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300"
                  />
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

              {/* Filter Panel */}
              {showFilters && (
                <Card className="glass-card border-white/20">
                  <CardContent className="pt-6">
                    <FilterPanel onFilterChange={handleFilterChange} type="startup" />
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="glass-card border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-blue-200">Total Startups</span>
                    </div>
                    <p className="text-2xl text-white">{filteredStartups.length}</p>
                  </CardContent>
                </Card>
                <Card className="glass-card border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-blue-200">Bookmarked</span>
                    </div>
                    <p className="text-2xl text-white">{bookmarkedStartups.length}</p>
                  </CardContent>
                </Card>
                <Card className="glass-card border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-blue-200">Requests Sent</span>
                    </div>
                    <p className="text-2xl text-white">{outgoingRequests.length}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Startup Feed */}
              <div className="space-y-6">
                {filteredStartups.map(startup => {
                  const requestStatus = getRequestStatus(startup.id);
                  return (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      isBookmarked={bookmarkedStartups.includes(startup.id)}
                      requestStatus={requestStatus}
                      onBookmark={handleBookmark}
                      onSendRequest={() => handleSendRequest(startup)}
                    />
                  );
                })}
              </div>

              {filteredStartups.length === 0 && (
                <Card className="text-center py-12 glass-card border-white/20">
                  <CardContent>
                    <TrendingUp className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-white">No startups found</h3>
                    <p className="text-blue-200">
                      Try adjusting your search or filters to discover more startups.
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
                              {request.projectName && (
                                <p className="text-xs text-blue-300">Project: {request.projectName}</p>
                              )}
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
                                {request.projectName && (
                                  <p className="text-xs text-blue-300">Project: {request.projectName}</p>
                                )}
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
        recipient={selectedStartup}
        recipientType="startup"
        senderRole="investor"
      />
    </div>
  );
}
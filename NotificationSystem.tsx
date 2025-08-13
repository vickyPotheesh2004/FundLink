import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { 
  Bell, 
  Check, 
  X, 
  Clock, 
  User, 
  Building2, 
  Rocket, 
  TrendingUp,
  MessageSquare,
  CheckCheck,
  Eye
} from 'lucide-react';
import type { Notification, ConnectionRequest } from '../App';

interface NotificationSystemProps {
  notifications: Notification[];
  unreadCount: number;
  incomingRequests: ConnectionRequest[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onRespondToRequest: (requestId: string, response: 'accepted' | 'rejected') => void;
}

export function NotificationSystem({
  notifications,
  unreadCount,
  incomingRequests,
  onMarkAsRead,
  onMarkAllAsRead,
  onRespondToRequest
}: NotificationSystemProps) {
  const [selectedRequest, setSelectedRequest] = useState<ConnectionRequest | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleViewRequest = (request: ConnectionRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
    setResponseMessage('');
  };

  const handleRespondToRequest = (response: 'accepted' | 'rejected') => {
    if (selectedRequest) {
      onRespondToRequest(selectedRequest.id, response);
      setShowRequestModal(false);
      setSelectedRequest(null);
      setResponseMessage('');
    }
  };

  const getNotificationIcon = (type: string, fromUserRole?: string) => {
    switch (type) {
      case 'connection_request':
        return fromUserRole === 'startup' ? 
          <Rocket className="w-4 h-4 text-blue-400" /> : 
          <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'request_accepted':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'request_rejected':
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-slate-800/95 border-white/20 backdrop-blur-sm" align="end">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h4 className="text-white">Notifications</h4>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMarkAllAsRead}
                  className="text-blue-300 hover:text-white hover:bg-white/10"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="h-80">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 mx-auto text-blue-400 mb-2 opacity-50" />
                <p className="text-blue-200">No notifications yet</p>
                <p className="text-sm text-blue-300">New connection requests will appear here</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map(notification => {
                  const relatedRequest = incomingRequests.find(req => req.id === notification.relatedRequestId);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg mb-2 border transition-colors ${
                        notification.isRead 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-blue-500/10 border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type, relatedRequest?.fromUserRole)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-white text-sm truncate">{notification.title}</h5>
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMarkAsRead(notification.id)}
                                className="ml-2 h-6 w-6 p-0 text-blue-300 hover:text-white"
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-blue-200 text-sm mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-blue-300 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {notification.type === 'connection_request' && relatedRequest && (
                              <Button
                                size="sm"
                                onClick={() => handleViewRequest(relatedRequest)}
                                className="h-6 px-2 text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-none"
                              >
                                View Request
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Connection Request Modal */}
      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-md bg-slate-800/95 border-white/20 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {selectedRequest?.fromUserRole === 'startup' ? 
                <Rocket className="w-5 h-5 text-blue-400" /> : 
                <TrendingUp className="w-5 h-5 text-green-400" />
              }
              Connection Request
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              Review and respond to this connection request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <Card className="glass-card border-white/20">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{selectedRequest.fromUserName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">{selectedRequest.fromUserCompany}</span>
                    </div>
                    {selectedRequest.projectName && (
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-200">Project: {selectedRequest.projectName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">{formatTimeAgo(selectedRequest.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedRequest.message && (
                <div>
                  <Label className="text-blue-200 flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Label>
                  <Card className="glass-card border-white/20">
                    <CardContent className="pt-4">
                      <p className="text-blue-200">{selectedRequest.message}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <Label htmlFor="response" className="text-blue-200">Response (Optional)</Label>
                <Textarea
                  id="response"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Add a personal note with your response..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 mt-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleRespondToRequest('accepted')}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white border-none"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleRespondToRequest('rejected')}
                  variant="outline"
                  className="flex-1 bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
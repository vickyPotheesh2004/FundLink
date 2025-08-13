import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  Send, 
  User, 
  Building2, 
  MapPin, 
  Target, 
  Rocket, 
  TrendingUp,
  Badge as BadgeIcon
} from 'lucide-react';
import { Badge } from './ui/badge';
import type { Investor, StartupProject } from '../App';

interface ConnectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (
    toUserId: string, 
    toUserName: string, 
    toUserCompany: string, 
    toUserRole: 'startup' | 'investor',
    message?: string,
    projectName?: string
  ) => void;
  recipient: Investor | StartupProject | null;
  recipientType: 'investor' | 'startup';
  senderRole: 'startup' | 'investor';
  senderProject?: StartupProject;
}

export function ConnectionRequestModal({
  isOpen,
  onClose,
  onSendRequest,
  recipient,
  recipientType,
  senderRole,
  senderProject
}: ConnectionRequestModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!recipient) return;

    setIsLoading(true);

    try {
      const recipientId = recipient.id;
      const recipientName = recipientType === 'investor' 
        ? (recipient as Investor).name 
        : (recipient as StartupProject).name;
      const recipientCompany = recipientType === 'investor' 
        ? (recipient as Investor).company 
        : `${(recipient as StartupProject).name} (Startup)`;

      onSendRequest(
        recipientId,
        recipientName,
        recipientCompany,
        recipientType,
        message || undefined,
        senderProject?.name
      );

      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!recipient) return null;

  const isInvestor = recipientType === 'investor';
  const investor = isInvestor ? recipient as Investor : null;
  const startup = !isInvestor ? recipient as StartupProject : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800/95 border-white/20 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            Send Connection Request
          </DialogTitle>
          <DialogDescription className="text-blue-200">
            Connect with {isInvestor ? investor!.name : startup!.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Recipient Info */}
          <Card className="glass-card border-white/20">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {isInvestor ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <Rocket className="w-5 h-5 text-blue-400" />
                  )}
                  <span className="text-white">
                    {isInvestor ? investor!.name : startup!.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200">
                    {isInvestor ? investor!.company : `${startup!.name} (Startup)`}
                  </span>
                </div>

                {isInvestor && investor!.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200">{investor!.location}</span>
                  </div>
                )}

                {isInvestor && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">Focus Areas</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {investor!.focusAreas.slice(0, 3).map(area => (
                        <Badge key={area} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          {area}
                        </Badge>
                      ))}
                      {investor!.focusAreas.length > 3 && (
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          +{investor!.focusAreas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {!isInvestor && startup && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-200">Category</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {startup.category}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sender Project Info (for startups) */}
          {senderRole === 'startup' && senderProject && (
            <Card className="glass-card border-white/20">
              <CardContent className="pt-4">
                <h5 className="text-white mb-2 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-blue-400" />
                  Your Project
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">{senderProject.name}</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                      {senderProject.category}
                    </Badge>
                  </div>
                  <p className="text-blue-300 text-sm">{senderProject.idea.slice(0, 100)}...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-blue-200">
              Personal Message {senderRole === 'investor' ? '(Recommended)' : '(Optional)'}
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                senderRole === 'startup' 
                  ? "Introduce yourself and explain why this investor would be a great fit for your startup..."
                  : "Explain your investment interests and why you'd like to connect with this startup..."
              }
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 mt-2"
              rows={4}
            />
            <p className="text-xs text-blue-300 mt-1">
              {senderRole === 'startup' 
                ? "Tip: Mention specific reasons why this investor aligns with your project"
                : "Tip: Describe your investment criteria and what value you can provide"
              }
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
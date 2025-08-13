import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bookmark, Send, MapPin, Users, Lightbulb, CheckCircle, Clock, X } from 'lucide-react';
import type { StartupProject } from '../App';

interface StartupCardProps {
  startup: StartupProject;
  isBookmarked: boolean;
  requestStatus: 'pending' | 'accepted' | 'rejected' | null;
  onBookmark: (startupId: string) => void;
  onSendRequest: () => void;
}

export function StartupCard({ 
  startup, 
  isBookmarked, 
  requestStatus,
  onBookmark, 
  onSendRequest 
}: StartupCardProps) {
  const getStatusButton = () => {
    switch (requestStatus) {
      case 'pending':
        return (
          <Button disabled size="sm" className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Clock className="w-4 h-4" />
            Request Pending
          </Button>
        );
      case 'accepted':
        return (
          <Button disabled size="sm" className="flex items-center gap-2 bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="w-4 h-4" />
            Connected
          </Button>
        );
      case 'rejected':
        return (
          <Button disabled size="sm" className="flex items-center gap-2 bg-red-500/20 text-red-300 border-red-500/30">
            <X className="w-4 h-4" />
            Request Declined
          </Button>
        );
      default:
        return (
          <Button 
            onClick={onSendRequest}
            size="sm" 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-none"
          >
            <Send className="w-4 h-4" />
            Connect
          </Button>
        );
    }
  };

  return (
    <Card className="glass-card glass-card-hover border-white/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-white">
              {startup.name}
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">{startup.category}</Badge>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmark(startup.id)}
              className={`${isBookmarked ? 'text-yellow-400' : 'text-blue-300'} hover:bg-white/10`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <h4 className="text-white">The Idea</h4>
          </div>
          <p className="text-blue-200">{startup.idea}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h4 className="text-white">Target Audience</h4>
          </div>
          <p className="text-blue-200">{startup.targetAudience}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <h4 className="text-white">Implementation</h4>
          </div>
          <p className="text-blue-200">{startup.implementation}</p>
        </div>

        <div>
          <h4 className="mb-2 text-white">Problem & Solution</h4>
          <p className="text-blue-200">{startup.problemSolution}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Active Profile</span>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
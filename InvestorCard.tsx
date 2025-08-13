import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Send, MapPin, Building2, Target, CheckCircle, Clock, X } from 'lucide-react';
import type { Investor } from '../App';

interface InvestorCardProps {
  investor: Investor;
  requestStatus: 'pending' | 'accepted' | 'rejected' | null;
  onSendRequest: () => void;
}

export function InvestorCard({ investor, requestStatus, onSendRequest }: InvestorCardProps) {
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
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white border-none"
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
            <CardTitle className="text-white">{investor.name}</CardTitle>
            <div className="flex items-center gap-2 text-blue-200">
              <Building2 className="w-4 h-4" />
              <span>{investor.company}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200">
              <MapPin className="w-4 h-4" />
              <span>{investor.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-white">About</h4>
          <p className="text-blue-200">{investor.description}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <h4 className="text-white">Focus Areas</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {investor.focusAreas.map(area => (
              <Badge key={area} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">{area}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-white">Funding Stages</h4>
          <div className="flex flex-wrap gap-2">
            {investor.fundingStage.map(stage => (
              <Badge key={stage} variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">{stage}</Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Active Investor</span>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
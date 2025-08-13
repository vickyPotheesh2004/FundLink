import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: any) => void;
  type: 'startup' | 'investor';
}

const startupCategories = [
  'HealthTech',
  'EdTech', 
  'FinTech',
  'AI & Machine Learning',
  'SaaS',
  'E-commerce',
  'Sustainability',
  'CleanTech',
  'AgriTech',
  'Consumer Tech',
  'Enterprise Software',
  'Blockchain',
  'IoT',
  'Cybersecurity'
];

const investorFocusAreas = [
  'HealthTech',
  'AI',
  'SaaS',
  'Sustainability',
  'CleanTech',
  'AgriTech',
  'EdTech',
  'FinTech',
  'Consumer',
  'Enterprise',
  'Machine Learning'
];

const fundingStages = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Growth'
];

export function FilterPanel({ onFilterChange, type }: FilterPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [selectedFundingStages, setSelectedFundingStages] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(updated);
    
    if (type === 'startup') {
      onFilterChange({ categories: updated, fundingStages: selectedFundingStages, location });
    }
  };

  const handleFocusAreaChange = (area: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedFocusAreas, area]
      : selectedFocusAreas.filter(a => a !== area);
    setSelectedFocusAreas(updated);
    
    if (type === 'investor') {
      onFilterChange({ focusAreas: updated, fundingStages: selectedFundingStages, location });
    }
  };

  const handleFundingStageChange = (stage: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedFundingStages, stage]
      : selectedFundingStages.filter(s => s !== stage);
    setSelectedFundingStages(updated);
    
    const filters = type === 'startup' 
      ? { categories: selectedCategories, fundingStages: updated, location }
      : { focusAreas: selectedFocusAreas, fundingStages: updated, location };
    
    onFilterChange(filters);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    const filters = type === 'startup'
      ? { categories: selectedCategories, fundingStages: selectedFundingStages, location: value }
      : { focusAreas: selectedFocusAreas, fundingStages: selectedFundingStages, location: value };
    
    onFilterChange(filters);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedFocusAreas([]);
    setSelectedFundingStages([]);
    setLocation('');
    
    const emptyFilters = type === 'startup'
      ? { categories: [], fundingStages: [], location: '' }
      : { focusAreas: [], fundingStages: [], location: '' };
    
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedFocusAreas.length > 0 || 
                          selectedFundingStages.length > 0 || 
                          location.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-blue-300 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label className="text-blue-200">Location</Label>
        <Input
          placeholder="Enter city, state, or country"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-blue-300"
        />
      </div>

      {/* Category/Focus Area Filter */}
      <div className="space-y-3">
        <Label className="text-blue-200">
          {type === 'startup' ? 'Categories' : 'Focus Areas'}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {(type === 'startup' ? startupCategories : investorFocusAreas).map(item => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={type === 'startup' 
                  ? selectedCategories.includes(item)
                  : selectedFocusAreas.includes(item)
                }
                onCheckedChange={(checked) => 
                  type === 'startup' 
                    ? handleCategoryChange(item, checked as boolean)
                    : handleFocusAreaChange(item, checked as boolean)
                }
              />
              <Label htmlFor={item} className="text-sm text-blue-200">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Funding Stage Filter */}
      <div className="space-y-3">
        <Label className="text-blue-200">Funding Stages</Label>
        <div className="grid grid-cols-2 gap-3">
          {fundingStages.map(stage => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox
                id={stage}
                checked={selectedFundingStages.includes(stage)}
                onCheckedChange={(checked) => 
                  handleFundingStageChange(stage, checked as boolean)
                }
              />
              <Label htmlFor={stage} className="text-sm text-blue-200">
                {stage}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <Label className="text-blue-200">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
                {category}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => handleCategoryChange(category, false)}
                />
              </Badge>
            ))}
            {selectedFocusAreas.map(area => (
              <Badge key={area} variant="secondary" className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border-blue-500/30">
                {area}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => handleFocusAreaChange(area, false)}
                />
              </Badge>
            ))}
            {selectedFundingStages.map(stage => (
              <Badge key={stage} variant="outline" className="flex items-center gap-1 bg-green-500/20 text-green-300 border-green-500/30">
                {stage}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => handleFundingStageChange(stage, false)}
                />
              </Badge>
            ))}
            {location && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-purple-500/20 text-purple-300 border-purple-500/30">
                📍 {location}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-white" 
                  onClick={() => handleLocationChange('')}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { StartupProject } from '../App';

interface ProjectCreationFormProps {
  onProjectCreated: (project: StartupProject) => void;
  currentUser: any;
}

const categories = [
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
  'Cybersecurity',
  'Other'
];

export function ProjectCreationForm({ onProjectCreated, currentUser }: ProjectCreationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    idea: '',
    implementation: '',
    targetAudience: '',
    problemSolution: '',
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.idea.trim()) newErrors.idea = 'Project idea is required';
    if (!formData.implementation.trim()) newErrors.implementation = 'Implementation details are required';
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
    if (!formData.problemSolution.trim()) newErrors.problemSolution = 'Problem solution is required';
    if (!formData.category) newErrors.category = 'Category selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const project: StartupProject = {
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      userId: currentUser.id
    };

    onProjectCreated(project);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-blue-200">Startup/Project Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your startup or project name"
            className={`bg-white/10 border-white/20 text-white placeholder:text-blue-300 ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-blue-200">Category/Domain *</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger className={`bg-white/10 border-white/20 text-white ${errors.category ? 'border-red-400' : ''}`}>
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {categories.map(category => (
                <SelectItem key={category} value={category} className="text-white hover:bg-white/10">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-400">{errors.category}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idea" className="text-blue-200">What is your idea? *</Label>
        <Textarea
          id="idea"
          value={formData.idea}
          onChange={(e) => handleChange('idea', e.target.value)}
          placeholder="Describe your startup idea in detail. What makes it unique?"
          rows={4}
          className={`bg-white/10 border-white/20 text-white placeholder:text-blue-300 ${errors.idea ? 'border-red-400' : ''}`}
        />
        {errors.idea && <p className="text-sm text-red-400">{errors.idea}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="implementation" className="text-blue-200">Where will this idea be implemented? *</Label>
        <Textarea
          id="implementation"
          value={formData.implementation}
          onChange={(e) => handleChange('implementation', e.target.value)}
          placeholder="Describe the market, industry, region where you plan to implement this idea"
          rows={3}
          className={`bg-white/10 border-white/20 text-white placeholder:text-blue-300 ${errors.implementation ? 'border-red-400' : ''}`}
        />
        {errors.implementation && <p className="text-sm text-red-400">{errors.implementation}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="text-blue-200">Who is it intended for? *</Label>
        <Textarea
          id="targetAudience"
          value={formData.targetAudience}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
          placeholder="Define your target audience. Who are your potential customers?"
          rows={3}
          className={`bg-white/10 border-white/20 text-white placeholder:text-blue-300 ${errors.targetAudience ? 'border-red-400' : ''}`}
        />
        {errors.targetAudience && <p className="text-sm text-red-400">{errors.targetAudience}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="problemSolution" className="text-blue-200">How does it solve a problem? *</Label>
        <Textarea
          id="problemSolution"
          value={formData.problemSolution}
          onChange={(e) => handleChange('problemSolution', e.target.value)}
          placeholder="Explain what problem your idea solves and how it provides a solution"
          rows={4}
          className={`bg-white/10 border-white/20 text-white placeholder:text-blue-300 ${errors.problemSolution ? 'border-red-400' : ''}`}
        />
        {errors.problemSolution && <p className="text-sm text-red-400">{errors.problemSolution}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-none">
          Create Project Profile
        </Button>
      </div>

      <div className="bg-black/20 p-4 rounded-lg border border-white/10">
        <h4 className="flex items-center gap-2 mb-2 text-white">
          🔒 Privacy Notice
        </h4>
        <p className="text-sm text-blue-200">
          Your project information will only be visible to verified investors on our platform. 
          We maintain strict confidentiality and do not share your data with other startups or external parties.
        </p>
      </div>
    </form>
  );
}
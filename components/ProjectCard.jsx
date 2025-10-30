'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, IndianRupee } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {project.projectName}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {project.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{project.builderName}</span>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-green-600" />
          <Badge variant="secondary" className="font-semibold">
            {project.priceRange}
          </Badge>
        </div>
        {project.lat && project.lng && (
          <div className="text-xs text-gray-500 mt-2">
            Coordinates: {project.lat.toFixed(4)}, {project.lng.toFixed(4)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

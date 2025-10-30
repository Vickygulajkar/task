'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useProjectStore from '@/store/useProjectStore';
import ProjectCard from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertCircle, MapPin } from 'lucide-react';

const ProjectsMap = dynamic(() => import('@/components/ProjectsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function CityPage() {
  const params = useParams();
  const rawParam = params.cityName;
  const cityName = Array.isArray(rawParam) ? rawParam[0] : rawParam;

  const { projects, isLoading, setLoading, addProject, clearProjects, setError } = useProjectStore();
  const [isMounted, setIsMounted] = useState(false);
  const lastFetchedCityRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      // Prevent duplicate fetch in React Strict Mode (dev) for the same city
      if (lastFetchedCityRef.current === cityName) return;
      lastFetchedCityRef.current = cityName;
      clearProjects();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/scrapeProjects?cityName=${encodeURIComponent(cityName)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        if (data.projects.length === 0) {
          toast.warning('No projects found', {
            description: data.message || 'Try a different city name',
          });
          setLoading(false);
          return;
        }

        for (const project of data.projects) {
          try {
            // If coordinates are already provided by the API (e.g., demo fallback), use them directly
            if (project.lat && project.lng) {
              addProject(project);
              continue;
            }

            const geocodeResponse = await fetch('/api/geocode', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ location: `${project.location}, India` }),
            });

            if (geocodeResponse.ok) {
              const coords = await geocodeResponse.json();
              addProject({ ...project, lat: coords.lat, lng: coords.lng });
            } else {
              addProject({ ...project, lat: null, lng: null });
            }

          } catch (error) {
            console.error('Geocoding error for project:', project.projectName, error);
            addProject({ ...project, lat: null, lng: null });
          }
        }

        toast.success('Projects loaded successfully', {
          description: `Found ${data.projects.length} projects in ${cityName}`,
        });
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        toast.error('Failed to load projects', {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [cityName, clearProjects, setLoading, addProject, setError]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              Real Estate Projects in {String(cityName).replace(/-/g, ' ')}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
          <div className="overflow-y-auto space-y-4 pr-2">
            <h2 className="text-xl font-semibold text-gray-800 sticky top-0 bg-gray-50 py-2 z-10">
              Project Listings {projects.length > 0 && `(${projects.length})`}
            </h2>

            {isLoading && projects.length === 0 && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && projects.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No projects found</AlertTitle>
                <AlertDescription>
                  No real estate projects were found for {String(cityName)}. Try searching for a different city.
                </AlertDescription>
              </Alert>
            )}

            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {isLoading && projects.length > 0 && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading more projects...</span>
              </div>
            )}
          </div>

          <div className="h-full sticky top-[160px]">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Map View</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {projects.filter(p => p.lat && p.lng).length} projects with location data
                </p>
              </div>
              <div className="h-[calc(100%-80px)]">
                {projects.length > 0 ? (
                  <ProjectsMap projects={projects} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Map will appear once projects are loaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


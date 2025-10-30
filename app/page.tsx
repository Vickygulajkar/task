'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Search } from 'lucide-react';

export default function Home() {
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      const formattedCity = city.toLowerCase().trim().replace(/\s+/g, '-');
      router.push(`/city/${formattedCity}`);
    }
  };

  const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">MagicBricks RE Projects</h1>
          </div>
          <p className="text-xl text-gray-600">
            Discover real estate projects across Indian cities
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search for Projects
            </CardTitle>
            <CardDescription>
              Enter a city name to view available real estate projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., Mumbai, Delhi, Bangalore..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!city.trim()}>
                <MapPin className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Popular Cities:</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((popularCity) => (
                  <Button
                    key={popularCity}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const formattedCity = popularCity.toLowerCase();
                      router.push(`/city/${formattedCity}`);
                    }}
                  >
                    {popularCity}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Projects are scraped in real-time from MagicBricks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interactive Maps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View project locations on an interactive map with markers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get project name, location, price range, and builder details
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

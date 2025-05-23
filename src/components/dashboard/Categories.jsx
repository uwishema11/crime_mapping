import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: 'Theft',
      description: 'Crimes involving the unlawful taking of property',
      crimeCount: 45,
    },
    {
      id: 2,
      name: 'Assault',
      description: 'Physical attacks or threats of violence',
      crimeCount: 23,
    },
    {
      id: 3,
      name: 'Vandalism',
      description: 'Deliberate destruction or damage to property',
      crimeCount: 17,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Crime Categories</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                {category.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {category.crimeCount} reported cases
                </span>
                <Link to={`/user-dashboard/categories/${category.id}`}>
                  <Button variant="outline" size="sm">
                    View Crimes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

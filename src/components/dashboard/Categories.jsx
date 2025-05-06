import React from 'react';
import { useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import useCategories from '@/store/useCrimeCategories';

export default function Categories() {
  const { categories, fetchCategories, loading, error, deleteCategory } =
    useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FadeLoader
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

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

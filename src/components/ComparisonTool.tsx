
import React from 'react';
import { Brand, calculateOverallRating } from '@/utils/brandData';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Square } from 'lucide-react';

interface ComparisonToolProps {
  selectedBrands: Brand[];
  onRemove: (brandId: string) => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ selectedBrands, onRemove }) => {
  if (selectedBrands.length === 0) {
    return null;
  }

  const ratingCategories = [
    { key: 'quality', label: 'Quality' },
    { key: 'reputation', label: 'Reputation' },
    { key: 'sustainability', label: 'Sustainability' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'customerService', label: 'Customer Service' }
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center">Brand Comparison</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-accent">
              <th className="p-4 text-left text-brand-primary font-semibold border-b">Criteria</th>
              {selectedBrands.map(brand => (
                <th key={brand.id} className="p-4 text-center border-b">
                  <div className="flex flex-col items-center gap-2">
                    <img src={brand.logo} alt={brand.name} className="h-8 w-auto" />
                    <span className="font-semibold">{brand.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemove(brand.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ratingCategories.map(category => (
              <tr key={category.key} className="hover:bg-muted/50">
                <td className="p-4 border-b font-medium">{category.label}</td>
                {selectedBrands.map(brand => (
                  <td key={`${brand.id}-${category.key}`} className="p-4 text-center border-b">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">
                        {brand.rating[category.key as keyof Brand['rating']]}
                      </span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full my-2">
                        <div 
                          className="h-2 bg-brand-secondary rounded-full" 
                          style={{ 
                            width: `${(brand.rating[category.key as keyof Brand['rating']] as number / 5) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-brand-accent/50">
              <td className="p-4 border-b font-bold">Overall Rating</td>
              {selectedBrands.map(brand => (
                <td key={`${brand.id}-overall`} className="p-4 text-center border-b">
                  <span className="text-xl font-bold text-brand-primary">
                    {calculateOverallRating(brand.rating)}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Industry</td>
              {selectedBrands.map(brand => (
                <td key={`${brand.id}-industry`} className="p-4 text-center border-b">
                  {brand.industry}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Established</td>
              {selectedBrands.map(brand => (
                <td key={`${brand.id}-established`} className="p-4 text-center border-b">
                  {brand.established}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Website</td>
              {selectedBrands.map(brand => (
                <td key={`${brand.id}-website`} className="p-4 text-center border-b">
                  <a 
                    href={`https://${brand.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline"
                  >
                    {brand.website}
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTool;

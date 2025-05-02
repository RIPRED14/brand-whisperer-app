
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brand, calculateOverallRating } from '@/utils/brandData';

interface BrandCardProps {
  brand: Brand;
  onCompare: (brand: Brand) => void;
  isSelected: boolean;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onCompare, isSelected }) => {
  const overallRating = calculateOverallRating(brand.rating);

  return (
    <Card className={`w-full card-hover ${isSelected ? 'ring-2 ring-brand-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <img 
            src={brand.logo} 
            alt={`${brand.name} logo`}
            className="h-10 w-auto"
          />
          <div>
            <h3 className="text-lg font-semibold">{brand.name}</h3>
            <p className="text-sm text-muted-foreground">Since {brand.established}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-brand-accent text-brand-primary">
          {brand.industry}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{brand.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Quality</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-brand-secondary rounded-full" 
                  style={{ width: `${(brand.rating.quality / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold">{brand.rating.quality}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Sustainability</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-brand-secondary rounded-full" 
                  style={{ width: `${(brand.rating.sustainability / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold">{brand.rating.sustainability}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Innovation</span>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-2 bg-brand-secondary rounded-full" 
                  style={{ width: `${(brand.rating.innovation / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold">{brand.rating.innovation}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-brand-primary">{overallRating}</div>
          <div className="text-xs text-muted-foreground ml-1">/ 5.0</div>
        </div>
        <Button 
          onClick={() => onCompare(brand)} 
          variant={isSelected ? "default" : "outline"}
          className={isSelected ? "bg-brand-primary hover:bg-brand-dark" : "hover:bg-brand-light"}
        >
          {isSelected ? "Selected" : "Compare"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BrandCard;

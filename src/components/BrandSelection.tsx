
import React, { useState, useEffect } from 'react';
import { Brand } from '@/utils/brandData';
import BrandCard from './BrandCard';
import SearchBar from './SearchBar';

interface BrandSelectionProps {
  brands: Brand[];
  onCompare: (brand: Brand) => void;
  selectedBrands: Brand[];
}

const BrandSelection: React.FC<BrandSelectionProps> = ({ 
  brands, 
  onCompare, 
  selectedBrands 
}) => {
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>(brands);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  useEffect(() => {
    let filtered = [...brands];
    
    if (searchQuery) {
      filtered = filtered.filter(brand => 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (industryFilter !== 'all') {
      filtered = filtered.filter(brand => brand.industry === industryFilter);
    }
    
    setFilteredBrands(filtered);
  }, [searchQuery, industryFilter, brands]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleIndustryFilter = (industry: string) => {
    setIndustryFilter(industry);
  };

  const isSelected = (brand: Brand) => {
    return selectedBrands.some(selected => selected.id === brand.id);
  };

  return (
    <div className="w-full space-y-6">
      <SearchBar onSearch={handleSearch} onIndustryFilter={handleIndustryFilter} />
      
      {filteredBrands.length === 0 ? (
        <div className="text-center py-10 animate-fade-in">
          <h3 className="text-xl font-medium text-gray-500">No brands found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand, index) => (
            <div key={brand.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <BrandCard 
                brand={brand} 
                onCompare={onCompare} 
                isSelected={isSelected(brand)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandSelection;

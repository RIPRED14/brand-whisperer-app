
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { industries } from '@/utils/brandData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onIndustryFilter: (industry: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onIndustryFilter }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search for brands..."
          value={query}
          onChange={handleSearch}
          className="w-full py-6 px-4 bg-white shadow-sm border-none brand-shadow focus:ring-2 focus:ring-brand-secondary"
        />
      </div>
      <div className="w-full md:w-64">
        <Select onValueChange={onIndustryFilter}>
          <SelectTrigger className="py-6 px-4 bg-white shadow-sm border-none brand-shadow focus:ring-2 focus:ring-brand-secondary">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchBar;

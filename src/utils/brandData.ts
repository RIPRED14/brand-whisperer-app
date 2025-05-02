
export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  rating: {
    quality: number;
    reputation: number;
    sustainability: number;
    innovation: number;
    customerService: number;
  };
  established: string;
  website: string;
}

export const brandData: Brand[] = [
  {
    id: "1",
    name: "EcoTech",
    logo: "https://placehold.co/80x40/0A6A8B/FFFFFF?text=EcoTech",
    description: "Innovative tech solutions with sustainability at the core",
    industry: "Technology",
    rating: {
      quality: 4.5,
      reputation: 4.2,
      sustainability: 4.8,
      innovation: 4.7,
      customerService: 3.9
    },
    established: "2010",
    website: "ecotech.example.com"
  },
  {
    id: "2",
    name: "GreenLife",
    logo: "https://placehold.co/80x40/1D9AAD/FFFFFF?text=GreenLife",
    description: "Eco-friendly products for sustainable living",
    industry: "Consumer Goods",
    rating: {
      quality: 4.3,
      reputation: 4.6,
      sustainability: 4.9,
      innovation: 4.0,
      customerService: 4.2
    },
    established: "2008",
    website: "greenlife.example.com"
  },
  {
    id: "3",
    name: "NovaCraft",
    logo: "https://placehold.co/80x40/0A4253/FFFFFF?text=NovaCraft",
    description: "Artisanal quality with modern manufacturing",
    industry: "Manufacturing",
    rating: {
      quality: 4.8,
      reputation: 4.4,
      sustainability: 3.8,
      innovation: 4.2,
      customerService: 4.5
    },
    established: "2001",
    website: "novacraft.example.com"
  },
  {
    id: "4",
    name: "PureFoods",
    logo: "https://placehold.co/80x40/2A8899/FFFFFF?text=PureFoods",
    description: "Natural, organic food products",
    industry: "Food & Beverage",
    rating: {
      quality: 4.6,
      reputation: 4.7,
      sustainability: 4.5,
      innovation: 3.9,
      customerService: 4.3
    },
    established: "2005",
    website: "purefoods.example.com"
  },
  {
    id: "5",
    name: "Stellaris",
    logo: "https://placehold.co/80x40/134F62/FFFFFF?text=Stellaris",
    description: "Innovative solutions for modern businesses",
    industry: "Professional Services",
    rating: {
      quality: 4.4,
      reputation: 4.3,
      sustainability: 3.7,
      innovation: 4.5,
      customerService: 4.6
    },
    established: "2012",
    website: "stellaris.example.com"
  },
  {
    id: "6",
    name: "VitalCare",
    logo: "https://placehold.co/80x40/1984A7/FFFFFF?text=VitalCare",
    description: "Healthcare solutions for a healthier tomorrow",
    industry: "Healthcare",
    rating: {
      quality: 4.7,
      reputation: 4.5,
      sustainability: 4.0,
      innovation: 4.6,
      customerService: 4.4
    },
    established: "2007",
    website: "vitalcare.example.com"
  }
];

export const industries = [...new Set(brandData.map(brand => brand.industry))];

export const calculateOverallRating = (ratings: Brand["rating"]) => {
  const sum = Object.values(ratings).reduce((acc, val) => acc + val, 0);
  return (sum / Object.keys(ratings).length).toFixed(1);
};

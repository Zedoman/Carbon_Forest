import React, { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Leaf,
  Droplets,
  Wind,
  ArrowUpDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ForestParcel {
  id: string;
  name: string;
  location: string;
  size: number;
  carbonPotential: number;
  expectedYield: number;
  price: number;
  imageUrl: string;
  biodiversityScore: number;
  waterConservation: number;
  airQualityImprovement: number;
}

interface ForestParcelGridProps {
  parcels?: ForestParcel[];
  onParcelSelect?: (parcel: ForestParcel) => void;
  onFilterChange?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  minSize?: number;
  maxSize?: number;
  minCarbonPotential?: number;
  maxCarbonPotential?: number;
  minYield?: number;
  maxYield?: number;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: "price" | "size" | "carbonPotential" | "expectedYield";
  sortDirection?: "asc" | "desc";
}

const defaultParcels: ForestParcel[] = [
  {
    id: "1",
    name: "Amazon Rainforest Plot A",
    location: "Brazil",
    size: 500,
    carbonPotential: 2500,
    expectedYield: 8.5,
    price: 75000,
    imageUrl:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
    biodiversityScore: 95,
    waterConservation: 90,
    airQualityImprovement: 85,
  },
  {
    id: "2",
    name: "Borneo Lowland Forest",
    location: "Indonesia",
    size: 350,
    carbonPotential: 1800,
    expectedYield: 7.2,
    price: 52000,
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    biodiversityScore: 88,
    waterConservation: 85,
    airQualityImprovement: 80,
  },
  {
    id: "3",
    name: "Congo Basin Reserve",
    location: "Democratic Republic of Congo",
    size: 620,
    carbonPotential: 3100,
    expectedYield: 9.1,
    price: 93000,
    imageUrl:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80",
    biodiversityScore: 92,
    waterConservation: 88,
    airQualityImprovement: 90,
  },
  {
    id: "4",
    name: "Taiga Forest Preserve",
    location: "Russia",
    size: 800,
    carbonPotential: 2800,
    expectedYield: 6.8,
    price: 68000,
    imageUrl:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80",
    biodiversityScore: 82,
    waterConservation: 78,
    airQualityImprovement: 85,
  },
  {
    id: "5",
    name: "Costa Rican Cloud Forest",
    location: "Costa Rica",
    size: 280,
    carbonPotential: 1500,
    expectedYield: 8.9,
    price: 65000,
    imageUrl:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80",
    biodiversityScore: 96,
    waterConservation: 94,
    airQualityImprovement: 92,
  },
  {
    id: "6",
    name: "Appalachian Mixed Forest",
    location: "United States",
    size: 420,
    carbonPotential: 1900,
    expectedYield: 7.5,
    price: 58000,
    imageUrl:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",
    biodiversityScore: 84,
    waterConservation: 86,
    airQualityImprovement: 82,
  },
];

const ForestParcelGrid: React.FC<ForestParcelGridProps> = ({
  parcels = defaultParcels,
  onParcelSelect = () => {},
  onFilterChange = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: "price",
    sortDirection: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSort = (field: FilterOptions["sortBy"]) => {
    if (field) {
      const direction =
        filters.sortBy === field && filters.sortDirection === "asc"
          ? "desc"
          : "asc";
      handleFilterChange({ sortBy: field, sortDirection: direction });
    }
  };

  const filteredParcels = parcels
    .filter(
      (parcel) =>
        parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (!filters.sortBy) return 0;

      const direction = filters.sortDirection === "desc" ? -1 : 1;

      switch (filters.sortBy) {
        case "price":
          return (a.price - b.price) * direction;
        case "size":
          return (a.size - b.size) * direction;
        case "carbonPotential":
          return (a.carbonPotential - b.carbonPotential) * direction;
        case "expectedYield":
          return (a.expectedYield - b.expectedYield) * direction;
        default:
          return 0;
      }
    });

  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("price")}
              className="flex items-center gap-1"
            >
              Price
              <ArrowUpDown
                size={14}
                className={
                  filters.sortBy === "price"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("carbonPotential")}
              className="flex items-center gap-1"
            >
              Carbon
              <ArrowUpDown
                size={14}
                className={
                  filters.sortBy === "carbonPotential"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("expectedYield")}
              className="flex items-center gap-1"
            >
              Yield
              <ArrowUpDown
                size={14}
                className={
                  filters.sortBy === "expectedYield"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />
            </Button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-muted p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Size (hectares)</h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  handleFilterChange({
                    minSize: Number(e.target.value) || undefined,
                  })
                }
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  handleFilterChange({
                    maxSize: Number(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Carbon Potential (tons)</h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  handleFilterChange({
                    minCarbonPotential: Number(e.target.value) || undefined,
                  })
                }
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  handleFilterChange({
                    maxCarbonPotential: Number(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Expected Yield (%)</h4>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  handleFilterChange({
                    minYield: Number(e.target.value) || undefined,
                  })
                }
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border rounded-md"
                onChange={(e) =>
                  handleFilterChange({
                    maxYield: Number(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParcels.map((parcel) => (
          <Card
            key={parcel.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => onParcelSelect(parcel)}
          >
            <div className="relative h-48 w-full">
              <img
                src={parcel.imageUrl}
                alt={parcel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center text-white gap-2">
                  <MapPin size={16} />
                  <span>{parcel.location}</span>
                </div>
              </div>
            </div>

            <CardHeader>
              <CardTitle>{parcel.name}</CardTitle>
              <CardDescription>
                {parcel.size} hectares | {parcel.carbonPotential} tons CO₂
                potential
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
                  <Leaf className="text-green-500 mb-1" size={20} />
                  <span className="text-xs font-medium">Biodiversity</span>
                  <span className="text-sm font-bold">
                    {parcel.biodiversityScore}%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
                  <Droplets className="text-blue-500 mb-1" size={20} />
                  <span className="text-xs font-medium">Water</span>
                  <span className="text-sm font-bold">
                    {parcel.waterConservation}%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-muted rounded-lg">
                  <Wind className="text-purple-500 mb-1" size={20} />
                  <span className="text-xs font-medium">Air Quality</span>
                  <span className="text-sm font-bold">
                    {parcel.airQualityImprovement}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Expected Yield
                  </span>
                  <p className="font-bold text-green-600">
                    {parcel.expectedYield}% annually
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <p className="font-bold">${parcel.price.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the Card's onClick from firing
                  onParcelSelect(parcel);
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredParcels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No forest parcels match your search criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm("");
              setFilters({ sortBy: "price", sortDirection: "asc" });
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForestParcelGrid;
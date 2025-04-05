import React, { useState } from "react";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, RefreshCw, Filter } from "lucide-react";

interface MarketFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  priceRange: [number, number];
  carbonYield: [number, number];
  location: string;
  forestTypes: string[];
  certifications: string[];
  searchQuery: string;
  sortBy: string;
}

const MarketFilters: React.FC<MarketFiltersProps> = ({
  onFilterChange,
  className = "",
}) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 20000], // Adjusted to cover all token prices (max is $18,200)
    carbonYield: [0, 50], // Adjusted to cover all token carbon yields (max is 32 tons/year)
    location: "",
    forestTypes: [],
    certifications: [],
    searchQuery: "",
    sortBy: "newest",
  });

  const forestTypeOptions = [
    "Rainforest",
    "Temperate",
    "Boreal",
    "Mangrove",
    "Cloud Forest",
  ];

  const certificationOptions = [
    "Gold Standard",
    "Verra VCS",
    "Climate Action Reserve",
    "Plan Vivo",
    "American Carbon Registry",
  ];

  const locationOptions = [
    "North America",
    "South America",
    "Europe",
    "Africa",
    "Asia",
    "Central America",
  ];

  const handleForestTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => {
      const newForestTypes = checked
        ? [...prev.forestTypes, type]
        : prev.forestTypes.filter((t) => t !== type);

      const newFilters = { ...prev, forestTypes: newForestTypes };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleCertificationChange = (cert: string, checked: boolean) => {
    setFilters((prev) => {
      const newCertifications = checked
        ? [...prev.certifications, cert]
        : prev.certifications.filter((c) => c !== cert);

      const newFilters = { ...prev, certifications: newCertifications };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newFilters = {
      ...filters,
      priceRange: value as [number, number],
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCarbonYieldChange = (value: number[]) => {
    const newFilters = {
      ...filters,
      carbonYield: value as [number, number],
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleLocationChange = (value: string) => {
    const newFilters = { ...filters, location: value === "all" ? "" : value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 20000],
      carbonYield: [0, 50],
      location: "",
      forestTypes: [],
      certifications: [],
      searchQuery: "",
      sortBy: "newest",
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 flex flex-col h-full ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
        <div className="relative">
          <Input
            placeholder="Search forest tokens..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Sort By</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-3 w-3" />
            Reset
          </Button>
        </div>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="yield-high">Highest Yield</SelectItem>
            <SelectItem value="size-large">Largest Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Price Range (USD)</h3>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            min={0}
            max={20000}
            step={100}
            onValueChange={handlePriceRangeChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Carbon Yield (tCO₂e/year)</h3>
        <div className="px-2">
          <Slider
            value={filters.carbonYield}
            min={0}
            max={50}
            step={1}
            onValueChange={handleCarbonYieldChange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{filters.carbonYield[0]}</span>
            <span>{filters.carbonYield[1]}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Location</h3>
        <Select
          value={filters.location || "all"}
          onValueChange={handleLocationChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locationOptions.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Forest Type</h3>
        <div className="space-y-2">
          {forestTypeOptions.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`forest-${type}`}
                checked={filters.forestTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handleForestTypeChange(type, checked === true)
                }
              />
              <label
                htmlFor={`forest-${type}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Certifications</h3>
        <div className="space-y-2">
          {certificationOptions.map((cert) => (
            <div key={cert} className="flex items-center space-x-2">
              <Checkbox
                id={`cert-${cert}`}
                checked={filters.certifications.includes(cert)}
                onCheckedChange={(checked) =>
                  handleCertificationChange(cert, checked === true)
                }
              />
              <label
                htmlFor={`cert-${cert}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {cert}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketFilters;
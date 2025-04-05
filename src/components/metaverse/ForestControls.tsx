import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Info,
  Sun,
  Moon,
  Trees,
  Layers,
  Camera,
  Download,
  Share2,
} from "lucide-react";

interface ForestControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: (degrees: number) => void;
  onToggleVisibility?: (layerName: string, visible: boolean) => void;
  onTimeChange?: (time: "day" | "night") => void;
  onSeasonChange?: (season: string) => void;
  onViewChange?: (view: string) => void;
  onCapture?: () => void;
}

const ForestControls = ({
  onZoomIn = () => {},
  onZoomOut = () => {},
  onRotate = () => {},
  onToggleVisibility = () => {},
  onTimeChange = () => {},
  onSeasonChange = () => {},
  onViewChange = () => {},
  onCapture = () => {},
}: ForestControlsProps) => {
  const [rotation, setRotation] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
  const [currentSeason, setCurrentSeason] = useState<string>("summer");
  const [visibleLayers, setVisibleLayers] = useState({
    trees: true,
    wildlife: true,
    waterBodies: true,
    terrain: true,
  });

  const handleRotationChange = (value: number[]) => {
    const newRotation = value[0];
    setRotation(newRotation);
    onRotate(newRotation);
  };

  const toggleLayerVisibility = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => {
      const newState = { ...prev, [layer]: !prev[layer] };
      onToggleVisibility(layer, newState[layer]);
      return newState;
    });
  };

  const handleTimeChange = (time: "day" | "night") => {
    setTimeOfDay(time);
    onTimeChange(time);
  };

  const handleSeasonChange = (season: string) => {
    setCurrentSeason(season);
    onSeasonChange(season);
  };

  return (
    <Card className="w-full p-4 bg-white shadow-md rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Rotation Slider */}
        <div className="flex items-center space-x-2 flex-1 max-w-xs">
          <RotateCcw className="h-4 w-4 text-gray-500" />
          <Slider
            defaultValue={[0]}
            max={360}
            step={1}
            value={[rotation]}
            onValueChange={handleRotationChange}
            className="w-full"
          />
          <Badge variant="outline">{rotation}°</Badge>
        </div>

        {/* View Controls */}
        <Tabs defaultValue="3d" className="w-auto">
          <TabsList>
            <TabsTrigger value="3d" onClick={() => onViewChange("3d")}>
              3D
            </TabsTrigger>
            <TabsTrigger value="top" onClick={() => onViewChange("top")}>
              Top View
            </TabsTrigger>
            <TabsTrigger value="side" onClick={() => onViewChange("side")}>
              Side View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Layer Visibility */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trees className="h-4 w-4" />
                  <span>Trees</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayerVisibility("trees")}
                >
                  {visibleLayers.trees ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span>Wildlife</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayerVisibility("wildlife")}
                >
                  {visibleLayers.wildlife ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span>Water Bodies</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayerVisibility("waterBodies")}
                >
                  {visibleLayers.waterBodies ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span>Terrain</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLayerVisibility("terrain")}
                >
                  {visibleLayers.terrain ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Time of Day */}
        <div className="flex items-center space-x-2">
          <Button
            variant={timeOfDay === "day" ? "default" : "outline"}
            size="icon"
            onClick={() => handleTimeChange("day")}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant={timeOfDay === "night" ? "default" : "outline"}
            size="icon"
            onClick={() => handleTimeChange("night")}
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>

        {/* Season Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Compass className="h-4 w-4 mr-2" />
              {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="space-y-1">
              {["spring", "summer", "autumn", "winter"].map((season) => (
                <Button
                  key={season}
                  variant={currentSeason === season ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleSeasonChange(season)}
                >
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Capture and Share */}
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onCapture}>
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Capture View</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Info Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Forest Controls Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

export default ForestControls;
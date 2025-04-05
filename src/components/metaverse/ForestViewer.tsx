import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Globe, Trees, Leaf } from "lucide-react";
import Header from "../layout/Header";
import ForestCanvas from "./ForestCanvas";
import ForestControls from "./ForestControls";
import ConservationTasks from "./ConservationTasks";

const ForestViewer = () => {
  const [view, setView] = useState('3d');
  const [zoomIn, setZoomIn] = useState(0);
  const [zoomOut, setZoomOut] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [season, setSeason] = useState('summer');
  const [visibleLayers, setVisibleLayers] = useState({
    trees: true,
    wildlife: true,
    waterBodies: true,
    terrain: true,
  });

  const toggleLayerVisibility = (layer, visible) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: visible,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          Metaverse Forest
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Globe className="mr-2 h-5 w-5 text-green-600" />
                Your Forest Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full" style={{ height: '500px' }}>
                <ForestCanvas 
                  view={view}
                  onZoomIn={zoomIn}
                  onZoomOut={zoomOut}
                  onRotate={rotation}
                  onTimeChange={timeOfDay}
                  onSeasonChange={season}
                  visibleLayers={visibleLayers}
                />
                <div className="absolute bottom-0 left-0 right-0">
                  <ForestControls 
                    onViewChange={setView}
                    onZoomIn={() => setZoomIn(zoomIn + 1)}
                    onZoomOut={() => setZoomOut(zoomOut + 1)}
                    onRotate={setRotation}
                    onTimeChange={setTimeOfDay}
                    onSeasonChange={setSeason}
                    onToggleVisibility={toggleLayerVisibility}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-600" />
                Conservation Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConservationTasks />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Forest Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">Excellent</div>
              <p className="text-sm text-muted-foreground mt-1">
                98% biodiversity score
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: "98%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Carbon Sequestration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">245 tons</div>
              <p className="text-sm text-muted-foreground mt-1">
                CO₂ captured this year
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Growth Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+12%</div>
              <p className="text-sm text-muted-foreground mt-1">
                Canopy expansion rate
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-amber-600 h-2.5 rounded-full"
                  style={{ width: "62%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Trees className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">
              Your Forest Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Wildlife Supported</h3>
              <p className="text-gray-600 mb-4">
                Your forest is home to 85+ species of animals and plants,
                including 12 endangered species.
              </p>
              <Button
                variant="outline"
                className="text-green-600 border-green-600"
              >
                View Wildlife Details
              </Button>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Community Benefits</h3>
              <p className="text-gray-600 mb-4">
                Your investment supports 3 local communities with sustainable
                jobs and education programs.
              </p>
              <Button
                variant="outline"
                className="text-green-600 border-green-600"
              >
                View Community Impact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestViewer;
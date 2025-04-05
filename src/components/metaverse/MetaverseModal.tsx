import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Sun,
  Moon,
  Trees,
  Layers,
  Camera,
  Sprout,
} from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface ForestToken {
  id: string;
  name: string;
  location: string;
  size: string;
  carbonYield: string;
  carbonCredits: string;
  yield: string;
  price: number;
  priceChange: number;
  imageUrl: string;
  rating: number;
  maturity: string;
}

interface MetaverseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenData: ForestToken | null;
  onPlantTree: (token: ForestToken) => void;
}

const MetaverseModal: React.FC<MetaverseModalProps> = ({
  open,
  onOpenChange,
  tokenData,
  onPlantTree,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // State from ForestControls
  const [rotation, setRotation] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
  const [currentSeason, setCurrentSeason] = useState<string>("summer");
  const [view, setView] = useState<string>("3d");
  const [visibleLayers, setVisibleLayers] = useState({
    trees: true,
    wildlife: false, // Wildlife not implemented yet in original scene
    waterBodies: true,
    terrain: true,
  });

  const handlePlantTree = () => {
    if (tokenData) {
      onPlantTree(tokenData);
    }
  };

  useEffect(() => {
    if (!open || !tokenData || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting based on time of day
    const ambientLight = new THREE.AmbientLight(0x404040, timeOfDay === "day" ? 2 : 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, timeOfDay === "day" ? 2 : 0.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Forest configuration
    let forestType = "Temperate Forest";
    let groundColor = 0x4a3728;
    let treeCount = 20;
    let treeHeight = 1;
    let foliageColor = 0x228b22;
    let hasWater = false;
    let waterLevel = -0.9;
    let skyColor = 0x87ceeb;

    if (tokenData.name.includes("Rainforest")) {
      forestType = "Rainforest";
      groundColor = 0x2f4f4f;
      treeCount = 30;
      treeHeight = 1.5;
      foliageColor = 0x006400;
      hasWater = true;
      skyColor = 0x4682b4;
    } else if (tokenData.name.includes("Mangrove")) {
      forestType = "Mangrove Swamp";
      groundColor = 0x3c2f2f;
      treeCount = 15;
      treeHeight = 0.8;
      foliageColor = 0x2e8b57;
      hasWater = true;
      waterLevel = -0.5;
      skyColor = 0x5f9ea0;
    } else if (tokenData.name.includes("Congo")) {
      forestType = "Savanna-Forest Mix";
      groundColor = 0x8b4513;
      treeCount = 10;
      treeHeight = 1.2;
      foliageColor = 0x9acd32;
      skyColor = 0xffd700;
    } else if (tokenData.name.includes("Cloud Forest")) {
      forestType = "Cloud Forest";
      groundColor = 0x2f4f4f;
      treeCount = 25;
      treeHeight = 1;
      foliageColor = 0x32cd32;
      skyColor = 0xd3d3d3;
      scene.fog = new THREE.Fog(0xd3d3d3, 1, 15);
    } else if (tokenData.name.includes("Taiga")) {
      forestType = "Taiga (Boreal Forest)";
      groundColor = 0x5c4033;
      treeCount = 20;
      treeHeight = 1.3;
      foliageColor = 0x006400;
      skyColor = 0xadd8e6;
    }

    // Adjust foliage color based on season
    if (currentSeason === "autumn") foliageColor = 0xffa500;
    else if (currentSeason === "winter") foliageColor = 0x808080;
    else if (currentSeason === "spring") foliageColor = 0x98fb98;

    scene.background = new THREE.Color(skyColor);

    // Ground (Terrain)
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: groundColor });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    ground.visible = visibleLayers.terrain;
    scene.add(ground);

    // Trees
    const treeGroup = new THREE.Group();
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, treeHeight, 8);
    const foliageGeometry = new THREE.ConeGeometry(0.8, 2, 8);

    for (let i = 0; i < treeCount; i++) {
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const foliageMaterial = new THREE.MeshLambertMaterial({ color: foliageColor });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);

      foliage.position.y = treeHeight + 0.5;
      trunk.position.y = -0.5;

      const tree = new THREE.Group();
      tree.add(trunk);
      tree.add(foliage);

      tree.position.set(
        (Math.random() - 0.5) * 15,
        0,
        (Math.random() - 0.5) * 15
      );
      treeGroup.add(tree);
    }
    treeGroup.visible = visibleLayers.trees;
    scene.add(treeGroup);

    // Water Bodies
    let waterGroup: THREE.Group | null = null;
    if (hasWater) {
      waterGroup = new THREE.Group();
      const waterGeometry = new THREE.PlaneGeometry(10, 10);
      const waterMaterial = new THREE.MeshLambertMaterial({
        color: 0x1e90ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const water = new THREE.Mesh(waterGeometry, waterMaterial);
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, waterLevel, 0);
      waterGroup.add(water);
      waterGroup.visible = visibleLayers.waterBodies;
      scene.add(waterGroup);
    }

    // Camera positioning based on view mode
    const initialDistance = 10;
    camera.position.set(0, 5, initialDistance);
    if (view === "top") {
      camera.position.set(0, 10, 0);
      camera.lookAt(0, 0, 0);
    } else if (view === "side") {
      camera.position.set(initialDistance, 0, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 5, initialDistance);
      camera.lookAt(0, 0, 0);
    }

    // OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.screenSpacePanning = false;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 15;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.target.set(0, 0, 0);

    // Animation loop
    const animate = () => {
      if (!open || !scene || !camera || !renderer) return;

      animationFrameId.current = requestAnimationFrame(animate);

      const angle = (rotation * Math.PI) / 180;
      if (view === "3d") {
        camera.position.x = Math.sin(angle) * initialDistance;
        camera.position.z = Math.cos(angle) * initialDistance;
        camera.position.y = 5;
        camera.lookAt(0, 0, 0);
      }

      orbitControls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Store references
    cameraRef.current = camera;
    sceneRef.current = scene;
    rendererRef.current = renderer;
    controlsRef.current = orbitControls;

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      orbitControls.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, [open, tokenData, rotation, timeOfDay, currentSeason, view, visibleLayers]);

  const handleZoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.addScaledVector(
        cameraRef.current.getWorldDirection(new THREE.Vector3()),
        0.5
      );
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.addScaledVector(
        cameraRef.current.getWorldDirection(new THREE.Vector3()),
        -0.5
      );
      controlsRef.current.update();
    }
  };

  const handleRotationChange = (value: number[]) => {
    setRotation(value[0]);
  };

  const toggleLayerVisibility = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const handleTimeChange = (time: "day" | "night") => {
    setTimeOfDay(time);
  };

  const handleSeasonChange = (season: string) => {
    setCurrentSeason(season);
  };

  const handleCapture = () => {
    if (rendererRef.current) {
      const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${tokenData?.name || "forest"}-capture.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  if (!tokenData) return null;

  let forestType = "Temperate Forest";
  if (tokenData.name.includes("Rainforest")) forestType = "Rainforest";
  else if (tokenData.name.includes("Mangrove")) forestType = "Mangrove Swamp";
  else if (tokenData.name.includes("Congo")) forestType = "Savanna-Forest Mix";
  else if (tokenData.name.includes("Cloud Forest")) forestType = "Cloud Forest";
  else if (tokenData.name.includes("Taiga")) forestType = "Taiga (Boreal Forest)";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Visit {tokenData.name} in the Metaverse</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            ref={mountRef}
            className="relative h-[500px] w-full bg-black rounded-md"
          >
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-md">
              <p className="text-lg font-semibold">{forestType}</p>
              <p className="text-sm">{tokenData.location}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
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
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
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
                <TabsTrigger value="3d" onClick={() => setView("3d")}>
                  3D
                </TabsTrigger>
                <TabsTrigger value="top" onClick={() => setView("top")}>
                  Top View
                </TabsTrigger>
                <TabsTrigger value="side" onClick={() => setView("side")}>
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
                      {visibleLayers.trees ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Water Bodies</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayerVisibility("waterBodies")}
                    >
                      {visibleLayers.waterBodies ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Terrain</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayerVisibility("terrain")}
                    >
                      {visibleLayers.terrain ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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

            {/* Capture */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleCapture}>
                    <Camera className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capture View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePlantTree}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <Sprout className="h-4 w-4" />
              Plant a Digital Tree
            </Button>
            <p className="text-sm text-gray-500">
              Plant a digital tree to earn bonus yield and contribute to real-world reforestation!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetaverseModal;
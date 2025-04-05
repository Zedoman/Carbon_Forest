import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const ForestCanvas = ({ 
  view = '3d', 
  onZoomIn, 
  onZoomOut, 
  onRotate, 
  onTimeChange, 
  onSeasonChange, 
  visibleLayers = { trees: true, wildlife: true, waterBodies: true, terrain: true } 
}) => {
  const mountRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [treeGroup, setTreeGroup] = useState(null);
  const [wildlifeGroup, setWildlifeGroup] = useState(null);
  const [waterGroup, setWaterGroup] = useState(null);
  const [terrain, setTerrain] = useState(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Ground (Terrain)
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3728 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);
    setTerrain(ground);

    // Trees
    const treeGroup = new THREE.Group();
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const foliageGeometry = new THREE.ConeGeometry(0.8, 2, 8);
    
    for (let i = 0; i < 20; i++) {
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
      const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      
      foliage.position.y = 1.5;
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
    scene.add(treeGroup);
    setTreeGroup(treeGroup);

    // Wildlife (represented as simple spheres for now)
    const wildlifeGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const animalGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const animalMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray for animals
      const animal = new THREE.Mesh(animalGeometry, animalMaterial);
      animal.position.set(
        (Math.random() - 0.5) * 15,
        -0.7,
        (Math.random() - 0.5) * 15
      );
      wildlifeGroup.add(animal);
    }
    scene.add(wildlifeGroup);
    setWildlifeGroup(wildlifeGroup);

    // Water Bodies (represented as a blue plane for now)
    const waterGroup = new THREE.Group();
    const waterGeometry = new THREE.PlaneGeometry(4, 4);
    const waterMaterial = new THREE.MeshLambertMaterial({ color: 0x1E90FF, side: THREE.DoubleSide });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(5, -0.9, 5);
    waterGroup.add(water);
    scene.add(waterGroup);
    setWaterGroup(waterGroup);

    // Set initial camera position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Store in state
    setCamera(camera);
    setScene(scene);
    setRenderer(renderer);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Handle view changes
  useEffect(() => {
    if (!camera) return;

    switch (view) {
      case '3d':
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        break;
      case 'top':
        camera.position.set(0, 15, 0.1);
        camera.lookAt(0, 0, 0);
        break;
      case 'side':
        camera.position.set(15, 2, 0);
        camera.lookAt(0, 0, 0);
        break;
      default:
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
    }
  }, [view, camera]);

  // Handle zoom
  useEffect(() => {
    if (!camera) return;
    if (onZoomIn) {
      camera.position.z -= 0.5;
    }
  }, [onZoomIn, camera]);

  useEffect(() => {
    if (!camera) return;
    if (onZoomOut) {
      camera.position.z += 0.5;
    }
  }, [onZoomOut, camera]);

  // Handle rotation
  useEffect(() => {
    if (!camera || !onRotate) return;
    camera.position.x = Math.sin((onRotate * Math.PI) / 180) * 10;
    camera.position.z = Math.cos((onRotate * Math.PI) / 180) * 10;
    camera.lookAt(0, 0, 0);
  }, [onRotate, camera]);

  // Handle time of day
  useEffect(() => {
    if (!scene) return;
    const ambientLight = scene.children.find(child => child instanceof THREE.AmbientLight);
    const directionalLight = scene.children.find(child => child instanceof THREE.DirectionalLight);
    
    if (onTimeChange === 'day') {
      ambientLight.intensity = 1;
      directionalLight.intensity = 1;
    } else if (onTimeChange === 'night') {
      ambientLight.intensity = 0.2;
      directionalLight.intensity = 0.3;
    }
  }, [onTimeChange, scene]);

  // Handle season
  useEffect(() => {
    if (!treeGroup) return;

    treeGroup.children.forEach(tree => {
      const foliage = tree.children.find(child => child.geometry instanceof THREE.ConeGeometry);
      if (foliage) {
        switch (onSeasonChange) {
          case 'spring':
            foliage.material.color.set(0x90EE90);
            break;
          case 'summer':
            foliage.material.color.set(0x228B22);
            break;
          case 'autumn':
            foliage.material.color.set(0xDAA520);
            break;
          case 'winter':
            foliage.material.color.set(0x808080);
            break;
          default:
            foliage.material.color.set(0x228B22);
        }
      }
    });
  }, [onSeasonChange, treeGroup]);

  // Handle layer visibility
  useEffect(() => {
    if (treeGroup) treeGroup.visible = visibleLayers.trees;
    if (wildlifeGroup) wildlifeGroup.visible = visibleLayers.wildlife;
    if (waterGroup) waterGroup.visible = visibleLayers.waterBodies;
    if (terrain) terrain.visible = visibleLayers.terrain;
  }, [visibleLayers, treeGroup, wildlifeGroup, waterGroup, terrain]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        position: 'relative',
        background: '#000'
      }} 
    />
  );
};

export default ForestCanvas;
// components/marketplace/viewer/NFTViewer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Maximize2, Minimize2, RotateCcw, 
  Play, Pause, Settings, Camera,
  ZoomIn, ZoomOut
} from 'lucide-react';
import type { NFTAsset } from '@/types/marketplace';

interface NFTViewerProps {
  asset: NFTAsset;
  modelUrl?: string;
  initialPosition?: { x: number; y: number; z: number };
  initialRotation?: { x: number; y: number; z: number };
  animations?: string[];
  onScreenshot?: () => void;
}

export interface ViewerControls {
  zoom: number;
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  animation: string | null;
  isPlaying: boolean;
  isFullscreen: boolean;
}

export const NFTViewer: React.FC<NFTViewerProps> = ({
  asset,
  modelUrl,
  initialPosition = { x: 0, y: 0, z: 0 },
  initialRotation = { x: 0, y: 0, z: 0 },
  animations = [],
  onScreenshot
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [controls, setControls] = React.useState<ViewerControls>({
    zoom: 1,
    rotation: initialRotation,
    position: initialPosition,
    animation: null,
    isPlaying: true,
    isFullscreen: false
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const [lastMousePos, setLastMousePos] = React.useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = React.useState(true);

  // Mouse event handlers for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setControls(prev => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        y: prev.rotation.y + deltaX * 0.01,
        x: prev.rotation.x + deltaY * 0.01
      }
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoom = (factor: number) => {
    setControls(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2, prev.zoom + factor))
    }));
  };

  // Animation handlers
  const toggleAnimation = () => {
    setControls(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const setAnimation = (animationName: string | null) => {
    setControls(prev => ({
      ...prev,
      animation: animationName,
      isPlaying: true
    }));
  };

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setControls(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setControls(prev => ({ ...prev, isFullscreen: false }));
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/10 to-blue-900/10
                ${controls.isFullscreen ? 'fixed inset-0 z-50' : 'aspect-square'}`}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300
                  ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3">
              {/* Play/Pause */}
              {animations.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={toggleAnimation}
                  className="p-2 rounded-lg text-white hover:bg-white/20"
                >
                  {controls.isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}
                </motion.button>
              )}

              {/* Reset Rotation */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setControls(prev => ({
                  ...prev,
                  rotation: initialRotation
                }))}
                className="p-2 rounded-lg text-white hover:bg-white/20"
              >
                <RotateCcw size={20} />
              </motion.button>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleZoom(-0.1)}
                  className="p-2 rounded-lg text-white hover:bg-white/20"
                >
                  <ZoomOut size={20} />
                </motion.button>
                <div className="text-white text-sm">
                  {Math.round(controls.zoom * 100)}%
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleZoom(0.1)}
                  className="p-2 rounded-lg text-white hover:bg-white/20"
                >
                  <ZoomIn size={20} />
                </motion.button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              {/* Screenshot */}
              {onScreenshot && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={onScreenshot}
                  className="p-2 rounded-lg text-white hover:bg-white/20"
                >
                  <Camera size={20} />
                </motion.button>
              )}

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => {}} // Open settings modal
                className="p-2 rounded-lg text-white hover:bg-white/20"
              >
                <Settings size={20} />
              </motion.button>

              {/* Fullscreen */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-white hover:bg-white/20"
              >
                {controls.isFullscreen ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Animation Selection */}
          {animations.length > 0 && (
            <div className="mt-3 flex items-center space-x-2">
              {animations.map((animation) => (
                <motion.button
                  key={animation}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setAnimation(animation)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors
                    ${controls.animation === animation
                      ? 'bg-white text-purple-900'
                      : 'text-white hover:bg-white/20'
                    }`}
                >
                  {animation}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
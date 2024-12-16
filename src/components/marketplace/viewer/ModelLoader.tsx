// components/marketplace/viewer/ModelLoader.tsx
import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';
import type { ViewerControls } from './NFTViewer';

interface ModelLoaderProps {
  modelUrl: string;
  controls: ViewerControls;
  onLoad?: (gltf: GLTF) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export class ModelLoader {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private animations: THREE.AnimationAction[] = [];
  private clock: THREE.Clock;

  constructor(canvas: HTMLCanvasElement, private props: ModelLoaderProps) {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fe);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Setup controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2;

    // Setup lighting
    this.setupLighting();

    // Initialize animation clock
    this.clock = new THREE.Clock();

    // Load model
    this.loadModel();

    // Start render loop
    this.animate();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Add environment map for realistic reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    new THREE.TextureLoader().load(
      '/environment-map.hdr',
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        this.scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      }
    );
  }

  private async loadModel(): Promise<void> {
    try {
      // Setup loaders
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      // Load model
      const gltf = await new Promise<GLTF>((resolve, reject) => {
        loader.load(
          this.props.modelUrl,
          resolve,
          (progress) => {
            this.props.onProgress?.(
              (progress.loaded / (progress.total || 1)) * 100
            );
          },
          reject
        );
      });

      // Setup model
      this.model = gltf.scene;
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Center model
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      this.model.position.sub(center);

      // Setup animations
      if (gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);
        this.animations = gltf.animations.map(clip => 
          this.mixer!.clipAction(clip)
        );
        
        // Play default animation if available
        if (this.props.controls.animation) {
          const animationIndex = gltf.animations.findIndex(
            anim => anim.name === this.props.controls.animation
          );
          if (animationIndex !== -1) {
            this.animations[animationIndex].play();
          }
        }
      }

      this.scene.add(this.model);
      this.props.onLoad?.(gltf);

    } catch (error) {
      this.props.onError?.(error as Error);
    }
  }

  public updateControls(newControls: ViewerControls): void {
    // Update camera zoom
    this.camera.zoom = newControls.zoom;
    this.camera.updateProjectionMatrix();

    // Update model rotation
    if (this.model) {
      this.model.rotation.set(
        newControls.rotation.x,
        newControls.rotation.y,
        newControls.rotation.z
      );
    }

    // Update animation state
    if (this.mixer && this.animations.length > 0) {
      if (newControls.isPlaying) {
        if (newControls.animation) {
          // Stop all animations
          this.animations.forEach(action => action.stop());
          
          // Play selected animation
          const selectedAnimation = this.animations.find(
            action => action.getClip().name === newControls.animation
          );
          if (selectedAnimation) {
            selectedAnimation.play();
          }
        }
      } else {
        // Pause all animations
        this.animations.forEach(action => action.paused = true);
      }
    }
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Update controls
    this.controls.update();

    // Update animations
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    this.renderer.dispose();
    this.scene.clear();
    this.controls.dispose();
  }

  public resizeRenderer(): void {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}
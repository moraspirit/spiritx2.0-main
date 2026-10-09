import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import BrandLogo from './BrandLogo.tsx';
import { usePrefersLight } from '../usePrefersLight.ts';

interface Spirit3DLogoProps {
  className?: string;
}

export default function Spirit3DLogo({ className }: Spirit3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isLight = usePrefersLight();
  const loadedModelRef = useRef<THREE.Group | null>(null);
  const modelSizeRef = useRef<THREE.Vector3>(new THREE.Vector3(3.5, 0.85, 0.5));

  // Update materials when theme changes
  useEffect(() => {
    if (!loadedModelRef.current) return;
    applyThemeMaterials(loadedModelRef.current, isLight);
  }, [isLight]);

  function applyThemeMaterials(model: THREE.Object3D, light: boolean) {
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat) => {
          if (!mat) return;
          const stdMat = mat as THREE.MeshStandardMaterial;

          if (stdMat.name === 'SVGMat.001') {
            // The brand 'X' symbol: Vibrant electric cyan/blue
            if (light) {
              stdMat.color.set(0x0284c7); // sky-600 vibrant brand blue
              stdMat.emissive.set(0x0369a1);
              stdMat.emissiveIntensity = 0.35;
              stdMat.metalness = 0.85;
              stdMat.roughness = 0.2;
            } else {
              stdMat.color.set(0x00e5ff); // neon electric cyan
              stdMat.emissive.set(0x0077b6);
              stdMat.emissiveIntensity = 0.65;
              stdMat.metalness = 0.9;
              stdMat.roughness = 0.15;
            }
          } else {
            // The wordmark letters ('Spirit 2.0')
            if (light) {
              // Sleek dark metallic slate on light surfaces
              stdMat.color.set(0x1e293b);
              stdMat.emissive.set(0x0f172a);
              stdMat.emissiveIntensity = 0.1;
              stdMat.metalness = 0.65;
              stdMat.roughness = 0.3;
            } else {
              // Gleaming metallic silver/white on dark space background
              stdMat.color.set(0xf8fafc);
              stdMat.emissive.set(0x334155);
              stdMat.emissiveIntensity = 0.15;
              stdMat.metalness = 0.85;
              stdMat.roughness = 0.2;
            }
          }
          stdMat.needsUpdate = true;
        });
      }
    });
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let dracoLoader: DRACOLoader | null = null;
    let modelGroup: THREE.Group | null = null;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch (e) {
      console.error('WebGL renderer init failed:', e);
      setHasError(true);
      return;
    }

    // Comprehensive 3D Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // Front direct key light (illuminates front face directly)
    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontKeyLight.position.set(0, 2, 5);
    scene.add(frontKeyLight);

    // Top-right key light
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(6, 6, 4);
    scene.add(dirLight1);

    // Left fill light with cyan tint
    const dirLight2 = new THREE.DirectionalLight(0x00c2ff, 2.2);
    dirLight2.position.set(-6, -2, 4);
    scene.add(dirLight2);

    // Subtle top-back rim light
    const dirLight3 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight3.position.set(0, 5, -3);
    scene.add(dirLight3);

    // Central subtle glow point light
    const pointLight = new THREE.PointLight(0x00f0ff, 1.8, 8);
    pointLight.position.set(0, 0, 2.5);
    scene.add(pointLight);

    // Continuous sweeping shine lights (travels left -> right across the logo)
    const shineLight = new THREE.PointLight(0xffffff, 0, 9);
    scene.add(shineLight);

    const shineCyanLight = new THREE.PointLight(0x00f0ff, 0, 8);
    scene.add(shineCyanLight);

    // Interactive mouse specular shine light
    const mouseShineLight = new THREE.PointLight(0xffffff, 0, 7);
    scene.add(mouseShineLight);

    // Load Model
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Responsive camera & viewport sizing
    const updateSize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;

      // Calculate camera distance to dynamically fit model horizontally & vertically
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);

      const modelW = modelSizeRef.current.x;
      const modelH = modelSizeRef.current.y;

      const distV = (modelH / 2) / Math.tan(vFOV / 2);
      const distH = (modelW / 2) / Math.tan(hFOV / 2);

      // 1.35 safety factor ensures model stays comfortably inside frustum during rotation/tilt
      camera.position.z = Math.max(distV, distH) * 1.35;

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const setupModel = (root: THREE.Group) => {
      applyThemeMaterials(root, isLight);

      // 1. Reset transforms
      root.position.set(0, 0, 0);
      root.rotation.set(0, 0, 0);
      root.scale.set(1, 1, 1);

      // 2. Rotate around X by +Math.PI/2 so the model is right-side up (dot of 'i' at top)
      root.rotation.x = Math.PI / 2;
      root.updateMatrixWorld(true);

      // 3. Compute unscaled bounding box to find optimal uniform scale
      const unscaledBox = new THREE.Box3().setFromObject(root);
      const unscaledSize = unscaledBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(unscaledSize.x, unscaledSize.y, unscaledSize.z);
      const desiredSize = 3.5;
      const scale = desiredSize / (maxDim || 1);

      // 4. Apply scale first
      root.scale.setScalar(scale);
      root.updateMatrixWorld(true);

      // 5. Measure scaled bounding box and center perfectly at (0, 0, 0)
      const scaledBox = new THREE.Box3().setFromObject(root);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
      const scaledSize = scaledBox.getSize(new THREE.Vector3());

      root.position.copy(scaledCenter).negate();

      // Store exact scaled model size for dynamic camera Z calculation
      modelSizeRef.current.copy(scaledSize);

      if (modelGroup) {
        modelGroup.add(root);
      }

      loadedModelRef.current = root;
      setIsLoaded(true);
      updateSize();
    };

    loader.load(
      '/3d/spiritx2.glb',
      (gltf) => {
        setupModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn('Local DRACO loader failed, trying CDN fallback...', err);
        if (dracoLoader) {
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
          loader.load(
            '/3d/spiritx2.glb',
            (gltf) => {
              setupModel(gltf.scene);
            },
            undefined,
            (finalErr) => {
              console.error('Failed to load 3D SpiritX model:', finalErr);
              setHasError(true);
            }
          );
        } else {
          setHasError(true);
        }
      }
    );

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    updateSize();

    // Mouse & Touch interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    let isPointerDown = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let baseRotationX = 0;
    let baseRotationY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isPointerDown) {
        const deltaX = (e.clientX - pointerStartX) / rect.width;
        const deltaY = (e.clientY - pointerStartY) / rect.height;
        targetRotationY = baseRotationY + deltaX * 2.2;
        targetRotationX = baseRotationX - deltaY * 0.35; // Subdued vertical drag tilt
      } else {
        // Natural hover tilt (kept left/right movement, reduced top/bottom movement)
        targetRotationY = nx * 0.42;
        targetRotationX = -ny * 0.08; // Subtle vertical pitch tilt
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      baseRotationX = targetRotationX;
      baseRotationY = targetRotationY;
      container.setPointerCapture?.(e.pointerId);
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      container.releasePointerCapture?.(e.pointerId);
    };

    const onPointerLeave = () => {
      if (!isPointerDown) {
        targetRotationX = 0;
        targetRotationY = 0;
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (modelGroup) {
        // Gentle smooth dampening (LERP)
        currentRotationX += (targetRotationX - currentRotationX) * 0.08;
        currentRotationY += (targetRotationY - currentRotationY) * 0.08;

        // Subtle ambient floating motion
        const floatOffset = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 1.8) * 0.06;
        const autoOscillate = prefersReducedMotion ? 0 : Math.sin(elapsedTime * 0.8) * 0.08;

        modelGroup.rotation.x = currentRotationX + (prefersReducedMotion ? 0 : Math.sin(elapsedTime * 1.2) * 0.03);
        modelGroup.rotation.y = currentRotationY + autoOscillate;
        modelGroup.position.y = floatOffset;
      }

      if (!prefersReducedMotion) {
        // Continuous left-to-right metallic shine light sweep
        const cycleDuration = 3.2; // 3.2s total cycle
        const sweepDuration = 2.2; // 2.2s sweep, 1.0s pause
        const cycleTime = elapsedTime % cycleDuration;

        if (cycleTime < sweepDuration) {
          const progress = cycleTime / sweepDuration; // 0.0 to 1.0
          const shineX = -4.2 + progress * 8.4; // left to right sweep
          const intensityFactor = Math.sin(progress * Math.PI); // smooth bell curve

          shineLight.position.set(shineX, 0.4, 2.2);
          shineLight.intensity = (isLight ? 4.5 : 6.5) * intensityFactor;

          shineCyanLight.position.set(shineX - 0.6, -0.4, 1.8);
          shineCyanLight.intensity = (isLight ? 2.5 : 4.5) * intensityFactor;
        } else {
          shineLight.intensity = 0;
          shineCyanLight.intensity = 0;
        }

        // Mouse interactive specular shine tracking
        mouseShineLight.position.set(targetRotationY * 3.5, -targetRotationX * 3.5 + 0.2, 2.0);
        mouseShineLight.intensity = (isLight ? 2.5 : 4.0) * (isPointerDown ? 1.5 : 1.0);
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);

      if (dracoLoader) {
        dracoLoader.dispose();
      }

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  if (hasError) {
    return (
      <BrandLogo
        className={className || 'h-16 w-auto max-w-[85vw] drop-shadow-md sm:h-24 md:h-32 lg:h-36'}
        label="Spirit X 2.0"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none touch-none overflow-visible ${className || 'h-36 sm:h-48 md:h-56 lg:h-64 w-full max-w-[98vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl'}`}
      style={{ perspective: 1000 }}
    >
      {/* Fallback & smooth fade-in */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Spirit X 2.0 Interactive 3D Model"
        role="img"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500">
          <BrandLogo
            className="h-16 w-auto max-w-[85vw] drop-shadow-md opacity-40 animate-pulse sm:h-24 md:h-32 lg:h-36"
            label="Spirit X 2.0"
          />
        </div>
      )}
    </div>
  );
}

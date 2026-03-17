import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      const rect = canvasDiv.current.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: window.innerWidth > 1024,
        powerPreference: "low-power",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer | null = null;
      let loadedCharacter: THREE.Object3D | null = null;
      let frameId = 0;
      let disposed = false;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);
      const resizeHandler = () => {
        if (!loadedCharacter) return;
        handleResize(renderer, camera, canvasDiv, loadedCharacter);
      };

      loadCharacter().then((gltf) => {
        if (disposed || !gltf) return;

        const animations = setAnimations(gltf);
        loadedCharacter = gltf.scene;

        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        scene.add(loadedCharacter);
        headBone = loadedCharacter.getObjectByName("spine006") || null;
        screenLight = loadedCharacter.getObjectByName("screenlight") || null;

        progress.loaded().then(() => {
          if (disposed) return;
          setTimeout(() => {
            if (disposed) return;
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });

        window.addEventListener("resize", resizeHandler);
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      let touchMoveHandler: ((event: TouchEvent) => void) | null = null;
      let touchMoveTarget: HTMLElement | null = null;

      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = window.setTimeout(() => {
          touchMoveHandler = (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }));
          touchMoveTarget = element;
          touchMoveTarget?.addEventListener("touchmove", touchMoveHandler, {
            passive: true,
          });
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart, {
          passive: true,
        });
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (disposed) return;

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }

        const delta = clock.getDelta();
        mixer?.update(delta);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(debounce);
        progress.clear();
        document.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", resizeHandler);
        landingDiv?.removeEventListener("touchstart", onTouchStart);
        landingDiv?.removeEventListener("touchend", onTouchEnd);

        if (touchMoveHandler && touchMoveTarget) {
          touchMoveTarget.removeEventListener("touchmove", touchMoveHandler);
        }

        scene.clear();
        renderer.dispose();

        if (canvasDiv.current?.contains(renderer.domElement)) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

import type { COBEOptions } from "cobe";
import createGlobe from "cobe";
import type { MutableRefObject } from "react";
import React, { useEffect, useRef, useState } from "react";

export default function Globe(): JSX.Element {
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const size = 700;

  // Wait for client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let phi = 0;
    let globe: any = null;
    let animationFrame: number;

    const initGlobe = async () => {
      if (!canvasRef.current) return;

      try {
        // Add a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        const globeSettings: COBEOptions = {
          devicePixelRatio: window.devicePixelRatio || 2,
          width: size * 2,
          height: size * 2,
          phi: 0,
          theta: 0,
          dark: 0,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [1, 1, 1],
          markerColor: [1, 1, 0],
          glowColor: [0.757, 0.784, 0.804],
          markers: [],
          onRender: (state) => {
            // Use requestAnimationFrame for smoother animation
            animationFrame = requestAnimationFrame(() => {
              state.phi = phi;
              phi += 0.001;
            });
          },
        };

        globe = createGlobe(canvasRef.current, globeSettings);
      } catch (e) {
        console.error("Failed to create globe:", e);
      }
    };

    initGlobe().catch(console.error);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (globe) {
        try {
          globe.destroy();
        } catch (e) {
          console.error("Failed to destroy globe:", e);
        }
      }
    };
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: size, 
        height: size, 
        aspectRatio: "1",
        opacity: isClient ? 1 : 0 
      }}
      data-testid="globe-canvas"
    />
  );
}

"use client";

import { useEffect } from "react";
import { tsParticles } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { Container } from "tsparticles-engine";

export default function ParticlesBackground() {
  useEffect(() => {
    let container: Container | undefined;

    loadFull(tsParticles).then(() => {
      tsParticles.load("tsparticles", {
        fullScreen: false,
        background: { color: "#000000" },
        fpsLimit: 60,
        particles: {
          number: { value: 30, density: { enable: true, area: 1000 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: {
            value: 0.35,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.15,
              sync: false,
            },
          },
          size: { value: { min: 1, max: 2 } },
          move: {
            enable: true,
            speed: 0.3,
            direction: "none",
            outModes: { default: "bounce" },
          },
          links: {
            enable: true,
            distance: 200,
            color: "#ffffff",
            opacity: 0.12,
            width: 1,
          },
        },
        detectRetina: true,
      }).then((loaded) => (container = loaded));
    });

    return () => {
      container?.destroy();
    };
  }, []);

  return (
    <div
      id="tsparticles"
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none bg-black"
    />
  );
}

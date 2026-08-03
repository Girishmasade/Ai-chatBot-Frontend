import React, { useEffect, useRef } from "react";

interface LuxuryOrbProps {
  size?: number;
  interactive?: boolean;
}

export default function LuxuryOrb({ size = 300, interactive = true }: LuxuryOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = size;
    let height = size;

    canvas.width = width;
    canvas.height = height;

    // Particles array
    const particlesCount = 120;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      ox: number;
      oy: number;
      oz: number;
      size: number;
      color: string;
    }> = [];

    // Create a sphere of particles
    for (let i = 0; i < particlesCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = size * 0.38 + (Math.random() - 0.5) * 15; // Radius

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        size: Math.random() * 2.2 + 0.8,
        color: i % 5 === 0 ? "rgba(245, 158, 11, 0.9)" : "rgba(245, 158, 11, 0.45)" // Pure Amber Gold accents
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;

    // Track mouse coordinates for interactive displacement
    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - width / 2;
      mouseY = e.clientY - rect.top - height / 2;
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseenter", handleMouseEnter);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Sphere central soft amber backing glow
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.45
      );
      glowGrad.addColorStop(0, "rgba(245, 158, 11, 0.12)");
      glowGrad.addColorStop(0.5, "rgba(245, 158, 11, 0.03)");
      glowGrad.addColorStop(1, "rgba(9, 9, 9, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, width * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Slow dynamic spin increments
      let currentAngleX = angleX;
      let currentAngleY = angleY;

      if (isHovered) {
        // Nudge spin vectors when user hovers
        currentAngleX += mouseX * 0.00005;
        currentAngleY += mouseY * 0.00005;
      }

      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Sort particles by Z-axis for professional depth rendering
      particles.sort((a, b) => b.z - a.z);

      // Draw elegant connecting network mesh lines for professional tech aesthetic
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Rotation around X axis
        const y1 = p1.y * cosX - p1.z * sinX;
        const z1 = p1.z * cosX + p1.y * sinX;

        // Rotation around Y axis
        const x2 = p1.x * cosY - z1 * sinY;
        const z2 = z1 * cosY + p1.x * sinY;

        p1.x = x2;
        p1.y = y1;
        p1.z = z2;

        // Perspective projection calculation
        const cameraDistance = size * 1.5;
        const perspectiveFactor = cameraDistance / (cameraDistance - p1.z);
        const screenX = width / 2 + p1.x * perspectiveFactor;
        const screenY = height / 2 + p1.y * perspectiveFactor;

        // Display parameters
        const opacity = Math.max(0.1, Math.min(1, (p1.z + size * 0.5) / size));
        ctx.fillStyle = p1.color.replace(/[\d.]+\)$/, `${opacity})`);

        // Connect near neighbors
        for (let j = i + 1; j < particles.length; j++) {
          if (j - i > 12) continue; // Performance optimizer limit
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < size * 0.16) {
            const lineOpacity = (1 - dist / (size * 0.16)) * 0.15 * opacity;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);

            const z2_1 = p2.y * cosX - p2.z * sinX;
            const z2_2 = p2.z * cosX + p2.y * sinX;
            const x2_2 = p2.x * cosY - z2_2 * sinY;
            const z2_3 = z2_2 * cosY + p2.x * sinY;

            const pers2 = cameraDistance / (cameraDistance - z2_3);
            const sX2 = width / 2 + x2_2 * pers2;
            const sY2 = height / 2 + z2_1 * pers2;

            ctx.lineTo(sX2, sY2);
            ctx.stroke();
          }
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, p1.size * perspectiveFactor, 0, Math.PI * 2);
        ctx.fill();

        // Add soft secondary gold glow to prominent nodes
        if (p1.size > 2.5) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(245, 158, 11, 0.8)";
          ctx.beginPath();
          ctx.arc(screenX, screenY, p1.size * perspectiveFactor * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseenter", handleMouseEnter);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [size, interactive]);

  return (
    <div className="relative flex items-center justify-center pointer-events-auto" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        className="block cursor-grab active:cursor-grabbing transition-transform duration-500 hover:scale-[1.03]"
        style={{ width: size, height: size }}
      />
      {/* Background radial gradient backing ring */}
      <div className="absolute inset-0 rounded-full border border-amber-500/5 pointer-events-none scale-[0.8]" />
      <div className="absolute inset-0 rounded-full border border-amber-500/10 pointer-events-none scale-[0.5] animate-pulse" />
    </div>
  );
}

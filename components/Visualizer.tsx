import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isActive: boolean;
  amplitude: number; // 0 to 1
  color: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ isActive, amplitude, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Extract tailwind color to hex approximation for canvas
  const getColorHex = (twClass: string) => {
    if (twClass.includes('yellow')) return '#FACC15';
    if (twClass.includes('green')) return '#4ADE80';
    if (twClass.includes('blue')) return '#60A5FA';
    if (twClass.includes('pink')) return '#F472B6';
    return '#FACC15';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const draw = () => {
      if (!isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw a sleeping face or static state
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#E5E7EB'; // Gray-200
        ctx.fill();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 50;
      
      // Dynamic pulsing
      const dynamicRadius = baseRadius + (amplitude * 100) + (Math.sin(time * 0.1) * 5);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
      ctx.fillStyle = getColorHex(color);
      ctx.fill();

      // Inner circle (eyes/face placeholder)
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY - 10, 5, 0, Math.PI * 2); // Left eye
      ctx.arc(centerX + 15, centerY - 10, 5, 0, Math.PI * 2); // Right eye
      ctx.fillStyle = 'white';
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(centerX, centerY + 10, 15, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();

      time++;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, amplitude, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={300} 
      className="w-full h-full object-contain"
    />
  );
};

export default Visualizer;

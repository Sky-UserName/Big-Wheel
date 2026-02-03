
import React, { useEffect, useRef, useState } from 'react';
import { Prize } from '../types';
import { WHEEL_COLORS } from '../constants';

interface WheelProps {
  prizes: Prize[];
  isSpinning: boolean;
  onSpinEnd: (wonPrize: Prize) => void;
  onStart: () => void;
}

const Wheel: React.FC<WheelProps> = ({ prizes, isSpinning, onSpinEnd, onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const [bulbState, setBulbState] = useState(false);

  // Bulb blinking
  useEffect(() => {
    const interval = setInterval(() => setBulbState(s => !s), 400);
    return () => clearInterval(interval);
  }, []);

  // Drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 40;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, size, size);

    // 1. Outer Yellow Circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 25, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffcc00'; 
    ctx.fill();
    ctx.strokeStyle = '#e6b800';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bulbs
    const bulbCount = 24;
    for (let i = 0; i < bulbCount; i++) {
      const angle = (i * 2 * Math.PI) / bulbCount;
      const bx = centerX + (radius + 15) * Math.cos(angle);
      const by = centerY + (radius + 15) * Math.sin(angle);
      const isLit = bulbState ? i % 2 === 0 : i % 2 !== 0;
      
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, 2 * Math.PI);
      ctx.fillStyle = isLit ? '#FFFFFF' : '#ffd633';
      if (isLit) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fff';
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 2. Prize Sectors
    prizes.forEach((prize, i) => {
      const startAngle = i * sliceAngle + rotation;
      const endAngle = startAngle + sliceAngle;
      
      // Sector background
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      
      // Separator
      ctx.strokeStyle = '#f0e68c';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 3. Layout: Horizontal text (Perpendicular to radius)
      // Level (outer) -> Name (middle) -> Icon (inner)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      
      const textColor = '#333';
      const subTextColor = '#666';

      // Prize Level
      ctx.save();
      ctx.translate(radius * 0.82, 0);
      ctx.rotate(Math.PI / 2); 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px "Noto Sans SC"';
      ctx.fillText(prize.level, 0, 0);
      ctx.restore();

      // Item Name
      ctx.save();
      ctx.translate(radius * 0.65, 0);
      ctx.rotate(Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = subTextColor;
      ctx.font = '12px "Noto Sans SC"';
      ctx.fillText(prize.name, 0, 0);
      ctx.restore();

      // Item Icon
      ctx.save();
      ctx.translate(radius * 0.42, 0);
      ctx.rotate(Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '48px "Noto Sans SC"';
      ctx.fillText(prize.icon, 0, 0);
      ctx.restore();

      ctx.restore();
    });

    // 4. Center Button and Pointer
    // Pointer (Top)
    ctx.beginPath();
    ctx.moveTo(centerX - 18, centerY - 55);
    ctx.lineTo(centerX + 18, centerY - 55);
    ctx.lineTo(centerX, centerY - 85);
    ctx.closePath();
    ctx.fillStyle = '#ff4d4d';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Button Glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 68, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();

    // Red Circular Button
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
    const btnGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 60);
    btnGrad.addColorStop(0, '#ff6b6b');
    btnGrad.addColorStop(1, '#ee0000');
    ctx.fillStyle = btnGrad;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Button Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Noto Sans SC"';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN', centerX, centerY - 10);
    ctx.fillText('NOW', centerX, centerY + 20);

  }, [prizes, rotation, bulbState]);

  // Spin control
  useEffect(() => {
    if (isSpinning) {
      const winnerIdx = Math.floor(Math.random() * prizes.length);
      const extraSpins = 10 + Math.random() * 5;
      const sliceAngle = (2 * Math.PI) / prizes.length;
      
      const targetRotation = rotationRef.current + (extraSpins * 2 * Math.PI) - (winnerIdx * sliceAngle + sliceAngle / 2) - Math.PI / 2;
      
      const startTime = performance.now();
      const duration = 6500; 

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 5); 
        const currentRot = rotationRef.current + (targetRotation - rotationRef.current) * easeOut;
        
        setRotation(currentRot);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          rotationRef.current = currentRot % (2 * Math.PI);
          onSpinEnd(prizes[winnerIdx]);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isSpinning, prizes, onSpinEnd]);

  return (
    <div className="relative inline-block select-none cursor-pointer group" onClick={!isSpinning ? onStart : undefined}>
      <canvas 
        ref={canvasRef} 
        width={700} 
        height={700} 
        className="rounded-full transition-transform duration-500 hover:scale-[1.01] active:scale-[0.98]"
      />
    </div>
  );
};

export default Wheel;


import React, { useEffect, useRef, useState } from 'react';
import { Employee } from '../types';
import { WHEEL_COLORS } from '../constants';

interface WheelProps {
  participants: Employee[];
  isSpinning: boolean;
  targetWinnerIndex: number | null;
  onSpinEnd: () => void;
  onStart: () => void;
  lang: 'en' | 'zh';
}

const Wheel: React.FC<WheelProps> = ({ participants, isSpinning, targetWinnerIndex, onSpinEnd, onStart, lang }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0); // 存储当前旋转的绝对弧度值
  const [bulbState, setBulbState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setBulbState(s => !s), 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displaySize = 720;

    if (canvas.width !== displaySize * dpr) {
      canvas.width = displaySize * dpr;
      canvas.height = displaySize * dpr;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const centerX = displaySize / 2;
    const centerY = displaySize / 2;
    const outerRadius = displaySize / 2 - 10;
    const frameWidth = 35;
    const wheelRadius = outerRadius - frameWidth;
    
    const items = participants.length > 0 ? participants : [{ name: lang === 'en' ? 'Waiting...' : '等待名单...' }];
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, displaySize, displaySize);

    // 外圈光效
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#b91d1d';
    ctx.fill();
    ctx.restore();

    // 金属边框
    const frameGrad = ctx.createRadialGradient(centerX, centerY, wheelRadius, centerX, centerY, outerRadius);
    frameGrad.addColorStop(0, '#855e00'); 
    frameGrad.addColorStop(0.2, '#ffd700'); 
    frameGrad.addColorStop(0.5, '#fff8dc'); 
    frameGrad.addColorStop(0.8, '#daa520'); 
    frameGrad.addColorStop(1, '#5c4400'); 
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.lineWidth = frameWidth;
    ctx.strokeStyle = frameGrad;
    ctx.stroke();

    // 装饰灯泡
    const bulbCount = 36;
    for (let i = 0; i < bulbCount; i++) {
      const angle = (i * 2 * Math.PI) / bulbCount;
      const bx = centerX + (outerRadius - frameWidth / 2) * Math.cos(angle);
      const by = centerY + (outerRadius - frameWidth / 2) * Math.sin(angle);
      const isLit = bulbState ? i % 2 === 0 : i % 2 !== 0;
      
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#333';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, 2 * Math.PI);
      if (isLit) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fff';
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#665500';
        ctx.fill();
      }
    }

    // 绘制扇区
    items.forEach((item, i) => {
      const startAngle = i * sliceAngle + rotation;
      const endAngle = startAngle + sliceAngle;
      
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
      ctx.closePath();
      
      const sectorGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, wheelRadius);
      sectorGrad.addColorStop(0, '#ffffff');
      sectorGrad.addColorStop(0.3, WHEEL_COLORS[i % WHEEL_COLORS.length]);
      sectorGrad.addColorStop(1, WHEEL_COLORS[i % WHEEL_COLORS.length]);
      
      ctx.fillStyle = sectorGrad;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 文字标签
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      
      const isBoss = 'isBoss' in item && (item as any).isBoss;
      const name = ('name' in item ? (item as any).name : 'Spin').toString();

      const nameStartX = wheelRadius * 0.92;
      const maxWidth = wheelRadius * 0.75;
      let fontSize = items.length > 40 ? 9 : (items.length > 20 ? 12 : 16);
      
      ctx.font = `900 ${fontSize}px "Noto Sans SC", sans-serif`;
      
      const metrics = ctx.measureText(name);
      if (metrics.width > maxWidth) {
        fontSize = fontSize * (maxWidth / metrics.width);
        ctx.font = `900 ${fontSize}px "Noto Sans SC", sans-serif`;
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isBoss ? '#7f1d1d' : '#333';
      ctx.fillText(name, nameStartX, 0);

      ctx.restore();
    });

    // 中心控制器外圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 抽奖按钮底座
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 75, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();

    // SPIN 按钮
    ctx.beginPath();
    ctx.arc(centerX, centerY, 64, 0, 2 * Math.PI);
    const innerBtnGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 64);
    innerBtnGrad.addColorStop(0, '#ff4d4d');
    innerBtnGrad.addColorStop(1, '#7f1d1d');
    ctx.fillStyle = innerBtnGrad;
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 26px "Noto Sans SC"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(lang === 'en' ? 'SPIN' : '抽奖', centerX, centerY - 5);
    ctx.font = 'bold 16px "Noto Sans SC"';
    ctx.fillText(lang === 'en' ? 'LUCK' : '祝好运', centerX, centerY + 22);

    // 指针 (指向 12 点钟方向)
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - wheelRadius + 15);
    ctx.lineTo(centerX - 25, centerY - wheelRadius - 40);
    ctx.lineTo(centerX + 25, centerY - wheelRadius - 40);
    ctx.closePath();
    const needleGrad = ctx.createLinearGradient(centerX - 25, 0, centerX + 25, 0);
    needleGrad.addColorStop(0, '#ef4444');
    needleGrad.addColorStop(0.5, '#ffffff');
    needleGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = needleGrad;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

  }, [participants, rotation, bulbState, lang]);

  useEffect(() => {
    if (isSpinning && participants.length > 0 && targetWinnerIndex !== null) {
      const sliceAngle = (2 * Math.PI) / participants.length;
      
      // 核心修复逻辑：
      // 1. 我们希望指针位置 (定死在 -PI/2) 对应于扇区的中心
      // 2. 扇区中心位置公式：index * sliceAngle + sliceAngle / 2
      // 3. 旋转后的落点公式：(index * sliceAngle + sliceAngle / 2 + FinalRotation) = -PI/2
      // 4. 所以 FinalRotation = -PI/2 - (index * sliceAngle + sliceAngle / 2)
      
      const extraSpins = 12 + Math.floor(Math.random() * 8); // 随机转 12-20 圈
      const currentRotationMod = rotationRef.current % (2 * Math.PI);
      
      // 目标落点相对于 0 度的位置 (为了对准 12 点钟，我们需要 -90度偏移)
      const targetLanding = (2 * Math.PI) - (targetWinnerIndex * sliceAngle + sliceAngle / 2) - (Math.PI / 2);
      
      // 计算从当前位置到目标的距离
      const distance = (targetLanding - currentRotationMod + 4 * Math.PI) % (2 * Math.PI);
      
      // 最终总旋转值 = 当前累加值 + 补齐距离 + 额外圈数
      const finalTargetRotation = rotationRef.current + distance + (extraSpins * 2 * Math.PI);

      const startTime = performance.now();
      const duration = 8000; // 旋转持续 8 秒

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quintic ease-out 曲线，前快后慢，非常平滑
        const easeOut = 1 - Math.pow(1 - progress, 5); 
        const currentRot = rotationRef.current + (finalTargetRotation - rotationRef.current) * easeOut;
        
        setRotation(currentRot);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          rotationRef.current = finalTargetRotation; // 保存完整累加值
          onSpinEnd();
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isSpinning, participants, targetWinnerIndex, onSpinEnd]);

  return (
    <div className="relative inline-block select-none cursor-pointer group" onClick={!isSpinning ? onStart : undefined}>
      <canvas 
        ref={canvasRef} 
        className="rounded-full transition-transform duration-700 hover:scale-[1.03] active:scale-[0.98]"
      />
      <div className="absolute inset-0 rounded-full border-[1px] border-yellow-500/20 scale-105 pointer-events-none animate-pulse"></div>
    </div>
  );
};

export default Wheel;


import { useRef, useEffect } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const circles: Circle[] = [];
    const density = window.innerWidth > 768 ? 20 : 10;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    class Circle {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;
      color: string;
      
      constructor(x: number, y: number, radius: number, dx: number, dy: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.color = `rgba(239, 246, 255, ${Math.random() * 0.6 + 0.2})`;
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      update() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }
        
        this.x += this.dx;
        this.y += this.dy;
        
        this.draw();
      }
    }
    
    const init = () => {
      for (let i = 0; i < density; i++) {
        const radius = Math.random() * 100 + 20;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 0.5;
        const dy = (Math.random() - 0.5) * 0.5;
        
        circles.push(new Circle(x, y, radius, dx, dy));
      }
    };
    
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      circles.forEach(circle => {
        circle.update();
      });
    };
    
    init();
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      circles.length = 0;
      init();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-40"
    />
  );
};

export default AnimatedBackground;

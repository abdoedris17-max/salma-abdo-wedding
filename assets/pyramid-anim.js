const canvas = document.getElementById('pyramidCanvas');
const ctx = canvas.getContext('2d');

const dots = [
  [290,109],[321,106],[319,110],[327,110],[324,113],[268,129],[342,130],[347,131],[291,137],[322,139],
  [344,136],[251,152],[362,150],[271,157],[341,159],[363,158],[292,163],[322,165],[236,176],[378,178],
  [262,183],[351,185],[289,191],[324,192],[217,200],[398,202],[241,207],[373,209],[265,214],[349,215],
  [290,221],[323,223],[198,226],[415,226],[221,231],[418,229],[391,233],[246,238],[368,240],[270,245],
  [344,247],[293,251],[178,253],[321,253],[204,261],[409,262],[438,259],[234,269],[380,271],[263,277],
  [349,279],[160,279],[293,285],[161,284],[320,287],[181,288],[207,296],[407,297],[233,302],[380,304],
  [258,309],[355,311],[327,318],[289,316],[428,321],[208,328],[213,333],[403,332],[238,337],[376,340],
  [502,340],[268,342],[344,344],[350,350],[477,348],[318,352],[446,351],[397,367],[213,367],[124,370],
  [119,372],[374,374],[512,372],[518,373],[489,374],[465,380],[372,379],[470,381],[467,384],[437,387],
  [419,393],[441,391],[195,393],[414,394],[393,400]
];

canvas.width = 971; canvas.height = 961;

let frame = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  const scaleX = canvas.width / 600;
  const scaleY = canvas.height / 594;
  const rippleRadius = (frame * 1.8) % 700;
  const waveWidth = 90;

  dots.forEach(([dx, dy]) => {
    const x = dx * scaleX;
    const y = dy * scaleY;
    const dist = Math.sqrt((dx - 300) ** 2 + (dy - 80) ** 2);
    const phase = (rippleRadius - dist) / waveWidth;
    const intensity = Math.max(0, Math.sin(phase * Math.PI));

    if (intensity > 0.05) {
      const numRays = 12;
      const rayLen = (14 + intensity * 28) * scaleX;
      const alpha = intensity * 0.9;

      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2;
        const x2 = x + Math.cos(angle) * rayLen;
        const y2 = y + Math.sin(angle) * rayLen;

        const grad = ctx.createLinearGradient(x, y, x2, y2);
        grad.addColorStop(0, `rgba(255, 240, 140, ${alpha})`);
        grad.addColorStop(0.5, `rgba(220, 175, 50, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(200, 150, 20, 0)`);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = (0.8 + intensity * 1.5) * scaleX;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, (3 + intensity * 5) * scaleX);
      glowGrad.addColorStop(0, `rgba(255, 255, 200, ${alpha})`);
      glowGrad.addColorStop(1, `rgba(255, 200, 60, 0)`);
      ctx.beginPath();
      ctx.arc(x, y, (3 + intensity * 5) * scaleX, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 2.5 * scaleX, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(210, 170, 70, 0.5)';
      ctx.fill();
    }
  });

  frame++;
  requestAnimationFrame(animate);
}

animate();
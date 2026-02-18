import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = [16, 48, 128];
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
}

function drawBrainIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const s = size;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.42;

    // === Background: rounded square with gradient ===
    const cornerRadius = s * 0.22;
    const bgGrad = ctx.createLinearGradient(0, 0, s, s);
    bgGrad.addColorStop(0, '#1a0a2e');
    bgGrad.addColorStop(0.5, '#16213e');
    bgGrad.addColorStop(1, '#0f3460');

    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(s - cornerRadius, 0);
    ctx.quadraticCurveTo(s, 0, s, cornerRadius);
    ctx.lineTo(s, s - cornerRadius);
    ctx.quadraticCurveTo(s, s, s - cornerRadius, s);
    ctx.lineTo(cornerRadius, s);
    ctx.quadraticCurveTo(0, s, 0, s - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // === Glow behind brain ===
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.3);
    glowGrad.addColorStop(0, 'rgba(139, 92, 246, 0.35)');
    glowGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)');
    glowGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, s, s);

    // === Brain shape ===
    const brainScale = 0.36;
    const bx = cx;
    const by = cy + s * 0.02;

    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(brainScale, brainScale);

    // Brain gradient
    const brainGrad = ctx.createLinearGradient(-s, -s, s, s);
    brainGrad.addColorStop(0, '#a78bfa');
    brainGrad.addColorStop(0.4, '#8b5cf6');
    brainGrad.addColorStop(0.7, '#7c3aed');
    brainGrad.addColorStop(1, '#6d28d9');

    // Left hemisphere
    ctx.beginPath();
    ctx.moveTo(-2, -s * 0.8);
    ctx.bezierCurveTo(-s * 0.55, -s * 0.85, -s * 0.9, -s * 0.45, -s * 0.85, -s * 0.1);
    ctx.bezierCurveTo(-s * 0.95, s * 0.1, -s * 0.85, s * 0.45, -s * 0.55, s * 0.6);
    ctx.bezierCurveTo(-s * 0.35, s * 0.7, -s * 0.15, s * 0.75, -2, s * 0.65);
    ctx.fillStyle = brainGrad;
    ctx.fill();

    // Right hemisphere
    ctx.beginPath();
    ctx.moveTo(2, -s * 0.8);
    ctx.bezierCurveTo(s * 0.55, -s * 0.85, s * 0.9, -s * 0.45, s * 0.85, -s * 0.1);
    ctx.bezierCurveTo(s * 0.95, s * 0.1, s * 0.85, s * 0.45, s * 0.55, s * 0.6);
    ctx.bezierCurveTo(s * 0.35, s * 0.7, s * 0.15, s * 0.75, 2, s * 0.65);
    ctx.fillStyle = brainGrad;
    ctx.fill();

    // Brain folds / sulci
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = Math.max(s * 0.03, 1);
    ctx.lineCap = 'round';

    // Left hemisphere folds
    ctx.beginPath();
    ctx.moveTo(-s * 0.65, -s * 0.3);
    ctx.quadraticCurveTo(-s * 0.35, -s * 0.15, -s * 0.15, -s * 0.35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-s * 0.7, s * 0.05);
    ctx.quadraticCurveTo(-s * 0.4, s * 0.2, -s * 0.15, s * 0.05);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-s * 0.55, s * 0.35);
    ctx.quadraticCurveTo(-s * 0.3, s * 0.5, -s * 0.1, s * 0.4);
    ctx.stroke();

    // Right hemisphere folds
    ctx.beginPath();
    ctx.moveTo(s * 0.65, -s * 0.3);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.15, s * 0.15, -s * 0.35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(s * 0.7, s * 0.05);
    ctx.quadraticCurveTo(s * 0.4, s * 0.2, s * 0.15, s * 0.05);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(s * 0.55, s * 0.35);
    ctx.quadraticCurveTo(s * 0.3, s * 0.5, s * 0.1, s * 0.4);
    ctx.stroke();

    // Center line (fissure)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = Math.max(s * 0.02, 0.5);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.75);
    ctx.lineTo(0, s * 0.6);
    ctx.stroke();

    ctx.restore();

    // === Sparkle effects (only on larger icons) ===
    if (size >= 48) {
        const sparkles = [
            { x: cx - r * 0.6, y: cy - r * 0.7, sz: s * 0.04 },
            { x: cx + r * 0.7, y: cy - r * 0.5, sz: s * 0.035 },
            { x: cx - r * 0.5, y: cy + r * 0.6, sz: s * 0.03 },
            { x: cx + r * 0.6, y: cy + r * 0.5, sz: s * 0.025 },
        ];

        sparkles.forEach(sp => {
            ctx.fillStyle = 'rgba(236, 72, 153, 0.9)';
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.sz, 0, Math.PI * 2);
            ctx.fill();

            const spGlow = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.sz * 3);
            spGlow.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
            spGlow.addColorStop(1, 'rgba(236, 72, 153, 0)');
            ctx.fillStyle = spGlow;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.sz * 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // === Small detox pill accent (only on larger icons) ===
    if (size >= 48) {
        const pillX = cx + r * 0.55;
        const pillY = cy + r * 0.75;
        const pillW = s * 0.12;
        const pillH = s * 0.06;
        const pillR = pillH / 2;

        ctx.beginPath();
        ctx.moveTo(pillX - pillW / 2 + pillR, pillY - pillH / 2);
        ctx.lineTo(pillX + pillW / 2 - pillR, pillY - pillH / 2);
        ctx.arc(pillX + pillW / 2 - pillR, pillY, pillR, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(pillX - pillW / 2 + pillR, pillY + pillH / 2);
        ctx.arc(pillX - pillW / 2 + pillR, pillY, pillR, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();

        ctx.save();
        ctx.clip();
        ctx.fillStyle = '#10b981';
        ctx.fillRect(pillX - pillW / 2, pillY - pillH / 2, pillW / 2, pillH);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(pillX, pillY - pillH / 2, pillW / 2, pillH);
        ctx.restore();
    }

    return canvas;
}

// Generate all sizes
SIZES.forEach(size => {
    const canvas = drawBrainIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(ICONS_DIR, `icon${size}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Generated ${filePath} (${size}x${size})`);
});

console.log('\n🎉 All icons generated successfully!');

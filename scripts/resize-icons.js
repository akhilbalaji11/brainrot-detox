// Simple icon resize script using canvas (no external dependencies)
import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

const sizes = [16, 48, 128];
const sourcePath = './icon.png';

async function resizeIcons() {
    const img = await loadImage(sourcePath);

    for (const size of sizes) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(`./public/icons/icon${size}.png`, buffer);
        console.log(`Created icon${size}.png`);
    }
}

resizeIcons().catch(console.error);

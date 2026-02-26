// Simple icon resize script using canvas (no external dependencies)
const fs = require('fs');
const { createCanvas } = require('canvas');

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

function loadImage(path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = path;
    });
}

resizeIcons().catch(console.error);

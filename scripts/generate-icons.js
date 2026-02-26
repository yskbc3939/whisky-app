const sharp = require('sharp');
const path = require('path');

async function generateIcons() {
    const sizes = [192, 512];

    for (const size of sizes) {
        try {
            await sharp({
                create: {
                    width: size,
                    height: size,
                    channels: 4,
                    background: { r: 15, g: 17, b: 21, alpha: 1 } // var(--bg-dark)
                }
            })
                .composite([
                    {
                        input: Buffer.from(`<svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="none" stroke="#cfaa70" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`),
                        gravity: 'center'
                    }
                ])
                .png()
                .toFile(path.join(__dirname, '..', 'public', 'icons', `icon-${size}x${size}.png`));

            console.log(`Generated ${size}x${size} icon`);
        } catch (err) {
            console.error(`Error generating ${size}x${size} icon:`, err);
        }
    }
}

generateIcons();

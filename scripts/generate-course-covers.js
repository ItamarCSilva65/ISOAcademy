const fs = require('fs');
const path = require('path');

const courses = require('../data/coursesData');
const freeCourses = require('../data/cursos_gratuitosData');

async function loadSharp() {
  try {
    return require('sharp');
  } catch (error) {
    console.error('Dependência ausente: sharp. Execute: npm.cmd install sharp');
    throw error;
  }
}

async function buildCover(sharp, sourcePath, targetPath) {
  const image = sharp(sourcePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Imagem inválida: ${sourcePath}`);
  }

  await image
    .resize(1200, 675, { fit: 'cover', position: 'attention' })
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(targetPath);
}

async function main() {
  const sharp = await loadSharp();

  const outDir = path.join(__dirname, '..', 'public', 'img', 'courses');
  const photosDir = path.join(outDir, 'photos');
  fs.mkdirSync(outDir, { recursive: true });

  const allCourses = [
    ...courses.map((course) => course.id),
    ...freeCourses.map((course) => course.id)
  ];

  let generated = 0;

  for (const id of allCourses) {
    const sourcePhoto = path.join(photosDir, `${id}.jpg`);
    const targetCover = path.join(outDir, `${id}.png`);

    if (!fs.existsSync(sourcePhoto)) {
      throw new Error(`Foto não encontrada para o curso ${id}: ${sourcePhoto}`);
    }

    await buildCover(sharp, sourcePhoto, targetCover);
    generated += 1;
  }

  console.log(`Generated ${generated} course covers (PNG) at ${outDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

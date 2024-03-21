import fs from 'fs';
import path from 'path';
import { json } from '@sveltejs/kit';
const setsPath:string = './src/sets/';
// ----- GET -----

async function getPicPaths() {
  //const __dirname = path.dirname(new URL(import.meta.url).pathname);
  //const setsPath = path.resolve(__dirname, sets);
  const subFolders = fs.readdirSync(setsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const subFolder of subFolders) {
    const subFolderPath = path.join(setsPath, subFolder);
    const aFolderPath = path.join(subFolderPath, 'a');
    const bFolderPath = path.join(subFolderPath, 'b');

    const aPictures = fs.readdirSync(aFolderPath)
      .filter(file => file.endsWith('.png'))
      .map(file => path.join(aFolderPath, file));

    const bPictures = fs.readdirSync(bFolderPath)
      .filter(file => file.endsWith('.png'))
      .map(file => path.join(bFolderPath, file));

    const pictures = { a: aPictures, b: bPictures };
    const picturesPath = path.join(subFolderPath, 'pictures.json');

    fs.writeFileSync(picturesPath, JSON.stringify(pictures));
  }
}

export async function GET(event) {
    getPicPaths();
  
    const options: ResponseInit ={
      status:200,
    }

    return new Response('Reloaded', options);
  }
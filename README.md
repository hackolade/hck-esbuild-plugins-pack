# hck-esbuild-plugins-pack
The pack of custom ESbuild plugins for packaging Hackolade plugins

## Contains
- **copyFolderFiles** - Plugin for copy files from folder where script executed to package folder. Support excluding files by extension or by file name.
- **addReleaseFlag** - Plugin for modifying package.json file by adding `release: true` flag

## Installation
```
npm install @hackolade/hck-esbuild-plugins-pack
```

## Usage
```javascript
import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';

(async () => {
    const res = await build({
        entryPoints: ['./demo.js'],
        bundle: true,
        outfile: './dist/main.js',
        plugins: [
            copyFolderFiles({
                fromPath: __dirname,
                targetFolderPath: './dist',
                excludedExtensions: ['.js', '.g4'],
                excludedFiles: ['.github', 'package-lock.json'],
            }),
            addReleaseFlag('./dist/package.json'),
        ],
    });
})();
```
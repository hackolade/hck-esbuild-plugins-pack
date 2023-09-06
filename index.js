const path = require('path');
const fs = require('fs/promises');
const fsExtra = require('fs-extra');

const copyFiles = (filePaths, {targetFolderPath, excludedExtensions = [], excludedFiles = []}) => {
    return filePaths.reduce(async (nextFile, file) => {
        await nextFile;

        const ignoredFile = excludedExtensions.some(ext => file.endsWith(ext)) || excludedFiles.includes(file);
        if (ignoredFile) {
            return Promise.resolve();
        }

        const fileStats = await fs.lstat(file);
        if (fileStats.isDirectory()) {
            const nestedFiles = await fs.readdir(file);
            return copyFiles(
                nestedFiles.map(nestedFile => path.join(file, nestedFile)),
                {
                    targetFolderPath,
                    excludedExtensions,
                    excludedFiles,
                },
            );
        }

        return fsExtra.copy(file, path.resolve(targetFolderPath, file));
    }, Promise.resolve());
};

const copyFolderFiles = (options) => ({
    name: 'copyFiles',
    setup(build) {
        build.onEnd(async () => {
            try {
                const files = await fs.readdir(options.fromPath);
                await copyFiles(files, options);
            } catch (err) {
                console.error('Copy files failed with:', err);
            }
        });
    },
});

const addReleaseFlag = (packageJsonPath) => ({
    name: 'addReleaseFlag',
    setup(build) {
        build.onEnd(async () => {
            try {
                const fileContent = await fs.readFile(packageJsonPath);
                const data = JSON.parse(fileContent.toString());

                data.release = true;

                await fs.writeFile(packageJsonPath, JSON.stringify(data, null, 4));
            } catch (err) {
                console.error('Changing package.json failed with:', err);
            }
        });
    },
});

module.exports = {
    copyFolderFiles,
    addReleaseFlag,
};

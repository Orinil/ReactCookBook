"use strict";
const fs = require("fs");
const path = require("path");

const uf = fs.promises.unlink;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "images");

class ImagesDao {
    constructor(storagePath) {
        this.imageStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    async deleteImage(image) {
        let imagePath = path.join(this._getStorageLocation(), `${image.id}.${image.ext}`);
        // smažeme obrázek
        await uf(imagePath)
        return {}
    }

    _getStorageLocation() {
        return this.imageStoragePath;
    }
}

module.exports = ImagesDao;

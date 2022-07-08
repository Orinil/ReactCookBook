"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "categories.json");

class LibraryDao {
    constructor(storagePath) {
        this.categoryStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    async createCategory(category) {
        let categories = await this._loadCategories();
        if (categories.find(b =>  b.id === category.id)) {
            throw new Error(`Category with given id ${category.id} already exists.`);
        }
        categories.push(category)
        await wf(this._getStorageLocation(), JSON.stringify(categories, null, 2));
        return category;
    }

    async getCategory(id) {
        let categories = await this._loadCategories();
        return categories.find(b => b.id === id);
    }

    async deleteCategory(id) {
        let categories = await this._loadCategories();
        const categoryIndex = categories.findIndex(b => b.id === id)
        if (categoryIndex >= 0) {
            categories.splice(categoryIndex, 1)
        }
        await wf(this._getStorageLocation(), JSON.stringify(categories, null, 2))
        return {};
    }

    async updateCategory(category){
        let categories = await this._loadCategories();
        const categoryIndex = categories.findIndex(b => b.id === category.id)
        if (categoryIndex < 0) {
            throw new Error(`Category with given id ${category.id} does not exists.`);
        } else {
            categories[categoryIndex] = {
                ...category,
                name: category.name
            }
        }
        await wf(this._getStorageLocation(), JSON.stringify(categories, null, 2))
        return categories[categoryIndex];
    }

    async listCategories() {
        let categories = await this._loadCategories();
        return categories;
    }

    async _loadCategories() {
        let categories;
        try {
            categories = JSON.parse(await rf(this._getStorageLocation()));
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.info("No storage found, initializing new one...");
                categories = [];
            } else {
                throw new Error("Unable to read from storage. Wrong data format. " +
                    this._getStorageLocation());
            }
        }
        return categories;
    }

    _getStorageLocation() {
        return this.categoryStoragePath;
    }
}

module.exports = LibraryDao;

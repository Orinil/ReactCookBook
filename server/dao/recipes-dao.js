"use strict";
const fs = require("fs");
const path = require("path");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipes.json");

class LibraryDao {
    constructor(storagePath) {
        this.recipeStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
    }

    async createRecipe(recipe) {
        let recipes = await this._loadReceipts();
        if (recipes.find(b =>  b.id === recipe.id)) {
            throw new Error(`Recipe with given id ${recipe.id} already exists.`);
        }
        recipes.push(recipe)
        await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2));
        return recipe;
    }

    async listReceipts() {
        return await this._loadReceipts();
    }

    async updateRecipe(recipe){
        let recipes = await this._loadReceipts();
        const recipeIndex = recipes.findIndex(b => b.id === recipe.id)
        if (recipeIndex < 0) {
            throw new Error(`Recipe with given id ${recipe.id} does not exists.`);
        } else {
            recipes[recipeIndex] = {
                ...recipes[recipeIndex],
                ...recipe
            }
        }
        await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
        return recipes[recipeIndex];
    }

    async _updateRecipeImageExtension(recipeId, ext){
        let recipes = await this._loadReceipts();
        const recipeIndex = recipes.findIndex(b => b.id === recipeId)
        if (recipeIndex < 0) {
            throw new Error(`Recipe with given id ${recipeId} does not exists.`);
        } else {
            recipes[recipeIndex] = {
                ...recipes[recipeIndex],
                imageExt: ext
            }
        }
        await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
        return recipes[recipeIndex];
    }

    async loadRecipeDetail(id){
        let recipes = await this._loadReceipts();
        return recipes.find(recipe => recipe.id === id)
    }

    async deleteRecipe(id){
        let recipes = await this._loadReceipts();
        const recipeIndex = recipes.findIndex(b => b.id === id)
        if (recipeIndex >= 0) {
            recipes.splice(recipeIndex, 1)
        }
        await wf(this._getStorageLocation(), JSON.stringify(recipes, null, 2))
        return {};
    }

    async _loadReceipts() {
        let receipts;
        try {
            receipts = JSON.parse(await rf(this._getStorageLocation()));
        } catch (e) {
            if (e.code === 'ENOENT') {
                console.info("No storage found, initializing new one...");
                receipts = [];
            } else {
                throw new Error("Unable to read from storage. Wrong data format. " +
                    this._getStorageLocation());
            }
        }
        return receipts;
    }

    _getStorageLocation() {
        return this.recipeStoragePath;
    }
}

module.exports = LibraryDao;

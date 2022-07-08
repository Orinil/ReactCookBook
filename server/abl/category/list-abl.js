const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/categories-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "categories.json"))

async function ListAbl(req, res) {
    try {
        const categories = await dao.listCategories();
        res.json(categories);
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = ListAbl;

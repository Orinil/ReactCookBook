const path = require("path");
const Ajv = require("ajv").default;
const LibraryDao = require("../../dao/recipes-dao");
let dao = new LibraryDao(path.join(__dirname, "..", "..", "storage", "recipes.json"))

async function ListAbl(req, res) {
    try {
        const receipts = await dao.listReceipts();
        res.json(receipts);
    } catch (e) {
        res.status(500).send(e)
    }
}

module.exports = ListAbl;

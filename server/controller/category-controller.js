const express = require("express");
const router = express.Router();

//Toto je soubor pro centrální registraci APIs ke správě kategorií (CRUD)

const CreateAbl = require("../abl/category/create-abl");
const DeleteAbl = require("../abl/category/delete-abl");
const ListAbl = require("../abl/category/list-abl");
const UpdateAbl = require("../abl/category/update-abl");

//API pro vytváření nové kategorie
router.post("/create", async (req, res) => {
  await CreateAbl(req, res)
});

//API pro smazání existující kategorie
router.delete("/delete", async (req, res) => {
  await DeleteAbl(req, res)
});

//API pro zobrazení seznamu všech existujících kategorií
router.get("/list", async (req, res) => {
  await ListAbl(req, res)
});

//API pro update existující kategorie
//Zvolena metoda POST, ne PUT (pro jednoduchost)
router.post("/update", async (req, res) => {
  await UpdateAbl(req, res)
});

module.exports = router

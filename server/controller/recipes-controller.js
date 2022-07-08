const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/recipes/create-abl");
const GetAbl = require("../abl/recipes/get-abl");
const ListAbl = require("../abl/recipes/list-abl");
const UpdateAbl = require("../abl/recipes/update-abl");
const DeleteAbl = require("../abl/recipes/delete-abl");

router.post("/create", async (req, res) => {
    await CreateAbl(req, res)
});

router.post("/update", async (req, res) => {
    await UpdateAbl(req, res)
});

router.get("/list", async (req, res) => {
    await ListAbl(req, res)
});

router.delete("/delete", async (req, res) => {
    await DeleteAbl(req, res)
});

router.get("/get/:id", async (req, res) => {
    await GetAbl(req, res)
});


module.exports = router

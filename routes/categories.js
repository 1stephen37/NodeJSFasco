const express = require('express');
const router = express.Router();
const categoryModel = require('../models/categoryModel');


router.get('/', async function(req, res, next) {
    const data = await categoryModel.find();
    res.json(data);
});

router.get('/', async function(req, res, next) {
    try {

    } catch(err) {
        res.status(500).json({"message": err})
    }
});


module.exports = router;

const express = require('express');
const router = express.Router();
const deliveryModel = require('../models/deliveryModel');
const {authAdmin} = require("../libaries/authenMiddleware");

/* GET home page. */
router.get('/',  async function(req, res, next) {
    try {
        const delivery = await deliveryModel.find();
        res.json(delivery);
    } catch (err) {
        res.status(500).json({ message: err })
    }
});

router.post('/',  async function(req, res, next) {
    const data = req.body;
    delete data._id;
    try {
        const delivery = await deliveryModel.create(data);
        res.status(200).json(delivery);
    } catch (err) {
        res.status(500).json({ message: err })
    }
});

router.delete('/:id', authAdmin, async function(req, res, next) {
    const id = req.params.id;
    try {
        const delivery = await deliveryModel.findByIdAndDelete(id);
        res.status(200).json(delivery);
    } catch (err) {
        res.status(500).json({ message: err })
    }
});

module.exports = router;

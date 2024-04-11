const express = require('express');
const router = express.Router();
const orderModel = require('../models/orderModel.js');
const {auth} = require("../libaries/authenMiddleware");
const mongoose = require('mongoose');


/* GET home page. */
router.get('/', auth, async function (req, res, next) {
    const {id_user} = req.query;
    let filter = {};
    if (id_user) filter.id_user = id_user;
    try {
        const orders = await orderModel.find(filter);
        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err});
    }
});

router.post('/', auth, async function (req, res, next) {
    const order = req.body;
    try {
        delete order._id;
        order.id_delivery = new mongoose.Types.ObjectId(order.id_delivery);
        order.id_user = new mongoose.Types.ObjectId(order.id_user);
        order.id_voucher = new mongoose.Types.ObjectId(order.id_voucher);
        orderModel.create(order)
            .then(newOrder => {
                console.log(newOrder)
                res.status(200).json(newOrder);
            })
            .catch(err => {
                res.status(401).json(err)
            })
    } catch (err) {
        res.status(500).json({message: err});
    }
});


module.exports = router;

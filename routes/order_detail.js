const express = require('express');
const router = express.Router();
const order_detail = require('../models/order_detailMpdel');
const {auth} = require("../libaries/authenMiddleware");
const mongoose = require("mongoose");

/* GET home page. */
router.get('/', auth ,async function(req, res, next) {
  const { id_order } = req.query;
  console.log(id_order)
  const filter = {};
  if(id_order) filter.id_order = id_order;
  console.log(filter)
  try {
    const orders = await order_detail.find(filter);
    console.log(orders);
    res.json(orders);
  } catch(err) {
    res.status(500).json({message: err});
  }
});

router.get('/:id', auth, async function(req, res, next) {
  try {
    const orders = await order_detail.find();
    res.json(orders);
  }catch(err) {
    res.status(500).json({message: err});
  }
});

router.post('/', auth, async function(req, res, next) {
  const data = req.body;
  try {
    delete data._id;
    data.id_product = new mongoose.Types.ObjectId(data.id_product);
    data.id_order = new mongoose.Types.ObjectId(data.id_order);
    order_detail.create(data)
        .then(newOrderDetail => {
          res.status(200).json(newOrderDetail)
        })
        .catch(err => {
          res.status(401).json({message: err});
        })
  }catch(err) {
    res.status(500).json({message: err});
  }
});



module.exports = router;

const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');

router.get('/', async function (req, res, next) {
    const {id_category, _start, _end, sort} = req.query;
    const filter = {};
    if (id_category) {
        filter.id_category = id_category;
    }
    try {
        let query = productModel.find(filter);
        if (_start && _end) {
            const start = parseInt(_start);
            const end = parseInt(_end);
            query = query.skip(start).limit(end);
        }
        let data = await query.exec();
        if (sort === 'up') {
            data = data.sort((a, b) => b.properties[0].price - a.properties[0].price);
        } else if (sort === 'down') {
            data = data.sort((a, b) => a.properties[0].price - b.properties[0].price);
        }
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async function (req, res, next) {
    const productId = req.params.id;
    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
});

router.post('/', async function (req, res, next) {

});

router.get('/test/1', async function (req, res, next) {

});

module.exports = router;

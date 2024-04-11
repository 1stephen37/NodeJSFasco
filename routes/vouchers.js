const express = require('express');
const router = express.Router();
const voucherModel = require('../models/voucherModel');
const {authAdmin} = require("../libaries/authenMiddleware");

router.get('/', async function (req, res, next) {
    const {_start, _end, total} = req.query;
    let filter = {};
    try {
        if (total) {
            filter.min_amount = {$lte: total};
            filter.expired = false;
        }
        let query = voucherModel.find(filter);
        if (_start && _end) {
            const start = parseInt(_start);
            const end = parseInt(_end);
            query = query.skip(start).limit(end);
        }
        let data = await query.exec();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({'error': err})
    }

});

router.post('/', authAdmin, async function (req, res, next) {
    const data = req.body;
    try {
        voucherModel.create({
            code: data.code,
            discount: data.discount,
            min_amount: data.min_amount,
            date_end: data.date_end,
            expired: data.expired
        })
            .then(response => {
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({message: err})
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({'error': err})
    }
})

router.delete('/:id', authAdmin, async function (req, res, next) {
    const idVoucher = req.params.id;
    try {
        voucherModel.findByIdAndDelete(idVoucher)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({message: err})
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({'error': err})
    }
})

router.put('/:id', authAdmin ,async function (req, res, next) {
    const idVoucher = req.params.id;
    const data = req.body;
    try {
        voucherModel.findByIdAndUpdate({
            _id: idVoucher
        }, data, {new: true})
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({message: err})
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({'error': err})
    }
})

module.exports = router;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const order_detail = new Schema(
    {
        id_product: {
            type: objectId
        },
        id_order: {
            type: objectId
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        }
    }, { versionKey : false }
)

module.exports = mongoose.models.order_detail || mongoose.model('order_detail', order_detail);

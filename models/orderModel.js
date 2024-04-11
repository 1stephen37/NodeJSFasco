const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const order = new Schema(
    {
        id_delivery: {
            type: objectId,
        },
        id_user: {
            type: objectId,
        },
        id_voucher: {
            type: objectId,
        },
        name: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        email: {
          type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        wrap: {
            type: Boolean
        },
        order_date: {
            type: String
        },
        order_status: {
          type: Number
        },
        distance: {
            type: Number
        },
        total: {
          type: Number
        },
        ship_fee: {
            type: Number
        }
    }, { versionKey: false }
)

module.exports = mongoose.models.order || mongoose.model('order', order);

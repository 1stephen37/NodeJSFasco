const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const product = new Schema(
    {
        id: {
            type: objectId
        },
        id_category: {
            type: objectId,
            ref: 'category'
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String
        },
        designer: {
            type: String
        },
        review: {
            type: Number
        },
        quantity: {
            type: Number
        },
        color: {
            type: String
        },
        sale: {
            type: Number
        },
        properties: {
            type: [Object]
        },
        images: {
            type: [String]
        },
        status: {
            type: Number
        }
    }
)

module.exports = mongoose.models.product || mongoose.model('product', product);
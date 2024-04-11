const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const delivery = new Schema(
    {
        id: {
            type: objectId
        },
        name: {
            type: String,
            required: true,
        },
        speed: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true,
        }
    }, { versionKey : false}
)

module.exports = mongoose.models.delivery || mongoose.model('delivery', delivery);

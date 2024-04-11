const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const objectId = Schema.ObjectId;

const category = new Schema(
    {
        id: {
            type: objectId
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Number
        }
    }
)

module.exports = mongoose.models.category || mongoose.model('category', category);
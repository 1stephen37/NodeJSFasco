const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voucher = new Schema(
    {
        code: {
            type: String,
            required: true,
            trim: true
        },
        discount: {
            type: Number,
            required: true
        },
        min_amount: {
            type: Number,
            required: true
        },
        date_end: {
            type: String,
            required: true
        },
        expired: {
            type: Boolean
        }
    },
    { versionKey: false }
)

module.exports = mongoose.models.voucher || mongoose.model('voucher', voucher);
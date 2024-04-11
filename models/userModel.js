const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String
        },
        role: {
            type: String,
            required: true
        },
        token: {
            type: String
        },
        reset: {
            type: String
        }
    },
    { versionKey: false }
)

module.exports = mongoose.models.user || mongoose.model('user', user);

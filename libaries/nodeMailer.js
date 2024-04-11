const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ngamingyahoo@gmail.com',
        pass: 'vsls rlrd nana mlhw',
    },
});

module.exports = transporter;
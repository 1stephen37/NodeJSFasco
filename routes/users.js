const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const {hashPassword, comparePassword} = require('../libaries/passwordUtils');
const {createToken, verifyToken} = require('../libaries/tokenLibary')
const {upload} = require('../libaries/uploadMiddleware.js')
const voucherModel = require("../models/voucherModel");
const {authAdmin, authUser, auth} = require("../libaries/authenMiddleware");
const fs = require('fs');
const transporter = require("../libaries/nodeMailer");

router.get('/', async function (req, res, next) {
    let filter = {};
    const {email} = req.query;
    try {
        if (email) filter.email = email;
        const data = await userModel.find(filter);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:userId', auth, async function (req, res, next) {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'user not found'});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error})
    }
});

router.post('/signIn', async function (req, res, next) {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({message: 'Email address is incorrect'});
        }
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({message: 'Password is incorrect'});
        }
        const accessToken = createToken(user._id, user.role, 60 * 60 * 60);
        const refreshToken = createToken(user._id, user.role, 15 * 24 * 60 * 60);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            image: user.image,
            accessToken,
            refreshToken,
            role: user.role,
        });
    } catch (error) {
        console.error('Login error', error);
        res.status(500).json({message: 'An error occurred while logging in'});
    }
});

router.post('/signUp', async function (req, res, next) {
    const data = req.body;
    const filter = {};
    if (data.email) {
        filter.email = data.email;
    }
    try {
        const user = await userModel.findOne(filter);
        if (user) {
            res.status(409).json({message: 'email already in exists'});
        } else {
            const hashPass = await hashPassword(data.password);
            userModel.create({
                name: data.name,
                password: hashPass,
                email: data.email,
                phone: data.phone,
                address: data.address,
                image: '',
                role: '0',
                token: '',
                reset: ''
            })
                .then((result) => {
                    const token = createToken(result._id, result.role, '1h');
                    res.status(200).json({
                        _id: result._id,
                        name: result.name,
                        email: result.email,
                        phone: result.phone,
                        address: result.address,
                        image: result.image,
                        token: token,
                        role: result.role,
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(401).json({message: err + ' this error in sign up'})
                })
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
});

router.post('/', authAdmin, async function (req, res, next) {
    let data = req.body;
    delete data._id;
    data.password = await hashPassword(data.password);
    try {
        userModel.create(data)
            .then(response => {
                console.log(response);
                res.status(200).json(response);
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({message: err})
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({'error': err})
    }
});

router.post('/avatar', upload.any(), async function (req, res, next) {
    const files = req.files;
    try {
        if (files.length > 0) {
            res.status(200).json({filename: files[0].filename});
        } else {
            res.status(501).json({message: "uploads avatar failed"});
        }
    } catch (err) {
        console.log(err)
        res.status(501).json({message: "uploads avatar failed"});
    }
});

router.put('/:id', authAdmin, async function (req, res, next) {
    const id = req.params.id;
    const data = req.body;
    delete data.password;
    try {
        const newUser = await userModel.findByIdAndUpdate({
            _id: id
        }, data, {new: true});
        res.status(200).json(newUser);
    } catch (err) {
        console.log(err)
        res.status(501).json({message: "uploads avatar failed"});
    }
});

router.delete('/avatar/:filename', auth, async function (req, res, next) {
    const filename = req.params.filename;
    try {
        fs.unlink(`public/images/uploads/${filename}`, (err) => {
            if (err) {
                // Xử lý lỗi
                console.error(err);
                res.status(501).json({err: 'error when remove image'})
            } else {
                console.log('Ảnh đã được xóa');
                res.status(200).json({});
                // Ảnh đã được xóa thành công
            }
        });
    } catch (err) {
        console.log(err)
        res.status(501).json({message: "uploads avatar failed"});
    }
});

router.delete('/:id', authAdmin, async function (req, res, next) {
    const id = req.params.id;
    try {
        userModel.deleteOne({
            _id: id
        })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(501).json({message: err})
            })
    } catch (err) {
        res.status(500).json({message: err});
    }
});

router.post('/refresh-token', async function (req, res, next) {
    let {_id} = req.body;
    try {
        let refresh_token;
        if(req.headers.authorization) {
            refresh_token = req.headers.authorization.split(' ')[1];
        } else {
            res.status(401).json({message: 'not found headers authorization refresh token '})
        }
        const decodedToken = verifyToken(refresh_token);
        if (decodedToken instanceof Error) {
            res.status(401).json({err: 'Refresh token is invalid'});
        } else {
            const userRole = decodedToken.role;
            const accessToken = await createToken(_id, userRole, 60 * 60 * 60);
            res.status(200).json(accessToken);
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
});

router.post('/reset-password', async (req, res) => {
    const email = req.body.email;
    const _id = req.body._id;
    const role = req.body.role;
    const token = createToken(_id, role, 60 * 60 * 60);
    console.log(email, _id, role);
    const resetUrl = `http://localhost:5173/account/reset_pass?token=${token}`;
    const mailOptions = {
        from: 'ngamingyahoo@gmail.com',
        to: email,
        subject: 'Request to reset password',
        html: `
            <h1>Request to reset password</h1>
            <a href="${resetUrl}">click here to reset your password</a>
        `,
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            res.status(500).send('Lỗi khi gửi email');
        } else {
            console.log('Email đã được gửi');
            res.status(200).send('Email đã được gửi');
        }
    });
});

router.post('/update-password', async (req, res) => {
    const {password} = req.body;
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const data = verifyToken(token);
            if (data instanceof Error) {
                res.status(401).json({error: 'access token invalid'})
            } else {
                console.log(data.userId)
                userModel.findByIdAndUpdate({
                    _id: data.userId,
                }, {
                    password: await hashPassword(password)
                }, {new: true})
                    .then((result) => {
                        res.status(200).json(result)
                    })
                    .catch((error) => {
                        res.status(500).json(error)
                    })
            }
        } else {
            res.status(401).json({error: 'Not authoried!!'});
        }
    } catch (err) {
        res.status(500).json({error: err})
    }
});

module.exports = router;

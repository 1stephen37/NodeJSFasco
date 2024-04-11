const jwt = require('jsonwebtoken');

const secretKey = 'FascoShop';

module.exports = {
    createToken: (userId, role, expiresIn) => {
        const payload = {
            userId: userId,
            role: role
        };
        return jwt.sign(payload, secretKey,  { expiresIn: expiresIn });
    },
    verifyToken: (token) => {
        try {
            return jwt.verify(token, secretKey);
        } catch (error) {
            return error;
        }
    }
};

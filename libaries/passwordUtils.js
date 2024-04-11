const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
    try {
        const saltRounds = 10; // Số vòng lặp để tạo salt
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        throw error;
    }
}

async function comparePassword(plainPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    hashPassword,
    comparePassword
};

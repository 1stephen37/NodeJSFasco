const {verifyToken} = require('../libaries/tokenLibary')

const authAdmin = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const data = verifyToken(token);
            if (data instanceof Error) {
                res.status(401).json({error: 'access token invalid'})
            } else if (data.role !== '1') {
                res.status(401).json({error: 'user cannot use this src'});
            } else {
                next();
            }
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({error: error.message});
    }
}

const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const data = verifyToken(token);
            if (data instanceof Error) {
                res.status(401).json({error: 'access token invalid'})
            } else {
                next();
            }
        } else {
            res.status(401).json({error: 'Not authoried!!'});
        }
    } catch (error) {
        res.status(401).json({error: error.message});
    }
}

const authUser = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const data = verifyToken(token);
            if (data instanceof Error) {
                res.status(401).json({error: 'access token invalid'})
            } else if(data.role !== '0') {
                res.status(401).json({error: 'only user allowed to access this src'})
            } else {
                next();
            }
        } else {
            res.status(401).json({error: 'Not authoried!!'});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({error: error.message});
    }
}

module.exports = {authAdmin, authUser, auth};

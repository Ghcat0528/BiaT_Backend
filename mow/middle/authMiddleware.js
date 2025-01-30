const { verifyToken } = require('../common');
const bcrypt = require('bcryptjs');

const authenticate = (req, res, next) => {
    const token = req. headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'no token provided?'});
    }
    const decoded = verifyToken(token);
    if(!decoded){
        return res.status(401).json({ error: 'Wrong token?'});
    }
    req.user = decoded;
    next();
};
module.exports = authenticate;
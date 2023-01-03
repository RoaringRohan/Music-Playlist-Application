const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkJWT = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header?.startsWith('Bearer ')) return res.sendStatus(401);
    console.log(header);
    const token = header.split(' ')[1];
    console.log(token)
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = checkJWT;
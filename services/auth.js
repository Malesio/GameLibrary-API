const jwt = require('jsonwebtoken');
const dao = require('../dao/userDao');

require('dotenv').config();

module.exports = (rank) => async (req, res, next) => {
    const value = req.header('Authorization') || '';
    const [type, sessionToken] = value.split(' ');

    if (type.toLowerCase() === 'bearer' && sessionToken) {
        try {
            const { userId } = jwt.verify(sessionToken, process.env.JWT_KEY, { algorithms: ['HS256'] });
            const user = await dao.getUserById(userId);

            if (/*user.sessionTokens.includes(sessionToken) && */
                (rank === 'user' || 
                    (rank === 'admin' && user.admin) )) {
                res.locals.user = user;
                res.locals.token = sessionToken;
                next();
            } else {
                res.status(401).send({message: 'Insufficient permissions'});
            }
        } catch (e) {
            res.status(403).send({message: 'Invalid session token'});
        }
    } else {
        res.status(400).send({message: 'Unauthorised access to authenticated route'});
    }
};

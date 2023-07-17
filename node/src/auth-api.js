const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get('/', (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (token == "null") {
            return res.status(401).send("No token provided");
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).send("Invalid token");
            }

            req.user = user;

            res.status(200).send(req.user.sub);

            next();
        });
    } else {
        res.status(401).send("No token provided");
    }
});

module.exports = router;
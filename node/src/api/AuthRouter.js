const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");


router.get('/', (req, res) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send("No token provided");
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send("Invalid token");
            }

            res.status(200).send(user.sub);
        });
    } else {
        res.status(401).send("No token provided");
    }
});

module.exports = router;
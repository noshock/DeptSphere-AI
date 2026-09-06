const express = require("express");
const router = express.Router();

const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

router.get("/", (req, res) => {
    let captcha = "";

    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    req.session.captcha = captcha;

    res.json({ captcha });
});

module.exports = router;
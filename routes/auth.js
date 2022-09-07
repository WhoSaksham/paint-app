const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "#GoodGoingSaksham"

//Route:1 -  Create a new user @ POST: /api/auth/createuser -No authentication required
router.post('/createuser', [
    body('name', 'Name must be greater than 5 characters').isLength({ min: 5 }),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must be greater than 5 characters').isLength({ min: 5 })
], async (req, res) => {
    // If erros throw bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let status;
        // Check if the user already exits with same email
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        status = 'success'
        res.json({ status, authToken, user })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Internal Server Error')
    }
});

//Route:2 - Authenticating a user @ POST: /api/auth/login -Authentication required
router.post('/login', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a valid Password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Try login with correct credentials" });
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            return res.status(400).json({ error: "Try login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ authToken, user: user.name })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Internal Server Error')
    }
});

module.exports = router
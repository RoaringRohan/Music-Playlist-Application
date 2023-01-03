const express = require('express');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const { find } = require('../model/user');
const router = express.Router();

const User = require('../model/user');

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    const checkDuplicate = await User.findOne({emailAddress: emailAddress}).exec();
    if (checkDuplicate) {
        return res.status(409).json({'message': 'Account already exists.'});
    }

    try {
        const result = await User.create({
            "username": username,
            "emailAddress": emailAddress,
            "password": password
        });

        res.status(201).json({'success': `New user ${username} created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
});

router.get('/login', async (req, res) => {
    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    if (!emailAddress) return res.status(400).json({'message': 'Username not entered.'});
    else if (!password) return res.status(400).json({'message': 'Password not entered.'});

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Username/Password was incorrect.'});
    if (findUser.username === 'deactivated') return res.status(401).json({'message': 'Account has been deactivated, contact admin to log in.'})

    const crossCheckPassword = await password.localeCompare(findUser.password);

    if (crossCheckPassword == 0) {
        const accessToken = jwt.sign(
            { "username": findUser.username }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '300s' }
        );
        const refreshToken = jwt.sign(
            { "username": findUser.username }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        findUser.refreshToken = refreshToken;
        const result = await findUser.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 });
        res.json({ accessToken });
    }
    else return res.status(401).json({'message': 'Username/Password was incorrect.'});
});

router.post('/update-password', async (req, res) => {
    const newPassword = req.body.password;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }
    
    findUser.password = newPassword;
    const result = await findUser.save();
    console.log(result);

    res.sendStatus(204);
});

router.get('/logout', async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    
    findUser.refreshToken = '';
    const result = await findUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
});

router.get('/deactivate', async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }
    
    findUser.username = 'deactivated';
    findUser.refreshToken = '';
    const result = await findUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
});

module.exports = router;
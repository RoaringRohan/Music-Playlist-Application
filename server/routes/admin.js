const express = require('express');
const router = express.Router();

const verifyRole = require('../middleware/verifyRole');
const Playlist = require('../model/playlist');
const User = require('../model/user');

router.post('/grant-privilege', verifyRole("Admin"), async (req, res) => {
    const emailAddress = req.body.emailAddress;

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Cannot find user.'});

    findUser.role = "Admin";
    const result = await findUser.save();
    res.sendStatus(200);
});

router.post('/make-review-hidden', verifyRole("Admin"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const playlistOwner = req.body.playlistOwner;
    const reviewer = req.body.reviewer;
    const date = req.body.date;

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: playlistOwner}).exec();

    if (!desiredPlaylist) return res.status(401).json({'message': 'Cannot find playlist.'});

    let reviewsArray = desiredPlaylist.reviews;

    try {
        for (let i = 0; i < reviewsArray.length; i ++) {
            if (JSON.parse(reviewsArray[i]).reviewer == reviewer && JSON.parse(reviewsArray[i]).date == date) {
                let review = JSON.parse(reviewsArray[i]);
                review.visibility = "hidden";
                jsonString = JSON.stringify(review);
                reviewsArray[i] = jsonString;
    
                desiredPlaylist.reviews = reviewsArray;
                const result = await desiredPlaylist.save();
    
                res.status(200).json({'message': 'Changed review to hidden.'});
            }
        }
    } catch (err) {
        return res.status(401).json({'message': `Could not change review's visibility.`});
    }
    
});

router.post('/make-review-show', verifyRole("Admin"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const playlistOwner = req.body.playlistOwner;
    const reviewer = req.body.reviewer;
    const date = req.body.date;

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: playlistOwner}).exec();

    if (!desiredPlaylist) return res.status(401).json({'message': 'Cannot find playlist.'});

    let reviewsArray = desiredPlaylist.reviews;

    try {
        for (let i = 0; i < reviewsArray.length; i ++) {
            if (JSON.parse(reviewsArray[i]).reviewer == reviewer && JSON.parse(reviewsArray[i]).date == date) {
                let review = JSON.parse(reviewsArray[i]);
                review.visibility = "show";
                jsonString = JSON.stringify(review);
                reviewsArray[i] = jsonString;
    
                desiredPlaylist.reviews = reviewsArray;
                const result = await desiredPlaylist.save();
    
                res.status(200).json({'message': 'Changed review to show.'});
            }
        }
    } catch (err) {
        return res.status(401).json({'message': `Could not change review's visibility.`});
    }
    
});

router.post('/usage/activate', verifyRole("Admin"), async (req, res) => {
    const emailAddress = req.body.emailAddress;

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Account was not found.'});
    
    if (findUser.usage == "active") return res.status(401).json({'message': 'Account is already active.'});

    if (findUser.usage = "deactivated") {
        findUser.usage = "active";
        const result = await findUser.save();
        res.status(200).json({'message': 'Account activated again'});
    }
});

router.post('/usage/deactivate', verifyRole("Admin"), async (req, res) => {
    const emailAddress = req.body.emailAddress;

    const findUser = await User.findOne({emailAddress: emailAddress}).exec();

    if (!findUser) return res.status(401).json({'message': 'Account was not found.'});
    
    if (findUser.usage == "deactivated") return res.status(401).json({'message': 'Account is already deactivated.'});

    if (findUser.usage = "active") {
        findUser.usage = "deactivated";
        const result = await findUser.save();
        res.status(200).json({'message': 'Account deactivated.'});
    }
});

module.exports = router;
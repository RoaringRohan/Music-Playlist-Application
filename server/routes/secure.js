const express = require('express');
const router = express.Router();
const verifyRole = require('../middleware/verifyRole');

const AssignPlaylist = require('../model/assignPlaylist');
const Playlist = require('../model/playlist');
const User = require('../model/user');

router.post('/playlist/new', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const description = req.body.description;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const checkCap = await AssignPlaylist.find({username: findUser.username}).exec();
    if (checkCap.length >= 20) {
        return res.status(401).json({'message': 'User exceeded 20 playlist count, cannot make more!'});
    }

    const checkDuplicate = await AssignPlaylist.findOne({playlist_name: playlistName}).exec();
    if (checkDuplicate && checkDuplicate.username == findUser.username) {
        return res.status(401).json({'message': 'Playlist with this name already exists in your account.'});
    }
    try {
        const result = await Playlist.create({
            "playlist_name": playlistName,
            "creator_username": findUser.username,
            "created_at": new Date(),
            "number_of_tracks": "0",
            "total_play_time": "0:00",
            "average_rating": "0",
            "description": description,
            "list_of_tracks": [],
            "visibility": "private"
        });

        const secondResult = await AssignPlaylist.create({
            "username": findUser.username,
            "playlist_name": playlistName
        });

        res.status(201).json({'success': `New playlist ${playlistName} created for ${findUser.username}!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
});

router.get('/playlist/view-all', verifyRole("Normal"), async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const playlists = await AssignPlaylist.find({username: findUser.username}).exec();

    const playlistNames = [];
    for (let i = 0; i < playlists.length; i ++) {
        playlistNames.push(playlists[i].playlist_name);
    }

    res.send(playlistNames);
});

router.post('/playlist/edit', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const description = req.body.description;
    const visibility = req.body.visibility;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    const desiredPlaylist = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
    if (desiredPlaylist && desiredPlaylist.creator_username == findUser.username) {
        if (description) {
            desiredPlaylist.description = description;
        }
        if (visibility) {
            if (visibility !== 'Private' && visibility !== 'Public') {
                return res.status(401).json({'message': 'When changing visibility, choose Public or Private.'});
            }
            desiredPlaylist.visibility = visibility;
        }
        desiredPlaylist.created_at = new Date();
        const result = await desiredPlaylist.save();
        return res.status(200).json({'message': 'Edited playlist.'});
    }
});

router.delete('/playlist/delete', verifyRole("Normal"), async (req, res) => {
    const playlistName = req.body.playlistName;
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(404);

    const refreshToken = cookies.jwt;

    const findUser = await User.findOne({refreshToken: refreshToken}).exec();

    if (!findUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(404);
    }

    try {
        const desiredPlaylistFromPlaylists = await Playlist.findOne({playlist_name: playlistName, creator_username: findUser.username}).exec();
        if (desiredPlaylistFromPlaylists && desiredPlaylistFromPlaylists.creator_username == findUser.username) {
            const result = await desiredPlaylistFromPlaylists.delete();
        }
    
        const desiredPlaylistFromAssign = await AssignPlaylist.findOne({playlist_name: playlistName, username: findUser.username}).exec();
        if (desiredPlaylistFromAssign && desiredPlaylistFromAssign.username == findUser.username) {
            const result = await desiredPlaylistFromAssign.delete();
        }

        res.status(200).json({'message': `Removed ${playlistName} playlist.`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
    
});

module.exports = router;
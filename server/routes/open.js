const express = require('express');
const { default: mongoose } = require('mongoose');
const { find } = require('../model/track');
const router = express.Router();

const Track = require('../model/track');
router.get('/tracks', async (req, res) => {
    const artist_name = req.body.artist_name;
    const track_genres = req.body.track_genres;
    const track_title = req.body.track_title;

    const searchParams = {};

  if (track_title) {
    searchParams.track_title = { $regex: track_title, $options: 'i' };
  }
  if (artist_name) {
    searchParams.artist_name = { $regex: artist_name, $options: 'i' };
  }
  if (track_genres) {
    searchParams.track_genres = { $regex: track_genres, $options: 'i' };
  }

  await Track.find(searchParams, 'track_title artist_name album_title track_genres track_duration track_date_created')
    .limit(20)
    .exec((err, tracks) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      const modifiedTracks = tracks.map(track => {
        return {
          track_title: track.track_title,
          artist_name: track.artist_name,
          album_title: track.album_title,
          track_genres: track.track_genres,
          track_duration: track.track_duration,
          track_date_created: track.track_date_created,
          youtube_search_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.artist_name} ${track.track_title}`)}`
        };
      });

      res.send(modifiedTracks);
    });
});

const Playlist = require('../model/playlist');
router.get('/playlists', async (req, res) => {
    await Playlist.find({ is_public: true }, 'playlist_name creator_username number_of_tracks total_play_time average_rating description list_of_tracks')
      .sort({ created_at: -1 })
      .limit(10)
      .exec((err, playlists) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }
        res.send(playlists);
      });
  });
  

module.exports = router;
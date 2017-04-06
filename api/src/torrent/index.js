import torrentStream from 'torrent-stream';
import path from 'path';
import _ from 'lodash';
import mongoose from 'mongoose';
import { Movie, Serie, User } from '../Schema';
import fs from 'fs';
import Transcoder from 'stream-transcoder';
import ffmpeg from 'ffmpeg';

export const movieTorrent = async (req, res) => {
  const options = {
    connections: 5000,     // Max amount of peers to be connected to.
    uploads: 10,          // Number of upload slots.
    tmp: './public',          // Root folder for the files storage.
                          // Defaults to '/tmp' or temp folder specific to your OS.
                          // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    path: './public/Media', // Where to save the files. Overrides `tmp`.
    verify: true,         // Verify previously stored data before starting
                          // Defaults to true
    dht: true,            // Whether or not to use DHT to initialize the swarm.
                          // Defaults to true
    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                          // Defaults to true
    trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
    ],
                            // Allows to declare additional custom trackers to use
                            // Defaults to empty
      // storage: '.'  // Use a custom storage backend rather than the default disk-backed one
  };
  const engine = await torrentStream(req.params.hash, options);
  let videoFile = '';
  let stream = '';

  engine.on('ready', () => {
    videoFile = engine.files.filter((file) => {
      const pathFile = path.extname(file.name);
      if (pathFile === '.mp4' || pathFile === '.mkv' || pathFile === '.avi') {
        return (file);
      }
    });
    const videoLength = videoFile[0].length;
    const range = req.headers.range;
    if (!range) return res.sendStatus(416);
    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const fileSize = videoLength;
    const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    let mime = videoFile[0].name.split('.');
    mime = _.last(mime);
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': `video/${mime}`,
    });
    stream = videoFile[0].createReadStream({ start, end });
    return stream.pipe(res);
  });
  engine.on('download', () => {
    const download = engine.swarm.downloaded;
    console.log(Math.floor((engine.swarm.downloaded * 8) / 10000024), 'M', videoFile[0].path);
  });
  engine.on('idle', () => {
    console.log('download Complete', videoFile[0].path);
    Movie.findOne({ id: req.params.id })
          .then((movie) => {
            if (movie) {
              const hash = req.params.hash;
              movie.path = { ...movie.path, [hash]: { path: videoFile[0].path } };
              movie.save();
            }
          });
  });
};

export const serieTorrent = (req, res) => {
  const options = {
    connections: 5000,     // Max amount of peers to be connected to.
    uploads: 10,          // Number of upload slots.
    tmp: './public',          // Root folder for the files storage.
                          // Defaults to '/tmp' or temp folder specific to your OS.
                          // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    path: './public/Media', // Where to save the files. Overrides `tmp`.
    verify: true,         // Verify previously stored data before starting
                          // Defaults to true
    dht: true,            // Whether or not to use DHT to initialize the swarm.
                          // Defaults to true
    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
                          // Defaults to true
    trackers: [
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.ccc.de:80',
    ],
                            // Allows to declare additional custom trackers to use
                            // Defaults to empty
      // storage: '.'  // Use a custom storage backend rather than the default disk-backed one

  };

  const engine = torrentStream(req.params.hash, options);
  let videoFile = '';
  let stream = '';
  let finalPathFile = '';
  engine.on('ready', () => {
    videoFile = engine.files.filter((file) => {
      const pathFile = path.extname(file.name);
      if (pathFile === '.mp4' || pathFile === '.mkv' || pathFile === '.avi') {
        finalPathFile = pathFile;
        return (file);
      }
    });
    const videoLength = videoFile[0].length;

    const range = req.headers.range;
    if (!range) {
      return res.sendStatus(416);
    }
    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const fileSize = videoLength;
    const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    let mime = videoFile[0].name.split('.');
    mime = _.last(mime);
    if (mime === 'avi') {
      mime = 'mp4';
      videoFile[0].path = videoFile[0].path.replace('.avi', '.mp4');
    }
    // const pathSerie = `./public/Media/${videoFile[0].path}`;
    if (finalPathFile !== '.avi') {
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': `video/${mime}`,
      });
      stream = videoFile[0].createReadStream({ start, end });
      return stream.pipe(res);
    }
    res.writeHead(200, {
      'Content-Length': chunksize,
      'Content-Type': `video/${mime}`,
    });
    stream = videoFile[0].createReadStream({ start, end });
    const myMp4 = fs.createWriteStream(`./public/Media/${videoFile[0].path}`);
    new Transcoder(stream)
        .videoCodec('h264')
        .audioCodec('aac')
        .format('mp4')
        .on('finish', () => {
          console.log('LA CONVERSION EST FINI');
        })
        .stream().pipe(res).pipe(myMp4);
							// .maxSize(640, 480)
							// .videoBitrate(800 * 1000)
							// .fps(25)
							// .sampleRate(44100)
							// .channels(2)
							// .audioBitrate(128 * 1000)
  },

  );
  engine.on('download', async () => {
    const download = engine.swarm.downloaded;
    console.log(Math.floor((engine.swarm.downloaded * 8) / 10000024), 'M');
  });
  engine.on('idle', () => {
    console.log('download Complete', videoFile[0].path);
    Serie.findOne({ imdb_code: req.params.serie_id })
      .then((serie) => {
        if (serie) {
          let episodeInfo = serie.content.filter((episode) => {
            console.log('tvdb', episode.tvdb_id);
            console.log('id', req.params.id);
            if (episode.tvdb_id === Number(req.params.id)) {
              console.log('je rentre dans le if jai trouve le match');
              return episode;
            }
          });
          const hash = req.params.hash;
          console.log('espisode info', episodeInfo);
          const path = { ...episodeInfo[0].path, [hash]: { path: videoFile[0].path } };
          episodeInfo = { ...episodeInfo[0], path };
          console.log('apre perers', episodeInfo);
          const index = _.indexOf(serie.content, _.find(serie.content, { tvdb_id: episodeInfo.tvdb_id }));
          serie.content.splice(index, 1, episodeInfo);
          serie.save((err) => { console.log(err); });
        }
      });
  });
};

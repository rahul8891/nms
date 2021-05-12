const express = require("express");
const NodeMediaServer = require('./node_media_server');
const bodyParser = require('body-parser');
const con = require("./database/connection");
const path = require("path");

let app = express();

var http = require('http');

//const routes = require("./routes");

// parse requests of content-type - application/json
app.use(bodyParser.json());

var Stream = require('./models/stream.model');

const config = {
  logType: 3,

  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
    webroot: './public/media',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
        vc: 'libx264',
      }
    ]
  },
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',    
    tasks:  []
    }
};

function getStreamsData() { 
  config['relay']['tasks'] = [];
  
  Stream.getAllStream(function(err, streams) {
    let data = new Array();

    if (!err) {    
      Object.keys(streams).forEach(function(element, keys) {     
        let data1 = new Array();

        data1['app'] = 'live';
        data1['mode'] = 'static';
        data1['vc'] = 'libx264';
        Object.keys(streams[element]).forEach(function(ele, key) {
          
          if (ele == 'name') { 
            data1['name'] = streams[element][ele];
          }
          
          if(ele == 'stream') {
            data1['edge'] = streams[element][ele];
          }

          data.push(data1);

        });

        config['relay']['tasks'] = data;
      });    
    }
    
    
  });
}

getStreamsData();

setInterval(getStreamsData);
console.log("Config = ", config );
//const path = 
app.set("view engine", "pug");

app.set("views", path.join(__dirname, "public/task"));

var todoList = require('./api/controllers/custom');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

let nms = new NodeMediaServer(config);
nms.run();

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  postStream(StreamPath);
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

function postStream(streamPath) {
  var streamName = streamPath.replace('/live/', '');
  var path = streamPath+'/index.m3u8';
  
  Stream.getStreamByName(streamName, function(err, res) {
    var streamID = res[0].id;
    
    Stream.updatePathById(streamID, path, function(err, res) {  
      console.log('streamID = ', res);
    });
  });
}
const express = require("express");
const NodeMediaServer = require('./node_media_server');
const bodyParser = require('body-parser');
const con = require("./database/connection");
const path = require("path");

let app = express();

var http = require('http');

//const routes = require("./routes");
var data = new Array();
// parse requests of content-type - application/json
app.use(bodyParser.json());

var Stream = require('./models/stream.model');


Stream.getAllStream(function(err, streams) {
    if (!err) {    
      Object.keys(streams).forEach(function(element, keys) {
        let data1 = new Array();
        
        data1['app'] = 'live';
        data1['mode'] = 'static';
        Object.keys(streams[element]).forEach(function(ele, key) {
          if(ele == 'name') {
            data1['name'] = streams[element][ele];
          }

          if(ele == 'stream') {
            data1['edge'] = streams[element][ele];
          }
        });

        data.push(data1);
      });    
    }
    console.log("val = ", data);
  });

// const streamData = pushData();


/*async function withTransaction() {  
  const streams = await con.query( 'SELECT * FROM streams' );
  // do something with someRows and otherRows

  Object.keys(streams).forEach(function(element, keys) {
    
    let data1 = new Array();
    
    data1['app'] = 'live';
    data1['mode'] = 'static';
    Object.keys(streams[element]).forEach(function(ele, key) {
      console.log("asdas = "+ JSON.stringify(streams[element][ele]));
      if(ele == 'name') {
        data1['name'] = streams[element][ele];
      }

      if(ele == 'stream') {
        data1['edge'] = streams[element][ele];
      }
    });
    
    data.push(data1);      
  });
  console.log("data = ", data);
  
  return data;
}

let streamData = withTransaction();

console.log("val = ", streamData);*/

const config = {
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
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  },
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: ,
  }
};

// console.log("config = ", config);

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
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});




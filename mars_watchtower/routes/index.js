exports.home = function(req, res) {
    res.render('index', {
        title: 'Mars Watchtower',
        description: 'An interactive webapp that provides real-time updates on Mars weather using Node.js.',
        author: '@heyits0livia @shoarc @joshua-s'
    });
};

exports.getJSON = function(options, onResult)
{
    var http = require('http'),
        https = require("https");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

exports.data = function(req, res) {
    var options = {
        host: 'marsweather.ingenology.com',
        port: 80,
        path: '/v1/latest/?format=json'
    };
    
    exports.getJSON(options, function(statusCode, result) {
        res.json(result);
    });
};

exports.historical = function(req, res) {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    var options = {
        host: 'marsweather.ingenology.com',
        port: 80,
        path: '/v1/archive/?page=' + query['page'] + '&format=json'
    };
    
    exports.getJSON(options, function(statusCode, result) {
        res.json(result);
    });
}

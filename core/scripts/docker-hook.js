var request = require('request')
var _uri = 'https://registry.hub.docker.com/u/onebytecode/krugozor-backend/trigger/9bd13498-d1c2-41c6-9520-c22df0177e30/'
console.log('Hoocking');
request({
    method: 'POST',
    uri: _uri,
    json: {
      "source_type":"Branch",
      "source_name":"develop"
    }

  },
  function (error, response, body) {
    if (error) {
      return console.error('upload failed:', error);
    }
    console.log('Hook successful!  Server responded with:', body);
  })
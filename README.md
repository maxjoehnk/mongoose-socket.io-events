# mongoose-socket.io-events

[![Greenkeeper badge](https://badges.greenkeeper.io/maxjoehnk/mongoose-socket.io-events.svg)](https://greenkeeper.io/)

This plugin emits socket.io events on mongoose hooks.
All events are sent on the post hook.

## Installation
```bash
npm install mongoose-socket.io-events --save
```

## Usage
```javascript
const mongoose = require('mongoose');
const events = require('mongoose-socket.io-events');

var schema = mongoose.Schema({
  name: String,
  ...
});

schema.use(events, {
  port: 8080
});
```

## Example Event
```javascript
mongoose:save
{
  id: '' //Document ID
}
```

## Options
| Option    | Type            | Default Value                                           | Description   |
|-----------|-----------------|---------------------------------------------------------|---------------|
| attach    | [HTTP Server](https://nodejs.org/api/http.html#http_class_http_server) | `undefined` | A HTTP Server to attach to |
| events    | Object          | `{save: true, init: true, remove: true, validate: false}` | Configures the events to broadcast on |
| namespace | String          | `/` | The Namespace to use |
| port      | Number          | `80` | The Port the socket.io Server should run on |
| prefix    | String          | `mongoose` | A Prefix value for all events |
| room      | String\|Boolean | `_id` | Either a document path which defines the Room the events shall be broadcasted to or false to broadcast to all sockets |
| server    | [Socket.IO Server](http://socket.io/docs/server-api/#server) | `undefined` | The Socket.io server instance to use |

## TODO:
 * configurable payload
 * fixed room name (not document specific)

"use strict";
var io = require('socket.io');
var _ = require('lodash');
function plugin(schema, options) {
    var server = _.get(options, 'server', io());
    var conn;
    var prefix = _.get(options, 'prefix', 'mongoose') + ':';
    var room = _.get(options, 'room', '_id');
    if (_.has(options, 'attach')) {
        server.attach(options.attach);
    }
    if (_.has(options, 'port')) {
        server.attach(options.port);
    }
    if (_.has(options, 'namespace')) {
        conn = server.of(options.namespace);
    }
    else {
        conn = server;
    }
    if (_.get(options, 'events.save', true)) {
        schema.post('save', emit('save'));
    }
    if (_.get(options, 'events.init', true)) {
        schema.post('init', emit('init'));
    }
    if (_.get(options, 'events.remove', true)) {
        schema.post('remove', emit('remove'));
    }
    if (_.get(options, 'events.validate', false)) {
        schema.post('validate', emit('validate'));
    }
    function emit(name) {
        return function (doc, next) {
            if (room) {
                conn.to(room).emit(prefix + name, { id: this._id });
            }
            else {
                conn.emit(prefix + name, { id: this._id });
            }
            next();
        };
    }
}
module.exports = plugin;

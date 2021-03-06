import * as io from 'socket.io';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';

function plugin(schema: mongoose.Schema, options:any) {
    let server = _.get(options, 'server', io());
    let conn;
    let prefix = _.get(options, 'prefix', 'mongoose') + ':';
    let room = _.get(options, 'room', '_id');

    if (_.has(options, 'attach')) {
        server.attach(options.attach);
    }

    if (_.has(options, 'port')) {
        server.attach(options.port);
    }

    if (_.has(options, 'namespace')) {
        conn = server.of(options.namespace);
    }else {
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

    function emit(name: string) {
        return function(next) {
            if (room) {
                conn.to(room).emit(prefix + name, {id: this._id});
            } else {
                conn.emit(prefix + name, {id: this._id});
            }
            next();
        }
    }
}

module.exports = plugin;

const chai          = require('chai');
const sinon         = require('sinon');
const sinonChai     = require('sinon-chai');

const Server        = require('socket.io');
const Client        = require('socket.io-client');
const http          = require('http');

chai.use(sinonChai);

var expect = chai.expect;

var plugin = require('../lib');

describe('mongoose-socket.io-events', function() {
    var schema;
    var options;
    var io;
    var server;
    var callbacks;

    beforeEach(function() {
        callbacks = {};
        server = http.createServer().listen(8090);
        schema = {
            post: function(name, cb) {
                callbacks[name] = cb.bind({
                    _id: 'stubid'
                });
            }
        };
        io = new Server(server);
        options = {
            attach: server,
            room: false
        };

    });

    afterEach(function() {
        server.close();
    });

    it('should call schema.post on default hooks', sinon.test(function() {
        this.spy(schema, 'post');
        plugin(schema, options);
        expect(schema.post).to.have.been.calledWith('save');
        expect(schema.post).to.have.been.calledWith('init');
        expect(schema.post).to.have.been.calledWith('remove');
        expect(schema.post).to.have.been.calledThrice;
    }));

    it('should call schema.post only on save hook', sinon.test(function() {
        this.spy(schema, 'post');
        options.events = {
            save: true,
            init: false,
            remove: false,
            validate: false
        };
        plugin(schema, options);
        expect(schema.post).to.have.been.calledWith('save');
        expect(schema.post).to.have.been.calledOnce;
    }));

    it('should call schema.post only on init hook', sinon.test(function() {
        this.spy(schema, 'post');
        options.events = {
            save: false,
            init: true,
            remove: false,
            validate: false
        };
        plugin(schema, options);
        expect(schema.post).to.have.been.calledWith('init');
        expect(schema.post).to.have.been.calledOnce;
    }));

    it('should call schema.post only on remove hook', sinon.test(function() {
        this.spy(schema, 'post');
        options.events = {
            save: false,
            init: false,
            remove: true,
            validate: false
        };
        plugin(schema, options);
        expect(schema.post).to.have.been.calledWith('remove');
        expect(schema.post).to.have.been.calledOnce;
    }));

    it('should call schema.post only on validate hook', sinon.test(function() {
        this.spy(schema, 'post');
        options.events = {
            save: false,
            init: false,
            remove: false,
            validate: true
        };
        plugin(schema, options);
        expect(schema.post).to.have.been.calledWith('validate');
        expect(schema.post).to.have.been.calledOnce;
    }));

    it('should emit a save event', function(done) {
        var connection = Client('http://localhost:8090');
        connection.on('connect', function() {
            connection.on('mongoose:save', function(payload) {
                expect(payload).to.deep.equal({id: 'stubid'});
                done();
            });
            callbacks.save(function() {});
        });
        plugin(schema, options);
    });

    it('should emit a init event', function(done) {
        var connection = Client('http://localhost:8090');
        connection.on('connect', function() {
            connection.on('mongoose:init', function(payload) {
                expect(payload).to.deep.equal({id: 'stubid'});
                done();
            });
            callbacks.init(function() {});
        });
        plugin(schema, options);
    });

    it('should emit a remove event', function(done) {
        var connection = Client('http://localhost:8090');
        connection.on('connect', function() {
            connection.on('mongoose:remove', function(payload) {
                expect(payload).to.deep.equal({id: 'stubid'});
                done();
            });
            callbacks.remove(function() {});
        });
        plugin(schema, options);
    });

    it('should emit a validate event', function(done) {
        var connection = Client('http://localhost:8090');
        connection.on('connect', function() {
            connection.on('mongoose:validate', function(payload) {
                expect(payload).to.deep.equal({id: 'stubid'});
                done();
            });
            callbacks.validate(function() {});
        });
        options.events = {
            validate: true
        };
        plugin(schema, options);
    });
});

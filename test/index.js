const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var expect = chai.expect;

var plugin = require('../lib');

describe('mongoose-socket.io-events', function() {
    var schema;

    beforeEach(function() {
        schema = {
            post: sinon.spy()
        };
    });

    it('should call schema.post on default hooks', function() {
        plugin(schema);
        expect(schema.post).to.have.been.calledWith('save');
        expect(schema.post).to.have.been.calledWith('init');
        expect(schema.post).to.have.been.calledWith('remove');
        expect(schema.post).to.have.been.calledThrice;
    });

    it('should call schema.post only on save hook', function() {
        plugin(schema, {
            events: {
                save: true,
                init: false,
                remove: false,
                validate: false
            }
        });
        expect(schema.post).to.have.been.calledWith('save');
        expect(schema.post).to.have.been.calledOnce;
    });

    it('should call schema.post only on init hook', function() {
        plugin(schema, {
            events: {
                save: false,
                init: true,
                remove: false,
                validate: false
            }
        });
        expect(schema.post).to.have.been.calledWith('init');
        expect(schema.post).to.have.been.calledOnce;
    });

    it('should call schema.post only on remove hook', function() {
        plugin(schema, {
            events: {
                save: false,
                init: false,
                remove: true,
                validate: false
            }
        });
        expect(schema.post).to.have.been.calledWith('remove');
        expect(schema.post).to.have.been.calledOnce;
    });

    it('should call schema.post only on validate hook', function() {
        plugin(schema, {
            events: {
                save: false,
                init: false,
                remove: false,
                validate: true
            }
        });
        expect(schema.post).to.have.been.calledWith('validate');
        expect(schema.post).to.have.been.calledOnce;
    });
});
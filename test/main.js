'use strict';
var should = require('should');
var gutil = require('gulp-util');
var path = require('path');
var hamlc = require('../');
var fs = require('fs');

require('mocha');

describe('gulp hamlc', function(){
  it('should render haml-coffee .hamlc to plain HTML per default', function(done){
    var hamlStream = hamlc();

    var fakeFile = new gutil.File({
      base: "test/src",
      cwd: "test/",
      path: "test/src/haml.hamlc",
      contents: fs.readFileSync('test/src/haml.hamlc')
    });

    hamlStream.once('data', function(newFile){
      should.exist(newFile);
      should.exist(newFile.path);
      should.exist(newFile.contents);
      String(newFile.contents + "\n").should.equal(fs.readFileSync('test/expected/haml.html', 'utf8'));
      done();
    });
    hamlStream.write(fakeFile);
  });

  describe('error handling', function() {
    it('should pass rendering errors', function(done) {
      var hamlStream = hamlc();

      var fakeFile = new gutil.File({
        base: "test/src",
        cwd: "test/",
        path: "test/src/broken.hamlc",
        contents: fs.readFileSync('test/src/broken.hamlc')
      });

      hamlStream.once('error', function(err) {
        err.message.should.containEql('Block level too deep');
        err.message.should.containEql('test/src/broken.hamlc');
        done();
      });

      hamlStream.write(fakeFile);
    });
  });

  describe('with `js` set to true', function() {
    it('should render haml-coffee .hamlc to JS', function(done){
      var hamlStream = hamlc({ js: true });

      var fakeFile = new gutil.File({
        base: "test/src",
        cwd: "test/",
        path: "test/src/haml.hamlc",
        contents: fs.readFileSync('test/src/haml.hamlc')
      });

      hamlStream.once('data', function(newFile){
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.contents);
        String(newFile.contents).should.equal(fs.readFileSync('test/expected/haml.js', 'utf8'));
        done();
      });
      hamlStream.write(fakeFile);
    });

    describe('with `placement` set to `amd`', function() {
      it('should render haml-coffee .hamlc to a valid AMD module', function(done){
        var hamlStream = hamlc({ js: true, placement: 'amd' });

        var fakeFile = new gutil.File({
          base: "test/src",
          cwd: "test/",
          path: "test/src/haml.hamlc",
          contents: fs.readFileSync('test/src/haml.hamlc')
        });

        hamlStream.once('data', function(newFile){
          should.exist(newFile);
          should.exist(newFile.path);
          should.exist(newFile.contents);
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/haml-amd.js', 'utf8'));
          done();
        });
        hamlStream.write(fakeFile);
      });
    });
  });
});

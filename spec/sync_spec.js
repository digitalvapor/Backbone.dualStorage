// Generated by CoffeeScript 1.9.3
(function() {
  var Collection, Model, backboneSync, dualSync, localStorage, localSync, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  backboneSync = window.backboneSync, localSync = window.localSync, dualSync = window.dualSync, localStorage = window.localStorage;

  ref = {}, Collection = ref.Collection, Model = ref.Model;

  describe('syncing offline changes when there are dirty or destroyed records', function() {
    this.timeout(100);
    beforeEach(function() {
      localStorage.clear();
      Model = (function(superClass) {
        extend(Model, superClass);

        function Model() {
          return Model.__super__.constructor.apply(this, arguments);
        }

        Model.prototype.idAttribute = '_id';

        Model.prototype.urlRoot = 'things/';

        return Model;

      })(Backbone.Model);
      return Collection = (function(superClass) {
        extend(Collection, superClass);

        function Collection() {
          return Collection.__super__.constructor.apply(this, arguments);
        }

        Collection.prototype.model = Model;

        Collection.prototype.url = Model.prototype.urlRoot;

        return Collection;

      })(Backbone.Collection);
    });
    beforeEach(function(done) {
      var allModified, allSaved;
      this.collection = new Collection([
        {
          _id: 1,
          name: 'change me'
        }, {
          _id: 2,
          name: 'delete me'
        }
      ]);
      allSaved = this.collection.map(function(model) {
        var saved;
        saved = $.Deferred();
        model.save(null, {
          success: function() {
            return saved.resolve();
          }
        });
        return saved;
      });
      allModified = $.when.apply($, allSaved).then((function(_this) {
        return function() {
          var destroyed, dirtied;
          dirtied = $.Deferred();
          _this.collection.get(1).save('name', 'dirty me', {
            errorStatus: 0,
            success: function() {
              return dirtied.resolve();
            }
          });
          destroyed = $.Deferred();
          _this.collection.get(2).destroy({
            errorStatus: 0,
            success: function() {
              return destroyed.resolve();
            }
          });
          return $.when(dirtied, destroyed);
        };
      })(this));
      return allModified.done(function() {
        return done();
      });
    });
    describe('Model.fetch', function() {
      return it('reads models in dirty collections from local storage until a successful sync', function(done) {
        var fetched, model;
        fetched = $.Deferred();
        model = new Model({
          _id: 1
        });
        model.fetch({
          serverResponse: {
            _id: 1,
            name: 'this response is never used'
          },
          success: function() {
            return fetched.resolve();
          }
        });
        return fetched.done(function() {
          expect(model.get('name')).to.equal('dirty me');
          return done();
        });
      });
    });
    describe('Collection.fetch', function() {
      return it('excludes destroyed models when working locally before a sync', function(done) {
        var collection, fetched;
        fetched = $.Deferred();
        collection = new Collection;
        collection.fetch({
          serverResponse: [
            {
              _id: 3,
              name: 'this response is never used'
            }
          ],
          success: function() {
            return fetched.resolve();
          }
        });
        return fetched.done(function() {
          expect(collection.size()).to.equal(1);
          expect(collection.first().get('name')).to.equal('dirty me');
          return done();
        });
      });
    });
    describe('Collection.dirtyModels', function() {
      return it('returns an array of models that have been created or updated while offline', function() {
        return expect(this.collection.dirtyModels()).to.eql([this.collection.get(1)]);
      });
    });
    describe('Collection.destroyedModelIds', function() {
      return it('returns an array of ids for models that have been destroyed while offline', function() {
        return expect(this.collection.destroyedModelIds()).to.eql(['2']);
      });
    });
    describe('Collection.syncDirty', function() {
      return it('attempts to save online all records that were created/updated while offline', function() {
        backboneSync.reset();
        this.collection.syncDirty({
          async: false
        });
        expect(backboneSync.callCount).to.equal(1);
        return expect(this.collection.dirtyModels()).to.eql([]);
      });
    });
    describe('Collection.syncDestroyed', function() {
      return it('attempts to destroy online all records that were destroyed while offline', function() {
        backboneSync.reset();
        this.collection.syncDestroyed({
          async: false
        });
        expect(backboneSync.callCount).to.equal(1);
        return expect(this.collection.destroyedModelIds()).to.eql([]);
      });
    });
    describe('Collection.syncDirtyAndDestroyed', function() {
      return it('attempts to sync online all records that were modified while offline', function() {
        backboneSync.reset();
        this.collection.syncDirtyAndDestroyed({
          async: false
        });
        expect(backboneSync.callCount).to.equal(2);
        expect(this.collection.dirtyModels()).to.eql([]);
        return expect(this.collection.destroyedModelIds()).to.eql([]);
      });
    });
    describe('Model.destroy', function() {
      return it('does not mark models for deletion that were created and destroyed offline', function(done) {
        var destroyed, model;
        model = new Model({
          name: 'transient'
        });
        this.collection.add(model);
        model.save(null, {
          errorStatus: 0
        });
        destroyed = $.Deferred();
        model.destroy({
          errorStatus: 0,
          success: function() {
            return destroyed.resolve();
          }
        });
        return destroyed.done((function(_this) {
          return function() {
            backboneSync.reset();
            _this.collection.syncDestroyed();
            expect(backboneSync.callCount).to.equal(1);
            expect(backboneSync.firstCall.args[1].id).not.to.equal(model.id);
            return done();
          };
        })(this));
      });
    });
    return describe('Model.id', function() {
      return it('for new records with a temporary id is replaced by the id returned by the server', function(done) {
        var model, saved;
        saved = $.Deferred();
        model = new Model;
        this.collection.add(model);
        model.save('name', 'created while offline', {
          errorStatus: 0,
          success: function() {
            return saved.resolve();
          }
        });
        return saved.done((function(_this) {
          return function() {
            expect(model.id.length).to.equal(36);
            backboneSync.reset();
            _this.collection.syncDirty();
            expect(backboneSync.callCount).to.equal(2);
            expect(backboneSync.lastCall.args[0]).to.equal('create');
            expect(backboneSync.lastCall.args[1].id).to.be["null"];
            expect(backboneSync.lastCall.args[1].get('_id')).to.be["null"];
            return done();
          };
        })(this));
      });
    });
  });

}).call(this);

//# sourceMappingURL=sync_spec.js.map

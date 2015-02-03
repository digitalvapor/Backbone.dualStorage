// Generated by CoffeeScript 1.9.0
(function() {
  var Store, backboneSync, localsync;

  Store = window.Store, backboneSync = window.backboneSync, localsync = window.localsync;

  describe('bugs, that once fixed, should be moved to the proper spec file and modified to test their inverse', function() {
    it('fails to throw an error when no storeName is provided to the Store constructor, even though this will cause problems later. The root cause is that the model has no url set; the error should reflect this.', function() {
      var createNamelessStore;
      createNamelessStore = function() {
        return new Store;
      };
      return expect(createNamelessStore).not.toThrow();
    });
    return describe('idAttribute being ignored', function() {
      var Role, RoleCollection, collection, model, setup, _ref;
      _ref = {}, Role = _ref.Role, RoleCollection = _ref.RoleCollection, collection = _ref.collection, model = _ref.model;
      beforeEach(function() {
        backboneSync.calls = [];
        localsync('clear', {}, {
          success: (function() {}),
          error: (function() {})
        });
        collection = new Backbone.Collection;
        collection.url = 'eyes/';
        model = new Backbone.Model;
        model.collection = collection;
        return model.set({
          id: 1
        });
      });
      return setup = function(useIdAttribute) {
        Role = Backbone.Model.extend({
          idAttribute: useIdAttribute ? '_id' : void 0,
          urlRoot: "/roles"
        });
        return RoleCollection = Backbone.Collection.extend({
          model: Role,
          url: "/roles"
        });
      };
    });
  });

}).call(this);

//# sourceMappingURL=bugs_spec.js.map

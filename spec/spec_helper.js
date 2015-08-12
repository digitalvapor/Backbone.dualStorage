// Generated by CoffeeScript 1.9.3
(function() {
  sinon.stub(window.Backbone, 'sync', function(method, model, options) {
    var callback, callbackWithVersionedArgs, resp, status, xhr;
    model.updatedByRemoteSync = true;
    resp = options.serverResponse || model.toJSON();
    status = 200;
    callback = options.success;
    xhr = {
      status: status,
      response: resp
    };
    if (typeof options.errorStatus === 'number') {
      resp.status = status = options.errorStatus;
      callback = options.error;
    }
    callbackWithVersionedArgs = function() {
      if (Backbone.VERSION === '0.9.10') {
        return callback(model, resp, options);
      } else if (Backbone.VERSION[0] === '0') {
        return callback(resp, status, xhr);
      } else {
        options.xhr = xhr;
        return callback(resp);
      }
    };
    if (options.async === false) {
      callbackWithVersionedArgs();
    } else {
      setTimeout(callbackWithVersionedArgs, 0);
    }
    return xhr;
  });

}).call(this);

//# sourceMappingURL=spec_helper.js.map

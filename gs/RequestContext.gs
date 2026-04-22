var REQUEST_ACCESS_CONTEXT = null;

const RequestContext = {
  setAccessContext: function (accessContext) {
    REQUEST_ACCESS_CONTEXT = accessContext;
  },

  getAccessContext: function () {
    return REQUEST_ACCESS_CONTEXT;
  },

  clear: function () {
    REQUEST_ACCESS_CONTEXT = null;
  }
};

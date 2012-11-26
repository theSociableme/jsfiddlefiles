(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    _this = this;

  MyApp.Models.BaseClass = (function(_super) {

    __extends(BaseClass, _super);

    function BaseClass() {
      BaseClass.__super__.constructor.apply(this, arguments);
    }

    return BaseClass;

  })(Backbone.Model);

  ({
    Linked: function() {
      return _this._linked;
    },
    Link: function(form) {
      if (_this._linked === false) {
        $(form).backboneLink(_this, {
          'prefixed': true
        });
        return _this._linked = true;
      } else {
        return $(form).backbonePopulate(_this, {
          'prefixed': true
        });
      }
    },
    Dirty: function() {
      this.collection.Dirty();
      return this._dirty = true;
    },
    Clean: function() {
      return this._dirty = false;
    },
    isDirty: function() {
      return _this._dirty;
    }
  });

}).call(this);


var json2backbonemodel = {
  // nested JSON is passed in a nested Backbone.Model is returned
  modelObjectBuilder: function(data) {
    //The model object that gets filled
    var obj = new (Backbone.Model.extend({}))();
    //start traversing through the JSON
    this.traverse(data,obj);
    //return the built Backbone.Model
    return obj;
  },
  //traverses through all properties within a nested json and built Backbone.Models from it.
  traverse: function(data,obj) {
    var kv = {};
    //Iterate over each property.
    _.each(data,function(v,k) {
      //if the current property is a simple value, just set it.
      if(!this.isPlainObject(v) && !_.isArray(v)) {
        kv[k] = v;
        obj.set(kv);
      }
      //if the current property is an object itself, create a new model, set it to the parent and traverse through it.
      else if(this.isPlainObject(v)) {
        kv[k] = new (Backbone.Model.extend({}))(v);
        obj.set(kv);
        this.traverse(v,obj.get(k));
      }
      //if the object is an array an the first element is an object, create a collection for that, add it to the parent and traverse through each object of the array.
      else if(_.isArray(v) && this.isPlainObject(v[0])) {
        kv[k] = new (Backbone.Collection.extend({}))();
        _.each(v,function(obj) {
          kv[k].add(obj);
          this.traverse(obj,kv[k].at(kv[k].length-1));
        });
        obj.set(kv);
      }
      //if the object is a array with sinmple values, just set them to the model object.
      else if(_.isArray(v) && !_.isArray(v[0]) && !this.isPlainObject(v[0])) {
        kv[k] = v;
        obj.set(kv);
      }
    });
  },
  //Borrowed from jquery to have no new deps
  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || this.type(obj) !== "object" || obj.nodeType || this.isWindow( obj ) ) {
      return false;
    }

    // Not own constructor property must be Object
    if ( obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
  },
  type: function( obj ) {
    this.builtclass2type();
    return obj == null ?
      String( obj ) :
      this.class2type[ toString.call(obj) ] || "object";
  },
  isWindow: function( obj ) {
    return obj && typeof obj === "object" && "setInterval" in obj;
  },
  builtclass2type: _.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(name) {
    if(_.isUndefinde(this.class2type)) this.class2type = [];
    this.class2type[ "[object " + name + "]" ] = name.toLowerCase();
  })
};
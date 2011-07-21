# json2backbonemodel.js

## What is this for?
It's simple, it takes a JSON (nested or flat) goes through it an builts an Backbone.Model from it.
Arrays of objects are converted to collections.


## Demo
The use of json2backbonemodel.js is quite simple:
    json2backbonemodel.modelObjectBuilder(yourJSONdata);
    => Backbone.Model instance filled with the data from the JSON.


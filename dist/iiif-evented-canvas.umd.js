(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["iiifEventedCanvas"] = factory();
	else
		root["iiifEventedCanvas"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var ImageResource = function (config) {
  'use strict';

  this.id = config.id;
  this.label = config.label || "No Label";
  this.needed = config.needed || false;
  this.visible = config.visible || false;
  this.clipRegion = config.clipRegion;
  this.opacity = config.opacity || 1;
  this.bounds = config.bounds || { x: 0, y: 0, width: 1, height: 1 };
  this.zIndex = config.zIndex;
  this.tileSource = config.tileSource;
  this.thumbUrl = config.thumbUrl;
  this.dynamic = config.dynamic || false;
  this.imageType = config.imageType || "main"; // can be 'main', 'alternate', 'detail' or 'thumbnail'
  this.status = 'initialized'; // can be 'requested', 'pending','shown', or 'failed'
  this.parent = config.parent;
  this.dispatcher = config.parent.dispatcher;
};

ImageResource.prototype = {
  show: function (timeout) {
    if (!this.needed) {
      this.setNeeded(true);
    }
    this.visible = true;
    this.dispatcher.emit('image-show', this);
  },

  hide: function (timeout) {
    this.visible = false;
    this.dispatcher.emit('image-hide', this);
  },

  getVisible: function () {
    return this.visible;
  },

  setNeeded: function (needed) {
    this.needed = needed;
    if (needed) {
      this.dispatcher.emit('image-needed', this);
    }
  },

  getThumbnailNeeded: function () {
    return this.needed;
  },

  getFullNeeded: function () {
    return this.needed;
  },

  setOpacity: function (opacity) {
    this.opacity = opacity;
    if (this.visible) {
      this.dispatcher.emit('image-opacity-updated', this);
    }
  },

  getOpacity: function () {
    return this.opacity;
  },

  getImageType: function () {
    return this.imageType;
  },

  getLocalBounds: function () {
    // Eexpressed as 0-1 factor of parent.
    //
    // For example: { x: 0.2, y: 0.8, width: 0.34, height: 0.12 }
    // These are intended to be multiplied by the parent canvas
    // dimensions to obtain global coordinates.
    return this.bounds;
  },

  getGlobalBounds: function () {
    var self = this;
    return {
      x: this.parent.bounds.x + this.parent.bounds.width * self.bounds.x,
      y: this.parent.bounds.y + this.parent.bounds.width * self.bounds.y,
      width: this.parent.bounds.width * self.bounds.width,
      height: this.parent.bounds.height * self.bounds.height
    };
  },

  containsGlobalPoint: function (point) {
    var bounds = this.getGlobalBounds();

    var rectRight = bounds.x + bounds.width;
    var rectBottom = bounds.y + bounds.height;

    return bounds.x <= point.x && rectRight >= point.x && bounds.y <= point.y && rectBottom >= point.y;
  },

  setStatus: function (status) {
    this.status = status;
    this.dispatcher.emit('image-status-updated', this);
  },

  getStatus: function () {
    return this.status;
  },

  remove: function () {
    this.dispatcher.emit('image-removed', this);
  },

  moveToIndex: function (index) {
    this.parent.moveToIndex(this, index);
  },

  moveToBottom: function () {
    this.parent.moveToBottom(this);
  },

  moveToTop: function (image) {
    this.parent.moveToTop(this);
  },

  insertAboveIndex: function (image, index) {
    this.parent.insertAboveIndex(this, index);
  },

  insertBelowIndex: function (image, index) {
    this.parent.insertBelowIndex(this, index);
  },

  insertAboveResource: function (image, resource) {
    this.parent.insertAboveResource(this, resource);
  },

  insertBelowResource: function (image, resource) {
    this.parent.insertBelowResource(this, resource);
  },

  moveUpOne: function (image) {
    this.parent.moveUpOne(this);
  },

  moveDownOne: function (image) {
    this.parent.moveDownOne(this);
  }

};

module.exports = ImageResource;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ImageResource = __webpack_require__(0);
var imageFormatError = "Unsupported image format for LegacyTileSource.";

var getResourceFormat = function (mimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/jpg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    default:
      throw imageFormatError;
  }
};

var getThumbUrl = function (resource, width) {

  var serviceVersion;
  if (resource['@context'] == "http://iiif.io/api/image/2/context.json") {
    serviceVersion = "2.0";
  } else {
    serviceVersion = "1.1";
  }

  var buildResourceSize = function () {
    return "/full/" + width + ",/";
  };

  var getTileBasename = function () {
    if (serviceVersion === '2.0') return 'default';
    return 'native';
  };

  var id = resource['@id'];
  if (!id.toLowerCase().match(/^.*\.(png|jpg|jpeg|gif)$/)) {
    // it is still a service URL
    var format = getResourceFormat(resource.format);
    return resource.service['@id'] + buildResourceSize() + '0/' + getTileBasename() + '.' + format;
  } else {
    // we still don't want the full size
    return id.replace("/full/full/", buildResourceSize());
  }
};

var getThumbLevel = function (resource, width, height) {
  var widthParam = 200,
      scaleFactor = widthParam / width,
      scaledWidth = width * scaleFactor,
      scaledHeight = height * scaleFactor;

  if (resource.default) {
    // resources with a default field are not actually
    // images, but contain more images. Recurse to retrieve.
    return getThumbLevel(resource.default, scaledWidth, scaledHeight);
  }

  return {
    url: getThumbUrl(resource, scaledWidth),
    height: height,
    width: width
  };
};

var makeThumbnailConfig = function (resource, parent) {
  var bounds = parent.getBounds();

  return {
    tileSource: {
      type: 'legacy-image-pyramid',
      levels: [getThumbLevel(resource, bounds.width, bounds.height)]
    },
    parent: parent,
    imageType: 'thumbnail',
    dynamic: false,
    zIndex: 9999
  };
};

var ThumbnailFactory = function (canvas, parent) {
  // The canvas has a thumbnail object.
  if (canvas.thumbnail) {

    return new ImageResource(makeThumbnailConfig(canvas.thumbnail, parent));
  }

  // If the canvas has no thumbnail object, we try to fall back to using an image from it.
  // If the canvas has no images and no thumbnail, we can't do anything, so we don't bother.
  if (canvas.images) {
    try {
      var config = makeThumbnailConfig(canvas.images[0].resource, parent);
      return new ImageResource(config);
    } catch (error) {
      // If we can't use LegacyTileSource to build the thumbnail, don't build a thumbnail.
      if (error == imageFormatError) {
        return 'A thumbnail cannot be built for this object';
      } else {
        throw error;
      }
    }
  }
  return undefined;
};

ThumbnailFactory.getThumbUrl = getThumbUrl;

module.exports = ThumbnailFactory;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var ImageResource = __webpack_require__(0);
var ImageResourceFactory = __webpack_require__(3);
var ThumbnailFactory = __webpack_require__(1);

var CanvasObject = function (config) {
  'use strict';

  var self = this;

  this.dispatcher = config.dispatcher;
  this.id = config.canvas['@id'];
  this.label = config.canvas.label;
  this.canvas = config.canvas;
  this.clipRegion = config.clipRegion;
  this.opacity = config.opacity || 1;
  this.index = config.index;
  this.bounds = {
    x: config.x || 0,
    y: config.y || 0,
    height: config.canvas.height,
    width: config.canvas.width
  };
  this.viewingHint = config.canvas.viewingHint;
  this.images = [];

  if (config.canvas.images) {
    config.canvas.images.forEach(function (image) {
      var imageResources = ImageResourceFactory(image, self);
      if (imageResources) {
        self.images = self.images.concat(imageResources);
      }
    });
  }

  this.thumbnailResource = ThumbnailFactory(this.canvas, self);
};

CanvasObject.prototype = {
  // Assumes that the point parameter is already in viewport coordinates.
  containsPoint: function (point) {
    var rectRight = this.bounds.x + this.bounds.width;
    var rectBottom = this.bounds.y + this.bounds.height;

    return this.bounds.x <= point.x && rectRight >= point.x && this.bounds.y <= point.y && rectBottom >= point.y;
  },

  getVisibleImages: function () {
    return this.images.filter(function (image) {
      return image.visible === true;
    });
  },

  getAlternateImages: function () {
    return this.images.filter(function (image) {
      return image.imageType === "alternate";
    });
  },

  getMainImages: function () {
    return this.images.filter(function (image) {
      return image.imageType === "main";
    });
  },

  getImageById: function (id) {
    return this.images.filter(function (image) {
      return image.id === id;
    })[0];
  },

  getThumbnailResource: function () {
    return this.thumbnailResource;
  },

  setBounds: function (x, y, width, height) {
    var self = this;
    this.bounds.x = x;
    this.bounds.y = y;
    this.bounds.width = width;
    this.bounds.height = height;

    self.dispatcher.emit('canvas-position-updated', self);
  },

  getBounds: function () {
    var self = this;
    return {
      x: this.bounds.x,
      y: this.bounds.y,
      width: this.bounds.width,
      height: this.bounds.height,
      getTopLeft: function () {
        return {
          x: self.bounds.x,
          y: self.bounds.y
        };
      }
    };
  },

  canvasToWorldCoordinates: function (canvasRegion) {
    var self = this,
        scaleFactor = self.bounds.width / self.canvas.width;

    return {
      x: self.bounds.x + canvasRegion.x * scaleFactor,
      y: self.bounds.y + canvasRegion.y * scaleFactor,
      width: canvasRegion.width * scaleFactor,
      height: canvasRegion.height * scaleFactor
    };
  },

  getAspectRatio: function () {
    return this.bounds.width / this.bounds.height;
  },

  getThumbnailNeeded: function () {
    return this.thumbnailNeeded;
  },

  setThumbnailNeeded: function (needed) {
    this.thumbnailNeeded = needed;
    if (needed) {
      this.thumbnailResource.setNeeded(true);
      this.dispatcher.emit('canvas-thumbnail-needed', this);
    }
  },

  show: function (timeout) {
    var self = this;

    if (!this.needed) {
      this.setNeeded(true);
    }

    this.visible = true;
    this.getMainImages().forEach(function (image) {

      image.show();

      function removeThumb() {
        if (image.getStatus() === 'drawn') {
          self.thumbnailResource.remove();
        }
      }

      self.dispatcher.on('image-status-updated', removeThumb);
    });

    this.dispatcher.emit('canvas-show', this);
  },

  hide: function (timeout) {
    this.visible = false;
    this.dispatcher.emit('canvas-hide', this);
  },

  getVisible: function () {
    return this.visible;
  },

  setNeeded: function (needed) {
    this.needed = needed;
    if (needed) {
      this.dispatcher.emit('canvas-needed', this);
    }
  },

  getNeeded: function () {
    return this.needed;
  },

  getOpacity: function () {
    return this.opacity;
  },

  setOpacity: function (opacity) {
    this.opacity = opacity;
    this.images.forEach(function (image) {
      image.updateOpacity();
    });
  },

  _floatImagesToBottom: function () {
    var i = 0;
    for (i; i < this.images; i++) {
      this.images[i].zIndex = i;
      this.images[i].updateItemIndex();
    }
  },

  moveToIndex: function (image, index) {
    this._floatImagesToBottom();
    var oldIndex = this.images.indexOf(image);

    if (index === oldIndex || oldIndex === -1) {
      // Index either is invalid or is the same
      // as the previous index, requiring no change.
      return;
    }
    if (index >= this.images.length) {
      throw new Error("Index bigger than number of images.");
    }

    image.zIndex = index;
    this.images.splice(oldIndex, 1);
    this.images.splice(index, 0, image);
    image.updateItemIndex();
  },

  moveToBottom: function (image) {
    this.moveToIndex(image, 0);
  },

  moveToTop: function (image) {
    this.moveToIndex(image, this.images.length - 1);
  },

  insertAboveIndex: function (image, index) {
    if (index !== 0) {
      this.moveToIndex(image, index - 1);
    }
  },

  insertBelowIndex: function (image, index) {
    if (index < this.images.length - 1) {
      this.moveToIndex(image, index + 1);
    }
  },

  insertAboveResource: function (image, resource) {
    this.insertAboveIndex(image, this.images.indexOf(resource));
  },

  insertBelowResource: function (image, resource) {
    this.insertBelowIndex(image, this.images.indexOf(resource));
  },

  moveUpOne: function (image) {
    this.insertAboveResource(image, image);
  },

  moveDownOne: function (image) {
    this.insertBelowResource(image, image);
  }
};

module.exports = CanvasObject;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var ImageResource = __webpack_require__(0);
var ThumbnailFactory = __webpack_require__(1);

var _getRectFromStringArray = function (arr) {
  var rectArray = arr.map(function (number) {
    return parseInt(number, 10);
  });

  return {
    x: rectArray[0],
    y: rectArray[1],
    width: rectArray[2],
    height: rectArray[3]
  };
};

var _getSegmentFromUrl = function (url) {
  var urlParts = url.split('#');
  var segment = null;
  if (urlParts.length > 1) {
    // the url has a segment specified
    var bounds = urlParts[1].split('=');
    segment = _getRectFromStringArray(bounds[1].split(','));
  }
  return segment;
};

var _buildImageConfig = function (resource) {
  if (resource == 'rdf:nil') {
    return; // You can have a choice of "no image"; this is what it looks like.
  }

  if (resource.full) {
    return _buildImageConfig(resource.full);
  }

  // determine whether the resource is dynamic
  var _isDynamic = function () {
    return !!resource.service && (resource.service['@context'] == "http://iiif.io/api/image/2/context.json" || resource.service['@context'] == "https://iiif.io/api/image/2/context.json" || resource.service['@context'] == "http://iiif.io/api/image/1/context.json" || resource.service['@context'] == "https://iiif.io/api/image/1/context.json" || resource.service['@context'] == "http://library.stanford.edu/iiif/image-api/1.1/context.json"); // &&
    // !resource.service.width); Let it work anyway, just ignore.
  };

  var isDynamic = _isDynamic();

  var idObj = resource;
  if (isDynamic) {
    idObj = resource.service;
  }
  var id = idObj['@id'];

  var _getImageTilesource = function () {
    if (isDynamic) {
      return id.replace(/\/+$/, "") + '/info.json'; // remove trailing slash
    } else {
      return {
        type: 'image',
        url: id
      };
    }
  };

  return {
    // the ID is to use in the DOM, so remove special characters. The URL may not be unique, so add a salt.
    id: id.replace(/[^a-z0-9-_]+/gi, "") + Math.floor(Math.random() * 1000),
    label: resource.label,
    tileSource: _getImageTilesource(),
    clipRegion: _getSegmentFromUrl(id),
    dynamic: isDynamic,
    thumbUrl: ThumbnailFactory.getThumbUrl(resource, 200)
  };
};

var _buildChoiceConfigs = function (resource) {

  var _buildImageChoice = function (item, type) {
    var config = _buildImageConfig(item);
    if (config) {
      config.imageType = type;
    }
    return config;
  };
  var configs = [];
  var choice = _buildImageChoice(resource.default, 'main');
  if (choice) {
    configs.push(choice);
  }

  resource.item.forEach(function (item) {
    var choice = _buildImageChoice(item, 'alternate');
    if (choice) {
      configs.push(choice);
    }
  });
  return configs;
};

var ImageResourceFactory = function (image, parent) {
  var resourceType = image.resource['@type']; // can be oa:Choice, oa:SpecificResource, or dctypes:Image


  var _makeCoordinatesPercentages = function (bounds) {
    // We want to deal with these in terms of percentages relative to the canvas.
    return {
      x: bounds.x / parent.bounds.width,
      y: bounds.y / parent.bounds.width,
      width: bounds.width / parent.bounds.width,
      height: bounds.height / parent.bounds.height
    };
  };

  var _makeImageFromConfig = function (config) {
    if (config) {
      config.parent = parent;
      var bounds = _getSegmentFromUrl(image.on);
      if (bounds) {
        config.imageType = 'detail';
        config.bounds = _makeCoordinatesPercentages(bounds);
      }
      return new ImageResource(config);
    }
  };

  switch (resourceType) {
    case 'dctypes:Image':
    case 'dcTypes:Image':
    case 'dcterms:Image':
    case 'dcTerms:Image':
      var config = _buildImageConfig(image.resource, parent);
      return _makeImageFromConfig(config);
    case 'oa:Choice':
      var configs = _buildChoiceConfigs(image.resource);
      return configs.map(function (config) {
        return _makeImageFromConfig(config);
      });
    case 'oa:SpecificResource':
      var resource = image.resource;
      config = _buildImageConfig(resource);

      if (config && resource.selector && resource.selector.region) {
        var clipArray = resource.selector.region.split(',');
        config.clipRegion = _getRectFromStringArray(clipArray);
      }
      return _makeImageFromConfig(config);
    default:
      throw new Error("Cannot create an image from type " + resourceType);
  }
};

module.exports = ImageResourceFactory;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var CanvasObject = __webpack_require__(2);

module.exports = CanvasObject;

/***/ })
/******/ ]);
});
var __extends = (this && this.__extends) || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Vector = etch.primitives.Vector;

var MainScene = (function(_super){
  __extends(MainScene, _super);

  function MainScene() {
    _super.apply(this, arguments);
  }

  return MainScene;
}(etch.drawing.Stage));

var Mover = (function(_super){
  __extends(Mover, _super);

  function Mover() {
    _super.apply(this, arguments);
  }

  Mover.prototype.init = function(drawTo, drawFrom) {
    _super.prototype.init.call(this, drawTo, drawFrom);
  };

  Mover.prototype.setup = function() {
    // this.width = 30;
    // this.height = 30;

    this.position = new Vector(0,0).toPoint();
    this.velocity = new Vector(0,0);
    this.type = 'canvas';
    this.selected = false;
  };

  Mover.prototype.update = function() {
    _super.prototype.update.call(this);

    var p = this.position.toVector();

    var deltaVelocity = new Vector(this.velocity.x * this.deltaTime, this.velocity.y * this.deltaTime);

    p.add(deltaVelocity);

    // if (p.x > this.canvasWidth) {
    //   p.x = 0;
    // } else if (p.x < 0) {
    //   p.x = this.canvasWidth;
    // } if (p.y > this.canvasHeight) {
    //   p.y = 0;
    // } else if (p.y < 0) {
    //   p.y = this.canvasHeight;
    // }

    this.position = p.toPoint();
  };

  Mover.prototype.draw = function() {
    _super.prototype.draw.call(this);
    // if this is the first frame of the mover, and it has a display cache that hasn't been drawn to yet.
    // draw to the display cache.
    if (this.isFirstFrame() && this.drawFrom && !this.drawFrom.isCached) {
      // draw to cache
      this.drawFrom.width = this.width;
      this.drawFrom.height = this.height;
      this.drawToCtx(this.drawFrom.ctx);
      this.drawFrom.isCached = true; // no other movers will draw to the cache
    } if (this.drawFrom) {
      // draw from cache
      this.ctx.drawImage(this.drawFrom.htmlElement, this.position.x, this.position.y);
    } else {
      // draw each frame
      this.drawToCtx(this.ctx);
    }
  };

  Mover.prototype.drawToCtx = function(ctx) {
    ctx.moveTo(this.position.x, this.position.y);
    ctx.fillStyle = this.selected ? 'deepPink' : 'cyan';
    if (this.type === 'canvas') {
      ctx.fillStyle = this.selected ? 'deepPink' : 'cyan';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.position.x + this.width, this.position.y);
      ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
      ctx.lineTo(this.position.x, this.position.y + this.height);
      ctx.closePath();
      ctx.fill();

      ctx.strokeRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );

      var centerPoint = {
        x:this.position.x + this.width/2,
        y:this.position.y + this.height/2
      };

      // Add nunmbers.
      ctx.font = "12px serif";
      ctx.textBaseline = 'middle';
      ctx.textAlign = "center";
      ctx.strokeText(this.index, centerPoint.x, centerPoint.y);
    }

    if (this.type === 'frame') {
      ctx.strokeStyle = '#d92fd9';
      ctx.lineWidth = 1;

      ctx.strokeRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }

    if (this.type === 'padding') {
      ctx.fillStyle = 'darkgray';

      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.position.x + this.width, this.position.y);
      ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
      ctx.lineTo(this.position.x, this.position.y + this.height);
      ctx.closePath();
      ctx.fill();
    }

    if (this.type === 'viewport') {
      ctx.strokeStyle = 'orangered';
      ctx.lineWidth = 2;

      ctx.strokeRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  };

  return Mover;

}(etch.drawing.DisplayObject));

$(function(){
  var manifest = $.getJSON('http://dms-data.stanford.edu/data/manifests/BnF/jr903ng8662/manifest.json', function(json) {
    // framePaddingDiagram = immediateModeViewer({
    //   canvases: json.sequences[0].canvases,
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    //   viewingDirection: 'left-to-right',
    //   viewingMode: 'individuals',
    //   canvasHeight: 200,
    //   canvasWidth: 200,
    //   selectedCanvas: json.sequences[0].canvases[20]['@id'],
    //   framePadding: {
    //     top: 10,
    //     bottom: 40,
    //     left: 10,
    //     right: 10
    //   },
    //   viewportPadding: {
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0
    //   },
    //   minimumImageGap: 5, // precent of viewport
    //   facingCanvasPadding: 0.1 // precent of viewport
    // }, 'frame-padding-diagram');

    var leftToRightIndividualsLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'left-to-right',
      viewingMode: 'individuals',
      canvasHeight: 200,
      canvasWidth: 200,
      selectedCanvas: json.sequences[0].canvases[20]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      viewportPadding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('left-right-individuals-overview',
                        leftToRightIndividualsLayouts.overview());
    renderLayoutDiagram('left-right-individuals-intermediate',
                        leftToRightIndividualsLayouts.intermediate());
    renderLayoutDiagram('left-right-individuals-detail',
                        leftToRightIndividualsLayouts.detail());


    var leftToRightPagedLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'left-to-right',
      viewingMode: 'paged',
      canvasHeight: 200,
      canvasWidth: 200,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      viewportPadding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('left-right-paged-overview',
                        leftToRightPagedLayouts.overview());
    renderLayoutDiagram('left-right-paged-intermediate',
                        leftToRightPagedLayouts.intermediate());
    renderLayoutDiagram('left-right-paged-detail',
                        leftToRightPagedLayouts.detail());

    var leftToRightContinuousLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'left-to-right',
      viewingMode: 'continuous',
      canvasHeight: 200,
      canvasWidth: 200,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      viewportPadding: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('left-right-continuous-overview',
                        leftToRightContinuousLayouts.overview());
    renderLayoutDiagram('left-right-continuous-intermediate',
                        leftToRightContinuousLayouts.intermediate());
    renderLayoutDiagram('left-right-continuous-detail',
                        leftToRightContinuousLayouts.detail());

    var rightToLeftIndividualsLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'right-to-left',
      viewingMode: 'individuals',
      canvasHeight: 200,
      canvasWidth: 200,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      viewportPadding: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('right-left-individuals-overview',
                        rightToLeftIndividualsLayouts.overview());
    renderLayoutDiagram('right-left-individuals-intermediate',
                        rightToLeftIndividualsLayouts.intermediate());
    renderLayoutDiagram('right-left-individuals-detail',
                        rightToLeftIndividualsLayouts.detail());

    var rightToLeftPagedLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'right-to-left',
      viewingMode: 'paged',
      canvasHeight: 200,
      canvasWidth: 200,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      viewportPadding: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('right-left-paged-overview',
                        rightToLeftPagedLayouts.overview());
    renderLayoutDiagram('right-left-paged-intermediate',
                        rightToLeftPagedLayouts.intermediate());
    renderLayoutDiagram('right-left-paged-detail',
                        rightToLeftPagedLayouts.detail());

  var rightToLeftContinuousLayouts = manifestLayout({
      canvases: json.sequences[0].canvases,
      width: window.innerWidth,
      height: window.innerHeight,
      viewingDirection: 'right-to-left',
      viewingMode: 'continuous',
      canvasHeight: 200,
      canvasWidth: 200,
      selectedCanvas: json.sequences[0].canvases[5]['@id'],
      framePadding: {
        top: 10,
        bottom: 40,
        left: 10,
        right: 10
      },
      viewportPadding: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
      },
      minimumImageGap: 5, // precent of viewport
      facingCanvasPadding: 0.1 // precent of viewport
    });

    renderLayoutDiagram('right-left-continuous-overview',
                        rightToLeftContinuousLayouts.overview());
    renderLayoutDiagram('right-left-continuous-intermediate',
                        rightToLeftContinuousLayouts.intermediate());
    renderLayoutDiagram('right-left-continuous-detail',
                        rightToLeftContinuousLayouts.detail());
  });

});

var getLayoutBoundingBox = function(layout) {

  var maxX = -Infinity,
      maxY = -Infinity,
      minX = Infinity,
      minY = Infinity;

  layout.forEach(function(frame){
    if (frame.vantage) {
      var vantage = frame.vantage;
      // Make sure we also contain the
      // viewport box.
      if (vantage.x < minX) minX = vantage.x;
      if (vantage.y < minY) minY = vantage.y;
      if (vantage.x + vantage.width > maxX) {
        maxX = vantage.x + vantage.width;
      }
      if (vantage.y + vantage.height > maxY) {
        maxY = vantage.y + vantage.height;
      }
    }
    if ( frame.x < minX) minX = frame.x;
    if ( frame.y < minY) minY = frame.y;
    if ( frame.x + frame.width > maxX) {
      maxX = frame.x + frame.width;
    }
    if ( frame.y + frame.height > maxY) {
      maxY = frame.y + frame.height;
    }
  });

  // Get a box that contains the topLeftmost
  // topRightmost canvas of the selection.
  // Will need to be updated for viewingDirections.

  // Calculate a bounding box for the complete layout.
  var layoutBBWidth = maxX + Math.abs(minX),
      layoutBBHeight = maxY + Math.abs(minY);

  return {
    x: minX,
    y: minY,
    width: layoutBBWidth,
    height: layoutBBHeight
  };
};

function renderFrameDiagram(elemId, layout) {
}

function renderViewportDiagram(elemId, layout) {
}

function renderLayoutDiagram(elemId, layout) {
  var canvas = new etch.drawing.Canvas(document.getElementById(elemId)),
      canvasMargin = 20,
      layoutBoundingBox = getLayoutBoundingBox(layout),
      scaleFactor;

  canvas.style.backgroundColor = '#FFF';
  canvas.width = 400;
  canvas.height = canvas.width/(layoutBoundingBox.width/layoutBoundingBox.height);

  if (canvas.height < 40) {
    canvas.width = window.innerWidth -50;
    canvas.height = canvas.width/(layoutBoundingBox.width/layoutBoundingBox.height) +
      canvasMargin*2;
  }

  scaleFactor = (canvas.width - canvasMargin*2)/layoutBoundingBox.width;
  // if (canvas.height > window.innerHeight*0.8) {
  //   canvas.height = window.innerHeight*0.8;
  //   canvas.width = canvas.width*(layoutBoundingBox.width/layoutBoundingBox.height);
  // }

  mainScene = new MainScene();
  mainScene.init(canvas);

  // This ensures we can view the entire sceneGraph
  // in the example canvas as a kind of "minimap".
  // The layout is a function of the aspect ratio
  // of the viewport object, an optional anchor
  // coordinate pair and the dimensions of the
  // canvases themselves.


  addCanvases(layout, layoutBoundingBox, scaleFactor, canvasMargin, mainScene);
  // if (showFrames) {
    addFrames(layout, layoutBoundingBox, scaleFactor, canvasMargin, mainScene);
  // }
  // if (showViewport) {
    addViewport(layout, layoutBoundingBox, scaleFactor, canvasMargin, mainScene);
  // }
  // if (showNumbers) {
  // }
}

function addCanvases(layout, layoutBoundingBox, scaleFactor, canvasMargin, mainScene) {
  layout.forEach(function(frame, index) {
    var x  = frame.canvas.x,
        y = frame.canvas.y,
        width = frame.canvas.width,
        height = frame.canvas.height;

    var canvas = new Mover();
    canvas.init(mainScene);
    mainScene.displayList.add(canvas);
    canvas.position.x = (x + Math.abs(layoutBoundingBox.x))*scaleFactor + canvasMargin;
    canvas.position.y = (y + Math.abs(layoutBoundingBox.y))*scaleFactor + canvasMargin;
    canvas.width = width*scaleFactor;
    canvas.height = height*scaleFactor;
    canvas.selected = frame.canvas.selected;
    canvas.type = 'canvas';
    canvas.showNumbers = true;
    canvas.index = frame.canvas.sequencePosition;
  });
}

function addFrames(layout, layoutBoundingBox, scaleFactor, canvasMargin, mainScene) {
  layout.forEach(function(frame) {
    var x  = frame.x,
        y = frame.y,
        width = frame.width,
        height = frame.height;

    var canvasFrame = new Mover();
    canvasFrame.init(mainScene);
    mainScene.displayList.add(canvasFrame);

    canvasFrame.position.x = (x + Math.abs(layoutBoundingBox.x))*scaleFactor + canvasMargin;
    canvasFrame.position.y = (y + Math.abs(layoutBoundingBox.y))*scaleFactor + canvasMargin;
    canvasFrame.width = width*scaleFactor;
    canvasFrame.height = height*scaleFactor;
    canvasFrame.selected = frame.canvas.selected;
    canvasFrame.type = 'frame';
  });
}

function addViewport(layout, layoutBoundingBox, scaleFactor, canvasMargin, mainScene) {
  var selectedCanvas = layout.filter(function(frame) {
    return frame.canvas.selected;
  });

  selectedCanvas.forEach(function(frame) {
    var viewport = new Mover();
    viewport.init(mainScene);
    mainScene.displayList.add(viewport);

    viewport.position.x = (frame.vantage.x + Math.abs(layoutBoundingBox.x))*scaleFactor + canvasMargin;
    viewport.position.y = (frame.vantage.y + Math.abs(layoutBoundingBox.y))*scaleFactor + canvasMargin;
    viewport.width = frame.vantage.width*scaleFactor;
    viewport.height = frame.vantage.height*scaleFactor;
    viewport.type = 'viewport';
  });
}

function immediateModeViewer(container, layoutParams, mode) {
  var scene;

  function init() {
    renderLayoutDiagram(container, manifestLayout(layout).overview());
  }
  function framePadding(framePadding) {
    if (arguments.length !== 0) {
      layout.framePadding = framePadding;
      render();
    }
    return layout;
  }
  function perspective() {}
  function selectedCanvas() {}
  function readingDirection() {}
  function viewportPadding() {}
  function render() {
  }

  init();

  return {
    framePadding: framePadding,
    render: render
  };
}

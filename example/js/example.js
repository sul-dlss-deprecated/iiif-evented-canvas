$(function(){
  var manifest = $.getJSON('http://dms-data.stanford.edu/data/manifests/BnF/jr903ng8662/manifest.json', function(json) {

    myEventedCanvas = new iiifEventedCanvas({
      canvas: json.sequences[0].canvases[0],
      index: 0,
      dispatcher: new EventEmitter2.EventEmitter2() // in Mirador this would be the EventEmitter for the whole app.
    });

    myEventedCanvas.dispatcher.on('canvas-hide', function() { console.log('hide'); });
  });
});

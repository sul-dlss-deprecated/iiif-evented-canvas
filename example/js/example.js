$(function(){
  // var manifest = $.getJSON('http://dms-data.stanford.edu/data/manifests/BnF/jr903ng8662/manifest.json', function(json) {

  // var manifest = $.getJSON('https://iiif.lib.harvard.edu/manifests/drs:5981093', function(json) {

  var manifest = $.getJSON('http://demos.biblissima-condorcet.fr/iiif/metadata/florus-dispersus/manifest.json', function(json) {

  // var manifest = $.getJSON('http://manifests.ydc2.yale.edu/manifest/Osbornfa1v2.json', function(json) {

    window.myEventedCanvas = new iiifEventedCanvas({
      canvas: json.sequences[0].canvases[2],
      index: 0,
      dispatcher: new EventEmitter2.EventEmitter2() // in Mirador this would be the EventEmitter for the whole app.
    });

    myEventedCanvas.dispatcher.on('canvas-hide', function() { console.log('hide'); });
  });
});

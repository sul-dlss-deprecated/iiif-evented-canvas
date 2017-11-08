$(function(){
  // var manifest = $.getJSON('http://dms-data.stanford.edu/data/manifests/BnF/jr903ng8662/manifest.json', function(json) {

  // var manifest = $.getJSON('https://iiif.lib.harvard.edu/manifests/drs:5981093', function(json) {

  // var manifest = $.getJSON('http://demos.biblissima-condorcet.fr/iiif/metadata/florus-dispersus/manifest.json', function(json) {

  // var manifest = $.getJSON('http://manifests.ydc2.yale.edu/manifest/Osbornfa1v2.json', function(json) {

  // var manifest = $.getJSON('https://dms-data.stanford.edu/data/manifests/Parker/fp910bz4637/manifest.json', function(json) {

  // var manifest = $.getJSON('https://iiif.bodleian.ox.ac.uk/iiif/manifest/af500ae6-61b8-4df9-b290-8aab0c2dd10f.json', function(json) {

  var manifest = $.getJSON('https://data.getty.edu/museum/api/iiif/530/manifest.json', function(json) {

    window.myEventedCanvas = new iiifEventedCanvas({
      canvas: json.sequences[0].canvases[0],
      index: 0,
      dispatcher: new EventEmitter2.EventEmitter2() // in Mirador this would be the EventEmitter for the whole app.
    });

    myEventedCanvas.dispatcher.on('canvas-hide', function() { console.log('hide'); });
  });
});

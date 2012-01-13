define( [ "./glcore" ], function( GLCore ){

  var Context = function( contextOptions ){

    contextOptions = contextOptions || {};

    var _canvas = contextOptions.canvas;

    if( !_canvas ){
      //make a canvas here
    } //if

    var _glCore = new GLCore({
      canvas: _canvas 
    });

    Object.defineProperties( this, {
      canvas: { get: function() { return _canvas; } }
    }); //properties

    this.setCoordinates = function( x, y ){
      _glCore.setCoordinates( x, y );
    }; //setCoordinates

    this.render = function(){
      _glCore.render();
    }; //render

  }; //Context

  return Context;
});

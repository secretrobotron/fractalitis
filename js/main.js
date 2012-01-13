/*
  fractalitis
  Copyright (C) 2011 Bobby Richter & Benoit Jacob
*/
(function (root) {

  define( [ "./context" ], function( Context ){

    var fractalitis = function( callback ){

      // Add your init code here.

      if( callback ) {
        callback();
      } //if

    }; //fractalitis

    // In dev, there may be calls that are waiting for the implementation to
    // show up. Handle them now.
    var waiting;
    if( root.fractalitis ){
      waiting = root.fractalitis.__waiting;
      delete fractalitis.__waiting;
    }
    fractalitis.Context = Context;
    root.fractalitis = fractalitis;

    if( waiting ){
      for( var i=0, l=waiting.length; i<l; ++i ){
        fractalitis.apply( {}, waiting[ i ] );
      }
    } //if

    return fractalitis;

  }); //define

}( this ));

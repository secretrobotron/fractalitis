define( [], function(){

  const VERTEX_VECTOR_SIZE = 2;

  var __fragmentShaderSource = "" +
    "precision highp float;" +
    "varying vec2 vCoordinates;" +
    "void main( void ){" +
      "float xColor = mod( gl_FragCoord.x * 0.1 * vCoordinates.x, 1.0 );" +
      "float yColor = mod( gl_FragCoord.y * 0.1 * vCoordinates.y, 1.0 );" +
      "gl_FragColor = vec4( xColor, yColor, 1.0, 1.0 );" +
    "}" +
    "";

  var __vertexShaderSource = "" +
    "attribute vec4 aVertexPosition;" +
    "uniform vec2 uCoordinates;" +
    "varying vec2 vCoordinates;" +
    "void main( void ){" +
      "vCoordinates = uCoordinates;" +
      "gl_Position = vec4( aVertexPosition.x, aVertexPosition.y, 0.0, 1.0 );" +
    "}" +
    "";

  var GLCore = function( glCoreOptions ){

    var _gl = glCoreOptions.canvas.getContext( "webgl" ) ||
              glCoreOptions.canvas.getContext( "experimental-webgl" ),
        _uCoordinates,
        _tilesX = 4,
        _tilesY = 4
        _tiles = [];

    _gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    _gl.clear( _gl.COLOR_BUFFER_BIT );

    var fragmentShader = _gl.createShader( _gl.FRAGMENT_SHADER );
    _gl.shaderSource( fragmentShader, __fragmentShaderSource );
    _gl.compileShader( fragmentShader );

    if( !_gl.getShaderParameter( fragmentShader, _gl.COMPILE_STATUS ) ){
      alert( _gl.getShaderInfoLog( fragmentShader ) );
      return;
    }

    var vertexShader = _gl.createShader( _gl.VERTEX_SHADER );
    _gl.shaderSource( vertexShader, __vertexShaderSource );
    _gl.compileShader( vertexShader );

    if( !_gl.getShaderParameter( vertexShader, _gl.COMPILE_STATUS ) ){
      alert( _gl.getShaderInfoLog( vertexShader ) );
      return;
    }

    var shaderProgram = _gl.createProgram();
    _gl.attachShader( shaderProgram, fragmentShader );
    _gl.attachShader( shaderProgram, vertexShader );
    _gl.linkProgram( shaderProgram );

    if( !_gl.getProgramParameter( shaderProgram, _gl.LINK_STATUS ) ){
      alert( "Could not link shader." );
      return;
    }

    _gl.validateProgram( shaderProgram );
    _gl.useProgram( shaderProgram );

    var vertexAttribute = _gl.getAttribLocation( shaderProgram, 'aVertexPosition' );
    _gl.enableVertexAttribArray( vertexAttribute );

    var vertexBuffer = _gl.createBuffer();
    _gl.bindBuffer( _gl.ARRAY_BUFFER, vertexBuffer );

    for( var i=0; i<_tilesX; ++i ){
      for( var j=0; j<_tilesY; ++j ){
        _tiles.push( new Float32Array([
          // top triangle
          2 / _tilesX * i - 1,
          2 / _tilesY * j - 1,
          2 / _tilesX * ( i + 1 ) - 1,
          2 / _tilesY * j - 1,
          2 / _tilesX * i - 1,
          2 / _tilesY * ( j + 1 ) - 1,
          // bottom triangle
          2 / _tilesX * i - 1,
          2 / _tilesY * ( j + 1 ) - 1,
          2 / _tilesX * ( i + 1 ) - 1,
          2 / _tilesY * j - 1,
          2 / _tilesX * ( i + 1 ) - 1,
          2 / _tilesY * ( j + 1 ) - 1
        ]));
      } //for
    } //for

    _gl.vertexAttribPointer( vertexAttribute, VERTEX_VECTOR_SIZE, _gl.FLOAT, false, 0, 0 );

    _uCoordinates = _gl.getUniformLocation( shaderProgram, "uCoordinates" );

    var _numVertices = _tiles[ 0 ].length / VERTEX_VECTOR_SIZE;

    this.render = function(){
      for( var i=0, l=_tiles.length; i<l; ++i ){
        _gl.bufferData( _gl.ARRAY_BUFFER, _tiles[ i ], _gl.STATIC_DRAW );
        _gl.drawArrays( _gl.TRIANGLES, 0, _numVertices );
        _gl.flush();
      } //for
    }; //render

    this.setCoordinates = function( x, y ){
      _gl.uniform2f( _uCoordinates, x, y );
    }; //setCoordinates

    Object.defineProperties( this, {
      gl: { get: function() { return _gl; } }
    }); //properties

  }; //GLCore

  return GLCore;
});

'use strict';

/*********************************************************************************************************************************
 * 球状物体类，用来计算球的顶点坐标、纹理坐标、法向量、索引的数据并且绑定buffer
 * @param       {[type]} xR x轴直径
 * @param       {[type]} yR y轴直径
 * @param       {[type]} zR z轴直径
 * @constructor
 */
function Sphere(xR, yR, zR) {
  this.xRadius = xR;
  this.yRadius = yR;
  this.zRadius = zR;

  this.indicesNum = 0;
  this.vPositionData = [];
  this.vTextureCoordData = [];
  this.vNormalData = [];
  this.indexData = [];

  this.vPositionBuffer; //  = gl.createBuffer()
  this.vTextureCoordBuffer;
  this.vNormalBuffer;
  this.indexBuffer;

  this.vPostions;
  this.vTextureCoords;
  this.vNormals;
  this.indices;
}

/**
 * 球状物体类的各个成员函数
 * @type {Object}
 */
Sphere.prototype = {
  //计算球的计算球的顶点坐标、纹理坐标、法向量、索引的数据
  createSphere: function() {
    this.indicesNum = initSphereBuffers(this.xRadius, this.yRadius, this.zRadius, this.vPositionData, this.vTextureCoordData, this.vNormalData, this.indexData);
  },

  /**
   * 对球状物体进行各类初始化操作
   * @param  {[type]} gl WebGL context object
   */
  initBuffer: function(gl) {
    this.vPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vPositionData), gl.STATIC_DRAW);
    this.vPositions = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(this.vPositions);

    //normal buffer
    this.vNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vNormalData), gl.STATIC_DRAW);
    this.vNormals = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(this.vNormals);

    // texture coordinate buffer
    this.vTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vTextureCoordData), gl.STATIC_DRAW);
    this.vTextureCoords = gl.getAttribLocation(program, "vTexCoord");
    gl.enableVertexAttribArray(this.vTextureCoords);

    // array element buffer
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexData), gl.STATIC_DRAW);
  },

  /**
   * 球状物体绘制函数，在渲染时调用
   * @param  {[type]} gl WebGL context object
   * @param  {[type]} id 纹理图片的唯一标识号
   */
  draw: function(gl, id) {
    switch(id) {
      case 0:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
        gl.activeTexture(gl.TEXTURE0);
        break;
      case 1:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);
        gl.activeTexture(gl.TEXTURE1);
        break;
      case 2:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 2);
        gl.activeTexture(gl.TEXTURE2);
        break;
      case 3:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 3);
        gl.activeTexture(gl.TEXTURE3);
        break;
      case 4:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 4);
        gl.activeTexture(gl.TEXTURE4);
        break;
      case 5:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 5);
        gl.activeTexture(gl.TEXTURE5);
        break;
      case 6:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 6);
        gl.activeTexture(gl.TEXTURE6);
        break;
    }
    gl.enableVertexAttribArray(this.vTextureCoords);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vTextureCoordBuffer);
    gl.vertexAttribPointer(this.vTextureCoords, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vPositionBuffer);
    gl.vertexAttribPointer(this.vPositions, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vNormalBuffer);
    gl.vertexAttribPointer(this.vNormals, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements( gl.TRIANGLES, this.indicesNum, gl.UNSIGNED_SHORT, 0);
  }
}


/**
 * 球状物体绘制函数
 * @param  {[type]} xRadius             x轴半径
 * @param  {[type]} yRadius             y轴半径
 * @param  {[type]} zRadius             z轴半径
 * @param  {[type]} vPositionData       存放顶点坐标位置数据
 * @param  {[type]} vTextureCoordData   存放顶点对应的二维纹理坐标数据
 * @param  {[type]} vNormalData         存放每个顶点对应的法向量数据
 * @param  {[type]} indexData           存放索引数据
 * @return {[type]} indexData.length    索引个数
 */
function initSphereBuffers(xRadius, yRadius, zRadius, vPositionData, vTextureCoordData, vNormalData, indexData) {
    var latitudeBands = 25;
    var longitudeBands = 25;

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta; // x = r sinθ cosφ
        var y = cosTheta;          // y = r cosθ
        var z = sinPhi * sinTheta; // z = r sinθ sinφ
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        vNormalData.push(x);
        vNormalData.push(y);
        vNormalData.push(z);
        vNormalData.push(1.0);
        vTextureCoordData.push(u);
        vTextureCoordData.push(v);
        vPositionData.push(xRadius * x);
        vPositionData.push(yRadius * y);
        vPositionData.push(zRadius * z);
        vPositionData.push(1.0);
      }
    }

    // 当我们获取了顶点坐标位置的数据后，通过一系列有序的值，每6个为一组，代表一个由两个三角形组成的正方形
    // 来将得到的顶点缝合成一个顶点索引列表。
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }
    return indexData.length;
}
/***********************************************************************************************************************************************/


function Cube(sideLength) {
  this.side = sideLength;

  this.vPositionData = [];
  this.vTextureCoordData = [];
  this.vNormalData = [];

  this.vPositionBuffer;
  this.vTextureCoordBuffer;
  this.vNormalBuffer;

  this.vPostions;
  this.vTextureCoords;
  this.vNormals;
}

Cube.prototype = {
  //计算立方体的计算球的顶点坐标、纹理坐标、法向量、索引的数据
  createCube: function() {
    initCubeBuffers(this.side, this.vPositionData, this.vTextureCoordData, this.vNormalData);
  },

  /**
   * 对立方体物体进行各类初始化操作
   * @param  {[type]} gl WebGL context object
   */
  initBuffer: function(gl) {
    this.vPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vPositionData), gl.STATIC_DRAW);
    this.vPositions = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(this.vPositions);

    //normal buffer
    this.vNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vNormalData), gl.STATIC_DRAW);
    this.vNormals = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(this.vNormals);

    // texture coordinate buffer
    this.vTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.vTextureCoordData), gl.STATIC_DRAW);
    this.vTextureCoords = gl.getAttribLocation(program, "vTexCoord");
    gl.enableVertexAttribArray(this.vTextureCoords);
  },

  /**
   * 立方体物体绘制函数，在渲染时调用
   * @param  {[type]} gl WebGL context object
   * @param  {[type]} id 纹理图片的唯一标识号
   */
  draw: function(gl, id) {
    switch(id) {
      case 7:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 7);
        gl.activeTexture(gl.TEXTURE7);
        break;
      case 8:
        gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 8);
        gl.activeTexture(gl.TEXTURE8);
        break;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vTextureCoordBuffer);
    gl.vertexAttribPointer(this.vTextureCoords, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vPositionBuffer);
    gl.vertexAttribPointer(this.vPositions, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vNormalBuffer);
    gl.vertexAttribPointer(this.vNormals, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.vTextureCoords);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
}


function initCubeBuffers(side, vPositionData, vTextureCoordData, vNormalData) {
  var n = side / 2;
  // 顶点坐标、纹理坐标、法向量计算
  quad(1, 0, 3, 2, n, vPositionData, vTextureCoordData, vNormalData);
  quad(2, 3, 7, 6, n, vPositionData, vTextureCoordData, vNormalData);
  quad(3, 0, 4, 7, n, vPositionData, vTextureCoordData, vNormalData);
  quad(6, 5, 1, 2, n, vPositionData, vTextureCoordData, vNormalData);
  quad(4, 5, 6, 7, n, vPositionData, vTextureCoordData, vNormalData);
  quad(5, 4, 0, 1, n, vPositionData, vTextureCoordData, vNormalData);
}

function quad(a, b, c, d, n, vPositionData, vTextureCoordData, vNormalData) {
  // 纹理坐标
  var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
  ];
  // 顶点坐标
  var vertices = [
      vec4(-n, -n, n, 1.0),
      vec4(-n, n, n, 1.0),
      vec4(n, n, n, 1.0),
      vec4(n, -n, n, 1.0),
      vec4(-n, -n, -n, 1.0),
      vec4(-n, n, -n, 1.0),
      vec4(n, n, -n, 1.0),
      vec4(n, -n, -n, 1.0)
  ];

  // 法向量
  var t1 = subtract(vertices[b], vertices[a]);
  var t2 = subtract(vertices[c], vertices[b]);
  var normal = cross(t1, t2);
  var normal = vec3(normal);

  vPositionData.push(vertices[a]);
  vTextureCoordData.push(texCoord[0]);
  vNormalData.push(normal);

  vPositionData.push(vertices[b]);
  vTextureCoordData.push(texCoord[1]);
  vNormalData.push(normal);

  vPositionData.push(vertices[c]);
  vTextureCoordData.push(texCoord[2]);
  vNormalData.push(normal);

  vPositionData.push(vertices[a]);
  vTextureCoordData.push(texCoord[0]);
  vNormalData.push(normal);

  vPositionData.push(vertices[c]);
  vTextureCoordData.push(texCoord[2]);
  vNormalData.push(normal);

  vPositionData.push(vertices[d]);
  vTextureCoordData.push(texCoord[3]);
  vNormalData.push(normal);
}

//画圆台函数
function torus(row, column, irad, orad){
    var pos = new Array(), col = new Array(), idx = new Array();
    for(var i = 0; i <= row; i++){
        var r = Math.PI * 2 / row * i;
        var rr = Math.cos(r);
        var ry = Math.sin(r);
        for(var ii = 0; ii <= column; ii++){
            var tr = Math.PI * 2 / column * ii;
            var tx = (rr * irad + orad) * Math.cos(tr);
            var ty = ry * irad;
            var tz = (rr * irad + orad) * Math.sin(tr);
            pos.push(tx, ty, tz);
            var tc = hsva(360 / column * ii, 1, 1, 1);
            col.push(tc[0], tc[1], tc[2], tc[3]);
        }
    }
    for(i = 0; i < row; i++){
        for(ii = 0; ii < column; ii++){
            r = (column + 1) * i + ii;
            idx.push(r, r + column + 1, r + 1);
            idx.push(r + column + 1, r + column + 2, r + 1);
        }
    }
    return [pos, col, idx];
}

function hsva(h, s, v, a){
    if(s > 1 || v > 1 || a > 1){return;}

    var th = h % 360;
    var i = Math.floor(th / 60);
    var f = th / 60 - i;
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    var k = v * (1 - s * (1 - f));
    var color = new Array();
    if(!s > 0 && !s < 0){
        color.push(v, v, v, a);
    } else {
        var r = new Array(v, n, m, m, k, v);
        var g = new Array(k, v, v, n, m, m);
        var b = new Array(m, m, k, v, v, n);
        color.push(192/255, 192/255, 192/255, a);
    }
    return color;
}

/**
 * 指定图像来配置该图像的纹理信息
 * @param  {[type]} image 用来贴图的图片名
 * @param  {[type]} id     [description]
 */
function configureTexture(image, id) {
    var texture = gl.createTexture();

    switch(id) {
      case 0:
        gl.activeTexture(gl.TEXTURE0);
        break;
      case 1:
        gl.activeTexture(gl.TEXTURE1);
        break;
      case 2:
        gl.activeTexture(gl.TEXTURE2);
        break;
      case 3:
        gl.activeTexture(gl.TEXTURE3);
        break;
      case 4:
        gl.activeTexture(gl.TEXTURE4);
        break;
      case 5:
        gl.activeTexture(gl.TEXTURE5);
        break;
      case 6:
        gl.activeTexture(gl.TEXTURE6);
        break;
      case 7:
        gl.activeTexture(gl.TEXTURE7);
        break;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    switch(id) {
      case 0:
        gl.uniform1i(gl.getUniformLocation(program, "texture0"), id);
        break;
      case 1:
        gl.uniform1i(gl.getUniformLocation(program, "texture1"), id);
        break;
      case 2:
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), id);
        break;
      case 3:
        gl.uniform1i(gl.getUniformLocation(program, "texture3"), id);
        break;
      case 4:
        gl.uniform1i(gl.getUniformLocation(program, "texture4"), id);
        break;
      case 5:
        gl.uniform1i(gl.getUniformLocation(program, "texture5"), id);
        break;
      case 6:
        gl.uniform1i(gl.getUniformLocation(program, "texture6"), id);
        break;
    }
}

/**
 * 矩阵的相关运算和配置
 * @param  {[type]} tMatrix     [description]
 * @param  {[type]} mvMatrix    [description]
 * @param  {[type]} pMatrix     [description]
 * @param  {[type]} nMatrix     [description]
 * @param  {[type]} mvMatrixLoc [description]
 * @param  {[type]} pMatrixLoc  [description]
 * @param  {[type]} nMatrixLoc  [description]
 * @return {[type]}             [description]
 */
function matricesConfigure(tMatrix, mvMatrix, pMatrix, nMatrix, mvMatrixLoc, pMatrixLoc, nMatrixLoc) {
  mvMatrix = mult(mvMatrix, tMatrix);
  normalMatrix = [
      vec3(mvMatrix[0][0], mvMatrix[0][1], mvMatrix[0][2]),
      vec3(mvMatrix[1][0], mvMatrix[1][1], mvMatrix[1][2]),
      vec3(mvMatrix[2][0], mvMatrix[2][1], mvMatrix[2][2])
  ];

  gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));
  gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix));
}

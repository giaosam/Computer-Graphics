'use strict';

var iBufferSphereID1, tBufferSphereID1, vBufferSphereID1, nBuffer1; //第一个球体的3个buffer
var vSpherePosition1, vSphereTextureCoord1, vSphereNormal1;
var numSphereVertex1; //球的顶点数
var sphereVertices1 = []; //球的顶点
var sphereIndices1 = []; //球的索引
var sphereTextureCoords1 = []; //球的纹理
var sphereNormals1 = [];//球上顶点的法向量

function Sphere(xR, yR, zR) {
  this.xRadius = xR;
  this.yRadius = yR;
  this.zRadius = zR;

  this.indicesNum = 0;
  this.vPositionData = [];
  this.vTextureCoordData = [];
  this.vNormalData = [];
  this.indexData = [];

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

Sphere.prototype = {
  createSphere: function() {
    this.indicesNum = initSphereBuffers(this.xRadius, this.yRadius, this.zRadius, this.vPositionData, this.vTextureCoordData, this.vNormalData, this.indexData);
  },

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
 * @param  {[type]} vNormalDat 25;a         存放每个顶点对应的法向量数据
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

// 指定图像来配置该图像的纹理信息
function configureTexture(image, id) {
    var texture = gl.createTexture();
    console.log(id);

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
    }
}

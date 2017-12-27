"use strict";

var canvas;
var gl;
var program;

var near = 0.3;
var far = 12.0;
var radius = 2.0; // 照相机到物体的距离
var theta  = 0.1745;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio

var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var RotateAngle = 0; //旋转角度

var CurModelViewMatrix = mat4(); //当前变换矩阵
var CurProjectionMatrix = mat4(); //当前投影矩阵
var CurConversionMatrix = mat4(); //当前变换矩阵
var CurModelViewMatrixLoc; //shader 变量
var CurProjectionMatrixLoc; //shader 变量
var normalMatrix;
var normalMatrixLoc;

var iBufferCubeID, cBufferCubeID, vBufferCubeID; //立方体的3个buffer
var vCubeColor, vCubePosition;
var numCubeVertex  = 36;//立方体顶点数
var CubeTx = 0; //立方体平移量

var cBufferTetraID, vBufferTetraID; //四面体的2个buffer
var vTetraColor, vTetraPosition;
var TetraTx = 0; //四面体平移量

var iBufferSphereID1, tBufferSphereID1, vBufferSphereID1, nBuffer1; //第一个球体的3个buffer
var vSpherePosition1, vSphereTextureCoord1, vSphereNormal1;
var numSphereVertex1; //球的顶点数
var sphereVertices1 = []; //球的顶点
var sphereIndices1 = []; //球的索引
var sphereTextureCoords1 = []; //球的纹理
var sphereNormals1 = [];//球上顶点的法向量

var iBufferSphereID2, tBufferSphereID2, vBufferSphereID2, nBuffer2; //第二个球体的3个buffer
var vSpherePosition2, vSphereTextureCoord2, vSphereNormal2;
var numSphereVertex2; //球的顶点数
var sphereVertices2 = []; //球的顶点
var sphereIndices2 = []; //球的索引
var sphereTextureCoords2 = []; //球的纹理
var sphereNormals2 = [];//球上顶点的法向量


var iBufferSphereID3, tBufferSphereID3, vBufferSphereID3, nBuffer3; //第三个球体的3个buffer
var vSpherePosition3, vSphereTextureCoord3, vSphereNormal3;
var numSphereVertex3; //球的顶点数
var sphereVertices3 = []; //球的顶点
var sphereIndices3 = []; //球的索引
var sphereTextureCoords3 = []; //球的纹理
var sphereNormals3 = [];//球上顶点的法向量


var iBufferSphereID4, tBufferSphereID4, vBufferSphereID4, nBuffer4; //第四个球体的3个buffer
var vSpherePosition4, vSphereTextureCoord4, vSphereNormal4;
var numSphereVertex4; //球的顶点数
var sphereVertices4 = []; //球的顶点
var sphereIndices4 = []; //球的索引
var sphereTextureCoords4 = []; //球的纹理
var sphereNormals4 = [];//球上顶点的法向量


var iBufferSphereID5, tBufferSphereID5, vBufferSphereID5, nBuffer5; //第五个球体的3个buffer
var vSpherePosition5, vSphereTextureCoord5, vSphereNormal5;
var numSphereVertex5; //球的顶点数
var sphereVertices5 = []; //球的顶点
var sphereIndices5 = []; //球的索引
var sphereTextureCoords5 = []; //球的纹理
var sphereNormals5 = [];//球上顶点的法向量


var iBufferSphereID6, tBufferSphereID6, vBufferSphereID6, nBuffer6; //第六个球体的3个buffer
var vSpherePosition6, vSphereTextureCoord6, vSphereNormal6;
var numSphereVertex6; //球的顶点数
var sphereVertices6 = []; //球的顶点
var sphereIndices6 = []; //球的索引
var sphereTextureCoords6 = []; //球的纹理
var sphereNormals6 = [];//球上顶点的法向量


var iBufferSphereID7, tBufferSphereID7, vBufferSphereID7, nBuffer7; //第七个球体的3个buffer
var vSpherePosition7, vSphereTextureCoord7, vSphereNormal7;
var numSphereVertex7; //球的顶点数
var sphereVertices7 = []; //球的顶点
var sphereIndices7 = []; //球的索3引
var sphereTextureCoords7 = []; //球的纹理
var sphereNormals7 = [];//球上顶点的法向量


var iBufferSphereID8, tBufferSphereID8, vBufferSphereID8, nBuffer8; //第八个球体的3个buffer
var vSpherePosition8, vSphereTextureCoord8, vSphereNormal8;
var numSphereVertex8; //球的顶点数
var sphereVertices8 = []; //球的顶点
var sphereIndices8 = []; //球的索引
var sphereTextureCoords8 = []; //球的纹理
var sphereNormals8 = [];//球上顶点的法向量


var iBufferSphereID9, tBufferSphereID9, vBufferSphereID9, nBuffer9; //第九个球体的3个buffer
var vSpherePosition9, vSphereTextureCoord9, vSphereNormal9;
var numSphereVertex9; //球的顶点数
var sphereVertices9 = []; //球的顶点
var sphereIndices9 = []; //球的索引
var sphereTextureCoords9 = []; //球的纹理
var sphereNormals9 = [];//球上顶点的法向量


var iBufferSphereID10, tBufferSphereID10, vBufferSphereID10, nBuffer10; //第十个球体的3个buffer
var vSpherePosition10, vSphereTextureCoord10, vSphereNormal10;
var numSphereVertex10; //球的顶点数
var sphereVertices10 = []; //球的顶点
var sphereIndices10 = []; //球的索引
var sphereTextureCoords10 = []; //球的纹理
var sphereNormals10 = [];//球上顶点的法向量


var iBufferSphereID11, tBufferSphereID11, vBufferSphereID11, nBuffer11; //第十一个球体的3个buffer
var vSpherePosition11, vSphereTextureCoord11, vSphereNormal11;
var numSphereVertex11; //球的顶点数
var sphereVertices11 = []; //球的顶点
var sphereIndices11 = []; //球的索引
var sphereTextureCoords11 = []; //球的纹理
var sphereNormals11 = [];//球上顶点的法向量


var iBufferSphereID12, tBufferSphereID12, vBufferSphereID12, nBuffer12; //第十二个球体的3个buffer
var vSpherePosition12, vSphereTextureCoord12, vSphereNormal12;
var numSphereVertex12; //球的顶点数
var sphereVertices12 = []; //球的顶点
var sphereIndices12 = []; //球的索引
var sphereTextureCoords12 = []; //球的纹理
var sphereNormals12 = [];//球上顶点的法向量


var iBufferSphereID13, tBufferSphereID13, vBufferSphereID13, nBuffer13; //第十三个球体的3个buffer
var vSpherePosition13, vSphereTextureCoord13, vSphereNormal13;
var numSphereVertex13; //球的顶点数
var sphereVertices13 = []; //球的顶点
var sphereIndices13 = []; //球的索引
var sphereTextureCoords13 = []; //球的纹理
var sphereNormals13 = [];//球上顶点的法向量


var iBufferSphereID14, tBufferSphereID14, vBufferSphereID14, nBuffer14; //第十四个球体的3个buffer
var vSpherePosition14, vSphereTextureCoord14, vSphereNormal14;
var numSphereVertex14; //球的顶点数
var sphereVertices14 = []; //球的顶点
var sphereIndices14 = []; //球的索引
var sphereTextureCoords14 = []; //球的纹理
var sphereNormals14 = [];//球上顶点的法向量


var iBufferSphereID15, tBufferSphereID15, vBufferSphereID15, nBuffer15; //第十五个球体的3个buffer
var vSpherePosition15, vSphereTextureCoord15, vSphereNormal15;
var numSphereVertex15; //球的顶点数
var sphereVertices15 = []; //球的顶点
var sphereIndices15 = []; //球的索引
var sphereTextureCoords15 = []; //球的纹理
var sphereNormals15 = [];//球上顶点的法向量


var iBufferSphereID16, tBufferSphereID16, vBufferSphereID16, nBuffer16; //第十六个球体的3个buffer
var vSpherePosition16, vSphereTextureCoord16, vSphereNormal16;
var numSphereVertex16; //球的顶点数
var sphereVertices16 = []; //球的顶点
var sphereIndices16 = []; //球的索引
var sphereTextureCoords16 = []; //球的纹理
var sphereNormals16 = [];//球上顶点的法向量


var iBufferSphereID17, tBufferSphereID17, vBufferSphereID17, nBuffer17; //第十七个球体的3个buffer
var vSpherePosition17, vSphereTextureCoord17, vSphereNormal17;
var numSphereVertex17; //球的顶点数
var sphereVertices17 = []; //球的顶点
var sphereIndices17 = []; //球的索引
var sphereTextureCoords17 = []; //球的纹理
var sphereNormals17 = [];//球上顶点的法向量


var iBufferTorusID,cBufferTorusID, vBufferTorusID, nBufferTorusID;//
var vTorusPosition, vTorusTextureCoord, vTorusNormal;
var numTorusVertex; //圆台的顶点数
var torusVertices = []; //圆台的顶点
var torusIndices = []; //圆台的索引
var torusTextureCoords = []; //圆台的颜色init
var torusNormals = [];


//FCB 1210
var lightPosition = vec4(1.0, 1.0, 2.0);

//var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
var lightSpecular = vec4(0.5, 0.5, 0.5, 1.0);

var materialAmbient = vec4(0.5, 0.2, 0.2, 1.0);
var materialDiffuse = vec4(0.8, 0.8, 1.0, 1.0);
var materialSpecular = vec4(0.9, 0.8, 0.8, 1.0);
var materialShininess = 10000.0;

var projection;

// //立方体相关数组，直接设置
//     var vertices = [
//         vec3( -0.5, -0.5,  0.5 ),
//         vec3( -0.5,  0.5,  0.5 ),
//         vec3(  0.5,  0.5,  0.5 ),
//         vec3(  0.5, -0.5,  0.5 ),
//         vec3( -0.5, -0.5, -0.5 ),
//         vec3( -0.5,  0.5, -0.5 ),
//         vec3(  0.5,  0.5, -0.5 ),
//         vec3(  0.5, -0.5, -0.5 )
//     ];

//     // var vertexColors = [
//     //     vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
//     //     vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
//     //     vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
//     //     vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
//     //     vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
//     //     vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
//     //     vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
//     //     vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
//     // ];

// // indices of the 12 triangles that compise the cube

// var indices = [
//     1, 0, 3,
//     3, 2, 1,
//     2, 3, 7,
//     7, 6, 2,
//     3, 0, 4,
//     4, 7, 3,
//     6, 5, 1,
//     1, 2, 6,
//     4, 5, 6,
//     6, 7, 4,
//     5, 4, 0,
//     0, 1, 5
// ];

//四面体相关数组，计算得到
// var vertices_tetrahedron = [];
// var colors_tetrahedron = [];

// var basevertices = [
//         vec3(0.0000, 0.0000, -1.0000),
//         vec3(0.0000, 0.9428, 0.3333),
//         vec3(-0.8165, -0.4714, 0.3333),
//         vec3(0.8165, -0.4714, 0.3333)
//     ];

// var basecolors_tetrahedron = [
//         vec4(1.0, 0.0, 0.0, 1.0),
//         vec4(0.0, 1.0, 0.0, 1.0),
//         vec4(0.0, 0.0, 1.0, 1.0),
//         vec4(0.5, 0.5, 0.5, 1.0)
//     ];

// function triangle(a, b, c, color) {
//     // add colors and vertices for one triangle

//     colors_tetrahedron.push(basecolors_tetrahedron[color]);
//     vertices_tetrahedron.push(a);
//     colors_tetrahedron.push(basecolors_tetrahedron[color]);
//     vertices_tetrahedron.push(b);
//     colors_tetrahedron.push(basecolors_tetrahedron[color]);
//     vertices_tetrahedron.push(c);
// }

// function tetra(a, b, c, d) {
//     // tetrahedron with each side using
//     // a different color

//     triangle(a, c, b, 0);
//     triangle(a, c, d, 1);
//     triangle(a, b, d, 2);
//     triangle(b, c, d, 3);
// }


//虚拟跟踪球实现代码
var lastPos = [0, 0, 0];
var startX, startY;
var trackingMouse = false;
var trackballMove = false;
var angle = 0.0;
var axis = [0, 0, 1];
var rotationMatrix;

function startMotion( x,  y)
{
    trackingMouse = true;
    startX = x;
    startY = y;

    lastPos = trackballView(x, y);
    trackballMove=true;
}

function stopMotion( x,  y)
{
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
         //angle = 0.0;
         trackballMove = false;
    }
}

function mouseMotion( x,  y)
{
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if(trackingMouse) {
      dx = curPos[0] - lastPos[0];
      dy = curPos[1] - lastPos[1];
      dz = curPos[2] - lastPos[2];
      //console.log(dx,dy,dz);

      if (dx || dy || dz) {
           // angle = -0.1 * Math.sqrt(dx*dx + dy*dy + dz*dz);

           // axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
           // axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
           // axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];

           if (dx > 0){
               theta += dr;
           }

           if (dx < 0){
               theta -= dr;
           }

           if (dy > 0){
               phi += dr;
           }

           if (dy < 0){
               phi -= dr;
           }

           if (dz > 0){
               //radius += 0.01;
           }

           if (dz < 0){
               //radius -= 0.01;
           }

           lastPos[0] = curPos[0];
           lastPos[1] = curPos[1];
           lastPos[2] = curPos[2];
      }
    }

    render();
}

function trackballView( x,  y ) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0]*v[0] + v[1]*v[1];
    if (d < 4.0)
      v[2] = Math.sqrt(4.0 - d);
    else {
      v[2] = 0.0;
      a = 4.0 /  Math.sqrt(d);
      v[0] *= a;
      v[1] *= a;
    }
    return v;
}

// 指定图像来配置该图像的纹理信息
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
        gl.uniform1i(gl.getUniformLocation(program, "texture0"), 0);
        break;
      case 1:
        gl.uniform1i(gl.getUniformLocation(program, "texture1"), 1);
        break;
      case 2:
        gl.uniform1i(gl.getUniformLocation(program, "texture2"), 2);
        break;
    }
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width/canvas.height;
    gl.clearColor(0.0, 0.0, 0.0, 0.6);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //构建四面体
    //tetra(basevertices[0], basevertices[1], basevertices[2], basevertices[3]);

    //
    //  Load shaders and initialize attribute buffers
    //

    //立方体各参数
    //color array atrribute buffer
    // cBufferCubeID = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBufferCubeID);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
    // vCubeColor = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vCubeColor);

    // // array element buffer
    // iBufferCubeID = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferCubeID);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW); //注意类型转换

    // //vertex buffer
    // vBufferCubeID = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferCubeID);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    // vCubePosition = gl.getAttribLocation(program, "vPosition");
    // gl.enableVertexAttribArray(vCubePosition);

    //四面体各参数
    //vertex buffer
    //vBufferTetraID = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTetraID);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices_tetrahedron), gl.STATIC_DRAW);
    //vTetraPosition = gl.getAttribLocation(program, "vPosition");
    //gl.enableVertexAttribArray(vTetraPosition);

    // color array atrribute buffer
    //cBufferTetraID = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTetraID);
    //gl.bufferData(gl.ARRAY_BUFFER, flatten(colors_tetrahedron), gl.STATIC_DRAW);
    //vTetraColor = gl.getAttribLocation(program, "vColor");
    //gl.enableVertexAttribArray(vTetraColor);


    //第一个球体各参数-头部下部分的球
    numSphereVertex1 = initSphereBuffers(gl, program, 0.35, sphereVertices1, sphereTextureCoords1, sphereIndices1, sphereNormals1);

    //vertex buffer
    vBufferSphereID1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices1), gl.STATIC_DRAW);
    vSpherePosition1 = gl.getAttribLocation(program, "vPosition", vBufferSphereID1.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vSpherePosition1);

    //normal buffer
    nBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals1), gl.STATIC_DRAW);
    vSphereNormal1 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal1);

    vSphereTextureCoord1 = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vSphereTextureCoord1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vSphereTextureCoord1);

    // array element buffer
    iBufferSphereID1 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID1);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices1), gl.STATIC_DRAW);

    // texture coordinate buffer
    tBufferSphereID1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords1), gl.STATIC_DRAW);


    //第二个球体各参数-头部上部分的球
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex2 = initSphereBuffers(gl, program, 0.35, sphereVertices2, sphereTextureCoords2, sphereIndices2, sphereNormals2);

    // array element buffer
    iBufferSphereID2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices2), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices2), gl.STATIC_DRAW);
    vSpherePosition2 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition2);

    //normal buffer
    nBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals2), gl.STATIC_DRAW);
    vSphereNormal2 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal2);

    // texture coordinate buffer
    tBufferSphereID2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords2), gl.STATIC_DRAW);


    //第三个球体各参数-左耳朵
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex3 = initSphereBuffers(gl, program, 0.245, sphereVertices3, sphereTextureCoords3, sphereIndices3, sphereNormals3);

    // color array attribute buffer
    // tBufferSphereID3 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID3);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors3), gl.STATIC_DRAW);
    // vSphereColor3 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor3);

    // array element buffer
    iBufferSphereID3 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices3), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices3), gl.STATIC_DRAW);
    vSpherePosition3 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition3);

    //normal buffer
    nBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals3), gl.STATIC_DRAW);
    vSphereNormal3 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal3);

    // texture coordinate buffer
    tBufferSphereID3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID3);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords3), gl.STATIC_DRAW);


    //第四个球体各参数-右耳朵
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex4 = initSphereBuffers(gl, program, 0.245, sphereVertices4, sphereTextureCoords4, sphereIndices4, sphereNormals4);

    // color array attribute buffer
    // tBufferSphereID4 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID4);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors4), gl.STATIC_DRAW);
    // vSphereColor4 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor4);

    // array element buffer
    iBufferSphereID4 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID4);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices4), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID4);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices4), gl.STATIC_DRAW);
    vSpherePosition4 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition4);

    //normal buffer
    nBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals4), gl.STATIC_DRAW);
    vSphereNormal4 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal4);

    // texture coordinate buffer
    tBufferSphereID4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID4);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords4), gl.STATIC_DRAW);


    //第五个球体各参数-身体竖着的球
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex5 = initSphereBuffers(gl, program, 0.35, sphereVertices5, sphereTextureCoords5, sphereIndices5, sphereNormals5);

    // color array attribute buffer
    // tBufferSphereID5 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID5);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors5), gl.STATIC_DRAW);
    // vSphereColor5 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor5);

    // array element buffer
    iBufferSphereID5 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID5);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices5), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID5);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices5), gl.STATIC_DRAW);
    vSpherePosition5 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition5);

    //normal buffer
    nBuffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer5);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals5), gl.STATIC_DRAW);
    vSphereNormal5 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal5);

    // texture coordinate buffer
    tBufferSphereID5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID5);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords5), gl.STATIC_DRAW);


    //第六个球体各参数-身体横着的左边的球
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex6 = initSphereBuffers(gl, program, 0.245, sphereVertices6, sphereTextureCoords6, sphereIndices6, sphereNormals6);

    // color array attribute buffer
    // tBufferSphereID6 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID6);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors6), gl.STATIC_DRAW);
    // vSphereColor6 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor6);

    // array element buffer
    iBufferSphereID6 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID6);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices6), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID6 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID6);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices6), gl.STATIC_DRAW);
    vSpherePosition6 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition6);

    //normal buffer
    nBuffer6 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer6);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals6), gl.STATIC_DRAW);
    vSphereNormal6 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal6);

    // texture coordinate buffer
    tBufferSphereID6 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID6);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords6), gl.STATIC_DRAW);


    //第七个球体各参数-身体横着的右边的球
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex7 = initSphereBuffers(gl, program, 0.245, sphereVertices7, sphereTextureCoords7, sphereIndices7, sphereNormals7);

    // color array attribute buffer
    // tBufferSphereID7 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID7);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors7), gl.STATIC_DRAW);
    // vSphereColor7 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor7);

    // array element buffer
    iBufferSphereID7 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID7);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices7), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID7 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID7);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices7), gl.STATIC_DRAW);
    vSpherePosition7 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition7);

    //normal buffer
    nBuffer7 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer7);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals7), gl.STATIC_DRAW);
    vSphereNormal7 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal7);

    // texture coordinate buffer
    tBufferSphereID7 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID7);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords7), gl.STATIC_DRAW);


    //第八个球体各参数-左腮红
    var colorsVec4 = vec4(255/255, 55/255, 55/255, 1.0);
    numSphereVertex8 = initSphereBuffers(gl, program, 0.245, sphereVertices8, sphereTextureCoords8, sphereIndices8, sphereNormals8);

    // color array attribute buffer
    // tBufferSphereID8 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID8);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors8), gl.STATIC_DRAW);
    // vSphereColor8 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor8);

    // array element buffer
    iBufferSphereID8 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID8);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices8), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID8 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID8);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices8), gl.STATIC_DRAW);
    vSpherePosition8 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition8);

    //normal buffer
    nBuffer8 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer8);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals8), gl.STATIC_DRAW);
    vSphereNormal8 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal8);

    // texture coordinate buffer
    tBufferSphereID8 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID8);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords8), gl.STATIC_DRAW);


    //第九个球体各参数-右腮红
    numSphereVertex9 = initSphereBuffers(gl, program, 0.245, sphereVertices9, sphereTextureCoords9, sphereIndices9, sphereNormals9);

    // color array attribute buffer
    // tBufferSphereID9 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID9);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors9), gl.STATIC_DRAW);
    // vSphereColor9 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor9);

    // array element buffer
    iBufferSphereID9 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID9);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices9), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID9 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID9);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices9), gl.STATIC_DRAW);
    vSpherePosition9 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition9);

    //normal buffer
    nBuffer9 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer9);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals9), gl.STATIC_DRAW);
    vSphereNormal9 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal9);

    // texture coordinate buffer
    tBufferSphereID9 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID9);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords9), gl.STATIC_DRAW);


    //第十个球体各参数-嘴巴
    numSphereVertex10 = initSphereBuffers(gl, program, 0.245, sphereVertices10, sphereTextureCoords10, sphereIndices10, sphereNormals10);

    // color array attribute buffer
    // tBufferSphereID10 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID10);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors10), gl.STATIC_DRAW);
    // vSphereColor10 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor10);

    // array element buffer
    iBufferSphereID10 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID10);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices10), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID10 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID10);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices10), gl.STATIC_DRAW);
    vSpherePosition10 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition10);

    //normal buffer
    nBuffer10 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer10);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals10), gl.STATIC_DRAW);
    vSphereNormal10 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal10);

    // texture coordinate buffer
    tBufferSphereID10 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID10);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords10), gl.STATIC_DRAW);


    //第十一个球体各参数-左眼睛
    var colorsVec4 = vec4(0.0, 0.0, 0.0, 1.0);
    numSphereVertex11 = initSphereBuffers(gl, program, 0.245, sphereVertices11, sphereTextureCoords11, sphereIndices11, sphereNormals11);

    // color array attribute buffer
    // tBufferSphereID11 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID11);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors11), gl.STATIC_DRAW);
    // vSphereColor11 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor11);

    // array element buffer
    iBufferSphereID11 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID11);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices11), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID11 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID11);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices11), gl.STATIC_DRAW);
    vSpherePosition11 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition11);

    //normal buffer
    nBuffer11 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer11);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals11), gl.STATIC_DRAW);
    vSphereNormal11 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal11);

    // texture coordinate buffer
    tBufferSphereID11 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID11);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords11), gl.STATIC_DRAW);


    //第十二个球体各参数-右眼睛
    var colorsVec4 = vec4(0.0, 0.0, 0.0, 1.0);
    numSphereVertex12 = initSphereBuffers(gl, program, 0.245, sphereVertices12, sphereTextureCoords12, sphereIndices12, sphereNormals12);

    // color array attribute buffer
    // tBufferSphereID12 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID12);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors12), gl.STATIC_DRAW);
    // vSphereColor12 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor12);

    // array element buffer
    iBufferSphereID12 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID12);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices12), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID12 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID12);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices12), gl.STATIC_DRAW);
    vSpherePosition12 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition12);

    //normal buffer
    nBuffer12 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer12);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals12), gl.STATIC_DRAW);
    vSphereNormal12 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal12);

    // texture coordinate buffer
    tBufferSphereID12 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID12);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords12), gl.STATIC_DRAW);


    //第十三个球体各参数-左眼珠
    var colorsVec4 = vec4(1.0, 1.0, 1.0, 1.0);
    numSphereVertex13 = initSphereBuffers(gl, program, 0.245, sphereVertices13, sphereTextureCoords13, sphereIndices13, sphereNormals13);

    // color array attribute buffer
    // tBufferSphereID13 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID13);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors13), gl.STATIC_DRAW);
    // vSphereColor13 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor13);

    // array element buffer
    iBufferSphereID13 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID13);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices13), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID13 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID13);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices13), gl.STATIC_DRAW);
    vSpherePosition13 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition13);

    //normal buffer
    nBuffer13 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer13);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals13), gl.STATIC_DRAW);
    vSphereNormal13 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal13);

    // texture coordinate buffer
    tBufferSphereID13 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID13);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords13), gl.STATIC_DRAW);


    //第十四个球体各参数-右眼珠
    var colorsVec4 = vec4(1.0, 1.0, 1.0, 1.0);
    numSphereVertex14 = initSphereBuffers(gl, program, 0.245, sphereVertices14, sphereTextureCoords14, sphereIndices14, sphereNormals14);

    // color array attribute buffer
    // tBufferSphereID14 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID14);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors14), gl.STATIC_DRAW);
    // vSphereColor14 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor14);

    // array element buffer
    iBufferSphereID14 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID14);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices14), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID14 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID14);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices14), gl.STATIC_DRAW);
    vSpherePosition14 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition14);

    //normal buffer
    nBuffer14 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer14);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals14), gl.STATIC_DRAW);
    vSphereNormal14 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal14);

    // texture coordinate buffer
    tBufferSphereID14 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID14);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords14), gl.STATIC_DRAW);


    //第十五个球体各参数-左手
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex15 = initSphereBuffers(gl, program, 0.245, sphereVertices15, sphereTextureCoords15, sphereIndices15, sphereNormals15);

    // color array attribute buffer
    // tBufferSphereID15 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID15);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors15), gl.STATIC_DRAW);
    // vSphereColor15 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor15);

    // array element buffer
    iBufferSphereID15 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID15);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices15), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID15 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID15);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices15), gl.STATIC_DRAW);
    vSpherePosition15 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition15);

    //normal buffer
    nBuffer15 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer15);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals15), gl.STATIC_DRAW);
    vSphereNormal15 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal15);

    // texture coordinate buffer
    tBufferSphereID15 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID15);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords15), gl.STATIC_DRAW);

    //第十六个球体各参数-右手
    var colorsVec4 = vec4(1.0, 246/255, 93/255, 1.0);
    numSphereVertex16 = initSphereBuffers(gl, program, 0.245, sphereVertices16, sphereTextureCoords16, sphereIndices16, sphereNormals16);

    // color array attribute buffer
    // tBufferSphereID16 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID16);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors16), gl.STATIC_DRAW);
    // vSphereColor16 = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vSphereColor16);

    // array element buffer
    iBufferSphereID16 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID16);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices16), gl.STATIC_DRAW);

    //vertex buffer
    vBufferSphereID16 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID16);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices16), gl.STATIC_DRAW);
    vSpherePosition16 = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vSpherePosition16);

    //normal buffer
    nBuffer16 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer16);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals16), gl.STATIC_DRAW);
    vSphereNormal16 = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vSphereNormal16);

    // texture coordinate buffer
    tBufferSphereID16 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID16);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTextureCoords16), gl.STATIC_DRAW);


    // //第十七个球体各参数-银子
    // var colorsVec4 = vec4(192/255, 192/255, 192/255, 1.0);
    // //numSphereVertex17 = initSphereBuffers(gl, program, 0.245, sphereVertices17, sphereColors17, sphereIndices17, colorsVec4);
    //
    // // color array attribute buffer
    // // tBufferSphereID17 = gl.createBuffer();
    // // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID17);
    // // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereColors17), gl.STATIC_DRAW);
    // // vSphereColor17 = gl.getAttribLocation(program, "vColor");
    // // gl.enableVertexAttribArray(vSphereColor17);
    //
    // // array element buffer
    // iBufferSphereID17 = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID17);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereIndices17), gl.STATIC_DRAW);
    //
    // //vertex buffer
    // vBufferSphereID17 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID17);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices17), gl.STATIC_DRAW);
    // vSpherePosition17 = gl.getAttribLocation(program, "vPosition");
    // gl.enableVertexAttribArray(vSpherePosition17);
    //
    // //normal buffer
    // nBuffer17 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer17);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereNormals17), gl.STATIC_DRAW);
    // vSphereNormal17 = gl.getAttribLocation( program, "vNormal" );
    // gl.enableVertexAttribArray(vSphereNormal17);


    //圆台各参数
    // var torusData = torus(20, 55, 0.5, 0.5);
    // torusVertices = torusData[0];
    // torusColors = torusData[1];
    // torusIndices = torusData[2];
    // numTorusVertex = torusIndices.length;

    // color array attribute buffer
    // cBufferTorusID = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTorusID);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(torusColors), gl.STATIC_DRAW);
    // vTorusColor = gl.getAttribLocation(program, "vColor");
    // gl.enableVertexAttribArray(vTorusColor);

    // array element buffer
    iBufferTorusID = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferTorusID);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(torusIndices), gl.STATIC_DRAW);

    //vertex buffer
    vBufferTorusID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTorusID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torusVertices), gl.STATIC_DRAW);
    vTorusPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vTorusPosition);

    //normal buffer
    nBufferTorusID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBufferTorusID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(torusNormals), gl.STATIC_DRAW);
    vTorusNormal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray(vTorusNormal);

    //获得模型视图矩阵和投影矩阵的位置
    CurModelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    CurProjectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");


    //event listeners for buttons

    document.getElementById("AntiRotate").onclick = function() {
        RotateAngle -= 5;
    };
    document.getElementById("ClockRotate").onclick = function() {
        RotateAngle += 5;
    };
    document.getElementById("IncreaseZ").onclick = function(){
        near  *= 1.1;
        far *= 1.1;
    };
    document.getElementById("DecreaseZ").onclick = function(){
        near *= 0.9;
        far *= 0.9;
    };
    document.getElementById("IncreaseR").onclick = function(){
        radius += 0.5;
    };
    document.getElementById("DecreaseR").onclick = function(){
        radius -= 0.5;
    };
    document.getElementById("IncreaseTheta").onclick = function(){
        theta += dr;
    };
    document.getElementById("DecreaseTheta").onclick = function(){
        theta -= dr;
    };
    document.getElementById("IncreasePhi").onclick = function(){
        phi += dr;
    };
    document.getElementById("DecreasePhi").onclick = function(){
        phi -= dr;
    };

    canvas.addEventListener("mousedown", function(event){
      var x = 2*event.clientX/canvas.width-1;
      var y = 2*(canvas.height-event.clientY)/canvas.height-1;
      startMotion(x, y);
    });

    canvas.addEventListener("mouseup", function(event){
      var x = 2*event.clientX/canvas.width-1;
      var y = 2*(canvas.height-event.clientY)/canvas.height-1;
      stopMotion(x, y);
    });

    canvas.addEventListener("mousemove", function(event){

      var x = 2*event.clientX/canvas.width-1;
      var y = 2*(canvas.height-event.clientY)/canvas.height-1;
      mouseMotion(x, y);
    });

    //FCB 1210

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    projection = ortho(-1, 1, -1, 1, -100, 100);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
      flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"), materialShininess);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));


     var yellow = document.getElementById("headImage");
     configureTexture(yellow, 0);

     var red = document.getElementById("red");
     configureTexture(red, 1);

    //  var image1 = document.getElementById("texImageBackGround");
    //  configureTexture1(image1);

     render();
}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //立方体变换
    // var T = translate(-7.0, 0.0, 0.0);
    // var R = rotateY(RotateAngle);
    // CurModelViewMatrix = mult(T, R);
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));

    // //立方体颜色
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBufferCubeID);
    // gl.vertexAttribPointer(vCubeColor, 4, gl.FLOAT, false, 0, 0);
    // //立方体顶点
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferCubeID);
    // gl.vertexAttribPointer(vCubePosition, 3, gl.FLOAT, false, 0, 0);
    // //立方体索引
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferCubeID);

    // //绘制立方体
    // gl.drawElements(gl.TRIANGLES, numCubeVertex, gl.UNSIGNED_BYTE, 0);


    //四面体变换
    // T = translate(TetraTx, 0.0, 0.0);
    // R = rotateY(TetraRotateAngle);
    // CurModelViewMatrix = mult(T, R);
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));

    //四面体颜色
    //gl.bindBuffer(gl.ARRAY_BUFFER, cBufferTetraID);
    //gl.vertexAttribPointer(vTetraColor, 4, gl.FLOAT, false, 0, 0);
    //四面体顶点
    //gl.bindBuffer(gl.ARRAY_BUFFER, vBufferTetraID);
    //gl.vertexAttribPointer(vTetraPosition, 3, gl.FLOAT, false, 0, 0);

    //绘制四面体
    //gl.drawArrays(gl.TRIANGLES, 0, vertices_tetrahedron.length);


    //对eye的值进行计算
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius * Math.cos(theta));

    //虚拟跟踪球实现代码
    if(trackballMove) {
        eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    }


    //初始化模型视图矩阵和投影矩阵
    CurModelViewMatrix = lookAt(eye, at, up);
    CurProjectionMatrix = perspective(fovy, aspect, near, far);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];

    //头的下部分球 head bottom sphere
    var RY = rotateY(RotateAngle);
    var T = translate(0, 0.2, 0);
    var S = scalem(0.68, 0.41, 0.55);
    CurConversionMatrix = mult(RY,mult(T, S));
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix4fv(CurProjectionMatrixLoc, false, flatten(CurProjectionMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord1);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID1);
    gl.vertexAttribPointer(vSphereTextureCoord1, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID1);
    gl.vertexAttribPointer(vSpherePosition1, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer1);
    gl.vertexAttribPointer(vSphereNormal1, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID1);

    gl.drawElements( gl.TRIANGLES, numSphereVertex1, gl.UNSIGNED_BYTE, 0 );


    //头的上部分球 head top sphere
    var RY = rotateY(RotateAngle);
    var T = translate(0, 0.3, 0);
    var S = scalem(0.6, 0.5, 0.55);
    CurConversionMatrix = mult(RY,mult(T, S));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix4fv( CurProjectionMatrixLoc, false, flatten(CurProjectionMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord2);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID2);
    gl.vertexAttribPointer(vSphereTextureCoord2, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID2);
    gl.vertexAttribPointer(vSpherePosition2, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer2);
    gl.vertexAttribPointer(vSphereNormal2, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID2);

    gl.drawElements( gl.TRIANGLES, numSphereVertex2, gl.UNSIGNED_BYTE, 0 );


    //左耳朵 left ear
    var RY = rotateY(RotateAngle);
    var T = translate(-0.53, 0.23, 0);
    var R = rotateZ(46);
    var S = scalem(0.7, 0.2, 0.2);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord3);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID3);
    gl.vertexAttribPointer(vSphereTextureCoord3, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID3);
    gl.vertexAttribPointer(vSpherePosition3, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer3);
    gl.vertexAttribPointer(vSphereNormal3, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID3);

    gl.drawElements( gl.TRIANGLES, numSphereVertex3, gl.UNSIGNED_BYTE, 0 );


    //右耳朵 right ear
    var RY = rotateY(RotateAngle);
    var T = translate(0.53, 0.23, 0);
    var R = rotateZ(-46);
    var S = scalem(0.7, 0.2, 0.2);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord4);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID4);
    gl.vertexAttribPointer(vSphereTextureCoord4, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID4);
    gl.vertexAttribPointer(vSpherePosition4, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer4);
    gl.vertexAttribPointer(vSphereNormal4, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID4);

    gl.drawElements( gl.TRIANGLES, numSphereVertex4, gl.UNSIGNED_BYTE, 0 );


    //身体竖 body main
    var RY = rotateY(RotateAngle);
    var T = translate(0, 0, 0);
    var R = rotateZ(90);
    var S = scalem(0.88, 0.52, 0.50);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord5);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID5);
    gl.vertexAttribPointer(vSphereTextureCoord5, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID5);
    gl.vertexAttribPointer(vSpherePosition5, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer5);
    gl.vertexAttribPointer(vSphereNormal5, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID5);

    gl.drawElements( gl.TRIANGLES, numSphereVertex5, gl.UNSIGNED_BYTE, 0 );


    //身体横左 body left
    var RY = rotateY(RotateAngle);
    var T = translate(-0.042, -0.09, 0);
    var R = rotateZ(0);
    var S = scalem(0.64, 0.86, 0.50);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord6);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID6);
    gl.vertexAttribPointer(vSphereTextureCoord6, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID6);
    gl.vertexAttribPointer(vSpherePosition6, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer6);
    gl.vertexAttribPointer(vSphereNormal6, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID6);

    gl.drawElements( gl.TRIANGLES, numSphereVertex6, gl.UNSIGNED_BYTE, 0 );


    //身体横右 body right
    var RY = rotateY(RotateAngle);
    var T = translate(0.042, -0.09, 0);
    var R = rotateZ(0);
    var S = scalem(0.64, 0.86, 0.50);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord7);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID7);
    gl.vertexAttribPointer(vSphereTextureCoord7, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID7);
    gl.vertexAttribPointer(vSpherePosition7, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer7);
    gl.vertexAttribPointer(vSphereNormal7, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID7);

    gl.drawElements( gl.TRIANGLES, numSphereVertex7, gl.UNSIGNED_BYTE, 0 );


    //左腮红 left blusher
    var RY = rotateY(RotateAngle);
    var T = translate(-0.145, 0.16, 0.135);
    var R = rotateZ(0);
    var S = scalem(0.13, 0.13, 0.03);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.enableVertexAttribArray(vSphereTextureCoord8);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID8);
    gl.vertexAttribPointer(vSphereTextureCoord8, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID8);
    gl.vertexAttribPointer(vSpherePosition8, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer8);
    gl.vertexAttribPointer(vSphereNormal8, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID8);

    gl.drawElements( gl.TRIANGLES, numSphereVertex8, gl.UNSIGNED_BYTE, 0 );


    //右腮红 right blusher
    var RY = rotateY(RotateAngle);
    var T = translate(0.145, 0.16, 0.135);
    var R = rotateZ(0);
    var S = scalem(0.13, 0.13, 0.03);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 1);
    gl.activeTexture(gl.TEXTURE1);
    gl.enableVertexAttribArray(vSphereTextureCoord9);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID9);
    gl.vertexAttribPointer(vSphereTextureCoord9, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID9);
    gl.vertexAttribPointer(vSpherePosition9, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer9);
    gl.vertexAttribPointer(vSphereNormal9, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID9);

    gl.drawElements( gl.TRIANGLES, numSphereVertex9, gl.UNSIGNED_BYTE, 0 );


    //嘴巴 mouth
    // var RY = rotateY(RotateAngle);
    // var T = translate(0, 0.18, 0.19);
    // var R = rotateZ(0);
    // var S = scalem(0.15, 0.2, 0.03);
    // CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID10);
    // gl.vertexAttribPointer(vSphereColor10, 4, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID10);
    // gl.vertexAttribPointer(vSpherePosition10, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer10);
    // gl.vertexAttribPointer(vSphereNormal10, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID10);
    //
    // gl.drawElements( gl.TRIANGLES, numSphereVertex10, gl.UNSIGNED_BYTE, 0 );


    //左眼睛 left eye
    // var RY = rotateY(RotateAngle);
    // var T = translate(-0.09, 0.29, 0.18);
    // var R = rotateZ(0);
    // var S = scalem(0.15, 0.15, 0.03);
    // CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID11);
    // gl.vertexAttribPointer(vSphereColor11, 4, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID11);
    // gl.vertexAttribPointer(vSpherePosition11, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer11);
    // gl.vertexAttribPointer(vSphereNormal11, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID11);
    //
    // gl.drawElements( gl.TRIANGLES, numSphereVertex11, gl.UNSIGNED_BYTE, 0 );


    //右眼睛 right eye
    // var RY = rotateY(RotateAngle);
    // var T = translate(0.09, 0.29, 0.18);
    // var R = rotateZ(0);
    // var S = scalem(0.15, 0.15, 0.03);
    // CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID12);
    // gl.vertexAttribPointer(vSphereColor12, 4, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID12);
    // gl.vertexAttribPointer(vSpherePosition12, 3, gl.FLOAT, false, 0, 0);
    //1
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer12);
    // gl.vertexAttribPointer(vSphereNormal12, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID12);
    //
    // gl.drawElements( gl.TRIANGLES, numSphereVertex12, gl.UNSIGNED_BYTE, 0 );


    //左眼珠 left eyeball
    // var RY = rotateY(RotateAngle);
    // var T = translate(-0.11, 0.282, 0.19);
    // var R = rotateZ(0);
    // var S = scalem(0.05, 0.05, 0.03);
    // CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID13);
    // gl.vertexAttribPointer(vSphereColor13, 4, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID13);
    // gl.vertexAttribPointer(vSp1herePosition13, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer13);
    // gl.vertexAttribPointer(vSphereNormal13, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID13);
    //
    // gl.drawElements( gl.TRIANGLES, numSphereVertex13, gl.UNSIGNED_BYTE, 0 );


    //右眼珠 right eyeball
    // var RY = rotateY(RotateAngle);
    // var T = translate(0.07, 0.28, 0.19);
    // var R = rotateZ(0);
    // var S = scalem(0.05, 0.05, 0.03);
    // CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID14);
    // gl.vertexAttribPointer(vSphereColor14, 4, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID14);
    // gl.vertexAttribPointer(vSpherePosition14, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer14);
    // gl.vertexAttribPointer(vSphereNormal14, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID14);
    //
    // gl.drawElements( gl.TRIANGLES, numSphereVertex14, gl.UNSIGNED_BYTE, 0 );


    //左手 left hand
    var RY = rotateY(-20+RotateAngle);
    var T = translate(-0.18, -0.09, 0);
    var R = rotateZ(30);
    var S = scalem(0.6, 0.18, 0.2);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord15);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID15);
    gl.vertexAttribPointer(vSphereTextureCoord15, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID15);
    gl.vertexAttribPointer(vSpherePosition15, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer15);
    gl.vertexAttribPointer(vSphereNormal15, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID15);

    gl.drawElements( gl.TRIANGLES, numSphereVertex15, gl.UNSIGNED_BYTE, 0 );


    //右手 right hand
    var RY = rotateY(RotateAngle);
    var T = translate(0.16, 0.1, 0);
    var R = rotateZ(34);
    var S = scalem(0.6, 0.18, 0.2);
    CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.enableVertexAttribArray(vSphereTextureCoord16);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID16);
    gl.vertexAttribPointer(vSphereTextureCoord16, 2, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID16);
    gl.vertexAttribPointer(vSpherePosition16, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer16);
    gl.vertexAttribPointer(vSphereNormal16, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID16);

    gl.drawElements( gl.TRIANGLES, numSphereVertex16, gl.UNSIGNED_BYTE, 0 );

    //银子 silver
    // var RY = rotateY(RotateAngle);
    // var T = translate(-0.66, -0.29, 0.16);
    // var R = rotateZ(0);
    // var S = scalem(0.18, 0.18, 0.2);
    // CurConversionMatrix = mult(RY,mult(R,mult(T, S)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, tBufferSphereID17);
    // gl.vertexAttribPointer(vSphereColor17, 4, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBufferSphereID17);
    // gl.vertexAttribPointer(vSpherePosition17, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer17);
    // gl.vertexAttribPointer(vSphereNormal17, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferSphereID17);
    //
    // gl.drawElements( gl.TRIANGLES, numSphereVertex17, gl.UNSIGNED_BYTE, 0 );


    //圆台
    // var RY = rotateY(RotateAngle);
    // var T = translate(5.5, 2.52, 1.6);
    // var R = rotateZ(180);
    // var S = scalem(0.12, 0.12, 0.1);
    // //CurConversionMatrix = mult(RY,mult(S,mult(R, T)));
    // CurConversionMatrix = mult(RY,mult(R,mult(S, T)));
    // CurModelViewMatrix = lookAt(eye, at, up);
    // CurModelViewMatrix = mult(CurModelViewMatrix ,CurConversionMatrix);
    // normalMatrix = [
    //     vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
    //     vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
    //     vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    // ];
    // gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
    //
    // gl.bindBuffer( gl.ARRAY_BUFFER, cBufferTorusID);
    // gl.vertexAttribPointer( vTorusColor, 4, gl.FLOAT, false, 0, 0 );
    //
    // gl.bindBuffer( gl.ARRAY_BUFFER, vBufferTorusID);
    // gl.vertexAttribPointer( vTorusPosition, 3, gl.FLOAT, false, 0, 0 );
    //
    // gl.bindBuffer(gl.ARRAY_BUFFER, nBufferTorusID);
    // gl.vertexAttribPointer(vTorusNormal, 3, gl.FLOAT, false, 0, 0);
    //
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferTorusID);
    //
    // gl.drawElements( gl.TRIANGLES, numTorusVertex, gl.UNSIGNED_BYTE, 0 );

    requestAnimFrame(render);
}

//画球函数
function initSphereBuffers(gl, program, radius, spherePositions, sphereTextureCoords, sphereIndices, sphereNormals) { // Create a sphere
    var latitudeBands = 15;
    var longitudeBands = 15;

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

        sphereNormals.push(x);
        sphereNormals.push(y);
        sphereNormals.push(z);
        sphereTextureCoords.push(u);
        sphereTextureCoords.push(v);
        spherePositions.push(radius * x);
        spherePositions.push(radius * y);
        spherePositions.push(radius * z);
      }
    }

    // Now that we have the vertices, we need to stitch them together by generating a list of vertex indices
    // that contains sequences of six values, each representing a square expressed as a pair of triangles.
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        sphereIndices.push(first);
        sphereIndices.push(second);
        sphereIndices.push(first + 1);

        sphereIndices.push(second);
        sphereIndices.push(second + 1);
        sphereIndices.push(first + 1);
      }
    }

    return sphereIndices.length;
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

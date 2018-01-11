"use strict";

var canvas;
var gl;
var program;

// 皮卡丘各个变量
var pHead;
var pLeftEar;
var pRightEar;
var pBody;
var pLeftArm;
var pRightArm;
var pX = 0; // 控制皮卡丘x轴方向平移距离的变量
var pY = 0; // 控制皮卡丘y轴方向平移距离的变量
var pZ = 0; // 控制皮卡丘z轴方向平移距离的变量
var pR = 0; // 控制皮卡丘自转旋转角度大小的变量
var pS = 1; // 控制皮卡丘x放大缩小倍数的变量


//  圆企鹅各个变量
var yHead;
var yBody;
var yBody;
var yLeftArm;
var yRightArm;
var yX = 0; // 控制圆企鹅x轴方向平移距离的变量
var yY = 0; // 控制圆企鹅x轴方向平移距离的变量
var yZ = 0; // 控制圆企鹅x轴方向平移距离的变量
var yR = 0; // 控制圆企鹅自转旋转角度大小的变量
var yS = 1; // 控制圆企鹅x放大缩小倍数的变量

var pBulb;
var ground;
var leftPlatform;
var rightPlatform;


// 皮卡丘“十万伏特”绝招的相关变量
var bulbRotate1 = true;
var attack = false;
var rotateSpeed = 0.025;//光源转速
var bulbT1 = 0;
var bulbT2 = 0;
var speed = 0; //十万伏特旋转速度
var attackX = -3;//十万伏特中心坐标
var attackY = 0;


// 相机的相关属性变量
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var near = 0.3;
var far = 70.0;
var distance = 16.0; // 照相机到物体的距离
var theta  = 0.1745;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio


// 视图变换、物体运动所涉及的变换矩阵变量
var modelViewMatrix = mat4(); //当前变换矩阵
var projectionMatrix = mat4(); //当前投影矩阵
var conversionMatrix = mat4(); //当前变换矩阵
var modelViewMatrixLoc; //shader 变量
var projectionMatrixLoc; //shader 变量
var normalMatrix;
var normalMatrixLoc;
var projection;


// 光相关属性变量
var lightPosition = vec4(0.0, 3.0, 0, 0.0);
var lightAmbient = vec4(1, 1, 1, 1.0);//环境光
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);//散射光
var lightSpecular = vec4(1, 1, 1, 1.0);//反射光

var materialAmbient = vec4(1.0, 0.8, 0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 0.50;

var lightPosition2 = vec4(-3.7, 0, 0, 0.0);//十万伏特中心位置


// 虚拟跟踪球实现代码
var lastPos = [0, 0, 0];
var startX, startY;
var trackingMouse = false;
var trackballMove = false;
var angle = 0.0;
var axis = [0, 0, 1];
var rotationMatrix;


// 场景漫游判断变量
var enableWalk = false;
var distancePlus = true;
var thetaPlus = true;
var phiPlus = true;


function startMotion(x, y)
{
    trackingMouse = true;
    startX = x;
    startY = y;

    lastPos = trackballView(x, y);
    trackballMove=true;
}

function stopMotion(x, y)
{
    trackingMouse = false;
    if (startX != x || startY != y) {}
    else {
         //angle = 0.0;
         trackballMove = false;
    }
}

function mouseMotion(x, y)
{
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if(trackingMouse) {
      dx = curPos[0] - lastPos[0];
      dy = curPos[1] - lastPos[1];
      dz = curPos[2] - lastPos[2];

      if (dx || dy || dz) {
           if (dx > 0)
               theta += dr;

           if (dx < 0)
               theta -= dr;

           if (dy > 0){
              if(phi < 0)
                return;
               phi -= dr;
           }

           if (dy < 0)
               phi += dr;

           if (dz > 0) { //distance += 0.01;
           }


           if (dz < 0) { //distance -= 0.01;
           }

           lastPos[0] = curPos[0];
           lastPos[1] = curPos[1];
           lastPos[2] = curPos[2];
      }
    }
    // render();
}

function trackballView(x, y) {
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

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width/canvas.height;
    gl.clearColor(0.1, 0.1, 0.6, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // 皮卡丘头部
    pHead = new Sphere(0.9, 1, 1);
    pHead.createSphere();
    pHead.initBuffer(gl);

    // 皮卡丘左耳朵
    pLeftEar = new Sphere(0.24, 0.85, 0.24);
    pLeftEar.createSphere();
    pLeftEar.initBuffer(gl);

    // 皮卡丘右耳朵
    pRightEar = new Sphere(0.24, 0.85, 0.24);
    pRightEar.createSphere();
    pRightEar.initBuffer(gl);

    // 皮卡丘身体
    pBody = new Sphere(0.75, 1.0, 0.85);
    pBody.createSphere();
    pBody.initBuffer(gl);

    // 皮卡丘左手
    pLeftArm = new Sphere(0.85, 0.35, 0.20);
    pLeftArm.createSphere();
    pLeftArm.initBuffer(gl);

    // 皮卡丘右手
    pRightArm = new Sphere(0.85, 0.35, 0.20);
    pRightArm.createSphere();
    pRightArm.initBuffer(gl);

    //光源
    pBulb = new Sphere(0.3,0.3,0.3);
    pBulb.createSphere();
    pBulb.initBuffer(gl);

    // 圆企鹅头部
    yHead = new Sphere(1, 0.9, 1);
    yHead.createSphere();
    yHead.initBuffer(gl);

    // 圆企鹅身体
    yBody = new Sphere(0.75, 0.9, 0.80);
    yBody.createSphere();
    yBody.initBuffer(gl);

    // 圆企鹅左手
    yLeftArm = new Sphere(0.64, 0.35, 0.20);
    yLeftArm.createSphere();
    yLeftArm.initBuffer(gl);

    // 圆企鹅右手
    yRightArm = new Sphere(0.64, 0.35, 0.20);
    yRightArm.createSphere();
    yRightArm.initBuffer(gl);

    // 地板
    ground = new Cube(120);
    ground.createCube();
    ground.initBuffer(gl);

    // 左平台
    leftPlatform = new Cube(3);
    leftPlatform.createCube();
    leftPlatform.initBuffer(gl);

    // 右平台
    rightPlatform = new Cube(3);
    rightPlatform.createCube();
    rightPlatform.initBuffer(gl);


    //获得模型视图矩阵和投影矩阵的位置
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

    // 调用事件监听函数，监听所有HTML控件触发产生的事件
    eventListen();

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
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    // 图片的分配、纹理的设置：
    texturesDistribute();
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    freeWalk(enableWalk);

    //对eye的值进行计算
    eye = vec3(distance * Math.sin(theta) * Math.cos(phi), distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(theta));
    //虚拟跟踪球实现代码
    if(trackballMove) {
        eye = vec3(distance * Math.sin(theta) * Math.cos(phi),
        distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(theta));
    }

    //初始化模型视图矩阵和投影矩阵dinglixiangzhu
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    // 皮卡丘的渲染工作
    renderPikachu();
    // 圆企鹅的渲染工作
    renderPiplup();
    // 其他物体的绘制工作
    renderOthers();

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    requestAnimFrame(render);
}


/**
 *  分配所有图片资源给对应的纹理
 *  然后交于configureTexture() 进行配置
 *  将图片与纹理唯一标识号id绑定
 */
function texturesDistribute() {
  var pHeadImg = document.getElementById("pHeadImg");
  configureTexture(pHeadImg, 0);

  var pEarImg = document.getElementById("pEarImg");
  configureTexture(pEarImg, 1);

  var pBodyImg = document.getElementById("pBodyImg");
  configureTexture(pBodyImg, 2);

  var pSkinImg = document.getElementById("pSkinImg");
  configureTexture(pSkinImg, 3);

  var yHeadImg = document.getElementById("yHeadImg");
  configureTexture(yHeadImg, 4);

  var yBodyImg = document.getElementById("yBodyImg");
  configureTexture(yBodyImg, 5);

  var ySkinImg = document.getElementById("ySkinImg");
  configureTexture(ySkinImg, 6);

  var glassImg = document.getElementById("glassImg");
  configureTexture(glassImg, 7);

  var woodImg = document.getElementById("woodImg");
  configureTexture(woodImg, 8);
}


/**
 * 相机漫游实现函数
 * @param  {[type]} enableWalk  判定漫游功能是否启动
 */
function freeWalk(enableWalk) {
  if(enableWalk) {
    if(distancePlus) {
      if(distance <= 21)
        distance += 0.001;
      else {
        distancePlus = false;
        distance -= 0.001;
      }
    }
    else {
      if(distance >= 11)
        distance -= 0.001;
      else {
        distancePlus = true;
        distance += 0.001;
      }
    }

    if(thetaPlus) {
      if(theta <= Math.PI)
        theta += Math.PI / 1800;
      else {
        thetaPlus = false;
        theta -= Math.PI / 1800;
      }
    }
    else {
      if(theta > 0)
        theta -= Math.PI / 1800;
      else {
        thetaPlus = true;
        theta += Math.PI / 1800;
      }
    }

    if(phiPlus) {
      if(phi < Math.PI)
        phi += Math.PI / 1500;
      else {
        phiPlus = false;
        phi -= Math.PI / 1500;
      }
    }
    else {
      if(phi > 0)
        phi -= Math.PI / 1500;
      else {
        phiPlus = true;
        phi += Math.PI / 1500;
      }
    }
  }
}


/**
 * 皮卡丘整体的渲染函数
 */
function renderPikachu() {
  // 皮卡丘头部
  var S = scalem(pS, pS, pS);
  var R = rotateY(-90 + pR);
  var T = translate((-3.5 + pX) * pS, (0.5 + pY) * pS, pZ * pS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制皮卡丘头部
  pHead.draw(gl, 0);


  // 皮卡丘左耳朵
  var S = scalem(pS, pS, pS);
  var R = mult(rotateY(pR), mult(translate(1.2 * pS, 0, 0), mult(rotateZ(55), rotateY(-120))));
  var T = translate((-3.5 + pX) * pS, (1.5 + pY) * pS, pZ * pS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix ,conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制皮卡丘左耳
  pLeftEar.draw(gl, 1);


  // 皮卡丘右耳朵
  var S = scalem(pS, pS, pS);
  var R = mult(rotateY(pR), mult(translate(-0.7 * pS, 0, 0), mult(rotateZ(-15), rotateY(-90))));
  var T = translate((-3.5 + pX) * pS, (1.9 + pY) * pS, pZ * pS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix ,conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制皮卡丘右耳
  pRightEar.draw(gl, 1);


  // 皮卡丘身体
  var S = scalem(pS, pS, pS);
  var R = rotateY(90 + pR);
  var T = translate((-3.5 + pX) * pS, (-1.2 + pY) * pS, 0 + pZ * pS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix ,conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制皮卡丘身体
  pBody.draw(gl, 2);


  // 皮卡丘左手
  var S = scalem(pS, pS, pS);
  var R = mult(rotateY(pR), mult(translate(-pS, 0, 0), mult(rotateZ(30), rotateX(-90))));
  var T = translate((-3.5 + pX) * pS, (-0.5 + pY) * pS, pZ * pS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix ,conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制皮卡丘左手
  pLeftArm.draw(gl, 3);


  // 皮卡丘右手
  var S = scalem(pS, pS, pS);
  var R = mult(rotateY(pR), mult(translate(pS, 0, 0), mult(rotateY(30), rotateX(-90))));
  var T = translate((-3.5 + pX) * pS, (-1.1 + pY) * pS, pZ * pS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix ,conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制皮卡丘右手
  pRightArm.draw(gl, 3);
}


/**
 * 圆企鹅整体的渲染函数
 * 圆企鹅的英文名为Piplup
 */
function renderPiplup() {
  // 圆企鹅头部
  var S = scalem(yS, yS, yS);
  var R = rotateY(-90 + yR);;
  var T = translate((3.5 + yX) * yS, (0.05 + yY) * yS, yZ * yS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制圆企鹅头部
  yHead.draw(gl, 4);


  // 圆企鹅身体
  var S = scalem(yS, yS, yS);
  var R = rotateY(-90 + yR);
  var T = translate((3.5 + yX) * yS, (-1.5 + yY) * yS, yZ * yS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制圆企鹅身体
  yBody.draw(gl, 5);


  // 圆企鹅左手
  var S = scalem(yS, yS, yS);
  var R = mult(rotateY(yR), mult(translate(-0.9 * yS, 0, 0.2 * yS), mult(rotateX(30), mult(rotateZ(108), rotateX(90)))));
  var T = translate((3.5 + yX) * yS, (-1.65 + yY) * yS, (0.2 + yZ) * yS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制圆企鹅左手
  yLeftArm.draw(gl, 6);


  // 圆企鹅右手
  var S = scalem(yS, yS, yS);
  var R = mult(rotateY(yR), mult(translate(yS, 0, 0), mult(rotateX(-30), mult(rotateZ(-120), rotateX(90)))));
  var T = translate((3.5 + yX) * yS, (-1.6 + yY) * yS, yZ * yS);
  // 平移矩阵、复合旋转矩阵、比例矩阵的合运算
  conversionMatrix = matricesCompute(T, R, S);
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, conversionMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制圆企鹅右手
  yRightArm.draw(gl, 6);
}


/**
 * 除皮卡丘和圆企鹅外所有物体的渲染函数
 * 包括地板（草地）、左平台、右平台、光源
 */
function renderOthers() {
  // 地板（草地）
  var transformMatrix = mult(translate(0, -64, 0), rotateY(75));
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, transformMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制地板
  ground.draw(gl, 7);


  // 左平台
  var transformMatrix = mult(translate(-3.4, -3.7, 0), rotateY(75));
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, transformMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制左平台
  leftPlatform.draw(gl, 8);


  // 右平台
  var transformMatrix = mult(translate(3.4, -3.9, 0), rotateY(84));
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, transformMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制右平台
  rightPlatform.draw(gl, 8);


  // 光源
  var T = translate(lightPosition[0], lightPosition[1], lightPosition[2]);
  if (!attack) {
      bulbT2 = 0;
      speed = 0.01;
      lightPosition2[0] = 0;
      lightPosition2[1] = 0;
      lightPosition2[2] = 0;

      if (bulbRotate1) {
          bulbT1 += rotateSpeed;
          T = translate(lightPosition[0] + 4 * Math.sin(bulbT1), lightPosition[1], lightPosition[2] + 4 * Math.cos(bulbT1));
          lightPosition[0] += 4 * Math.sin(bulbT1);
          lightPosition[2] += 4 * Math.cos(bulbT1);
          gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
          flatten(lightPosition));
          lightPosition[0] -= 4 * Math.sin(bulbT1);
          lightPosition[2] -= 4 * Math.cos(bulbT1);
      }
   }
   else {
      bulbT2 += speed;
      speed += 0.01;

      if (speed > 3) {
          lightPosition2 = vec4(lightPosition2[0] + 0.03 * speed + 2 * Math.sin(bulbT2), attackY, lightPosition2[2] + 0.03 * speed + 2 * Math.cos(bulbT2), 0.0);
          T = translate(lightPosition2[0], lightPosition2[1], lightPosition2[2]);
          gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
          flatten(lightPosition2));
      }
      else {
          lightPosition2 = vec4(attackX + 2 * Math.sin(bulbT2), attackY, 2 * Math.cos(bulbT2), 0.0);
          T = translate(lightPosition2[0], lightPosition2[1], lightPosition2[2]);
          gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
          flatten(lightPosition2));
      }
      if (speed > 4) attack = false;
  }

  var transformMatrix = mult(T, rotateY(90));
  modelViewMatrix = lookAt(eye, at, up);
  modelViewMatrix = mult(modelViewMatrix, transformMatrix);
  normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));
  // 绘制光源
  pBulb.draw(gl, 2);
}

/**
 * 对所有控件触发产生的事件进行监听
 */
function eventListen() {
  //event listeners for buttons
  document.getElementById("BulbRotate1").onclick = function () {
      if (bulbRotate1) {
        bulbRotate1 = false;
        document.getElementById("BulbRotate1").value = "光源旋转";
      }

      else {
        bulbRotate1 = true;
        ocument.getElementById("BulbRotate1").value = "停止旋转";
      }
  };

  document.getElementById("RotateSpeedUp").onclick = function () {
      rotateSpeed += 0.005;
  };

  document.getElementById("RotateSpeedDown").onclick = function () {
      rotateSpeed -= 0.005;
  };

  document.getElementById("Attack").onclick = function () {
      if (attack)
          attack = false;
      else
          attack = true;
  };

  // 对操控皮卡丘控件的事件除法进行处理：
  document.getElementById("pLeftMove").onclick = function() {
      pX -= 0.5;
  };

  document.getElementById("pRightMove").onclick = function() {
      pX += 0.5;
  };

  document.getElementById("pUpMove").onclick = function() {
      pY += 0.5;
  };

  document.getElementById("pDownMove").onclick = function() {
      pY -= 0.5;
  };

  document.getElementById("pForwardMove").onclick = function() {
      pZ += 0.5;
  };

  document.getElementById("pBackMove").onclick = function() {
      pZ -= 0.5;
  };

  document.getElementById("pLarger").onclick = function() {
      pS += 0.2;
  };

  document.getElementById("pShrink").onclick = function() {
      if(pS > 0)
        pS -= 0.2;
  };

  document.getElementById("pClockRotate").onclick = function() {
      pR += 10;
  };

  document.getElementById("pAntiClockRotate").onclick = function() {
      pR -= 10;
  };

  // 对操控圆企鹅控件的事件除法进行处理：
  document.getElementById("yLeftMove").onclick = function() {
      yX -= 0.5;
  };

  document.getElementById("yRightMove").onclick = function() {
      yX += 0.5;
  };

  document.getElementById("yUpMove").onclick = function() {
      yY += 0.5;
  };

  document.getElementById("yDownMove").onclick = function() {
      yY -= 0.5;
  };

  document.getElementById("yForwardMove").onclick = function() {
      yZ += 0.5;
  };

  document.getElementById("yBackMove").onclick = function() {
      yZ -= 0.5;
  };

  document.getElementById("yLarger").onclick = function() {
      yS += 0.2;
  };

  document.getElementById("yShrink").onclick = function() {
      if(yS > 0)
        yS -= 0.2;
  };

  document.getElementById("yClockRotate").onclick = function() {
      yR += 10;
  };

  document.getElementById("yAntiClockRotate").onclick = function() {
      yR -= 10;
  };

  document.getElementById("frontView").onclick = function() {
    theta = 0;
    phi = 0;
  };

  document.getElementById("leftView").onclick = function() {
    theta = -Math.PI / 2;
    phi = 0;
  };

  document.getElementById("rightView").onclick = function() {
    theta = Math.PI / 2;
    phi = 0;
  };

  document.getElementById("backView").onclick = function() {
    theta = Math.PI;
    phi = 0;
  };

  document.getElementById("planformView").onclick = function() {
    theta = Math.PI / 2;
    phi = Math.PI / 2;

  };

  document.getElementById("eyeForward").onclick = function() {
    distance -= 0.5;
  };

  document.getElementById("eyeBackward").onclick = function() {
    distance += 0.5;
  };

  document.getElementById("eyeFreeWalk").onclick = function() {
    enableWalk = true;
  };

  document.getElementById("eyeStopWalk").onclick = function() {
    enableWalk = false;
  };

  canvas.addEventListener("mousedown", function(evendinglixiangzhut){
    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;
    startMotion(x, y);
  });

  canvas.addEventListener("mouseup", function(event) {
    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;
    stopMotion(x, y);
  });

  canvas.addEventListener("mousemove", function(event){

    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1;
    mouseMotion(x, y);
  });
}

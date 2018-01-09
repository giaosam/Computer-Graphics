"use strict";

var canvas;
var gl;
var program;

var pHead;
var pLeftEar;
var pRightEar;
var pBody;
var pLeftArm;
var pRightArm;
var forwardX = 0;

var near = 0.3;
var far = 20.0;
var radius = 12.0; // 照相机到物体的距离
var theta = 0.1745;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

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

var lightPosition = vec4(0.0, 0.0, -1.0, 0.0);
var lightAmbient = vec4(1, 1, 1, 1.0);//环境光
var lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);//散射光
var lightSpecular = vec4(1, 1, 1, 1.0);//反射光

var materialAmbient = vec4(1.0, 0.8, 0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 0.75;

var projection;

//虚拟跟踪球实现代码
var lastPos = [0, 0, 0];
var startX, startY;
var trackingMouse = false;
var trackballMove = false;
var angle = 0.0;
var axis = [0, 0, 1];
var rotationMatrix;

function startMotion(x, y) {
    trackingMouse = true;
    startX = x;
    startY = y;

    lastPos = trackballView(x, y);
    trackballMove = true;
}

function stopMotion(x, y) {
    trackingMouse = false;
    if (startX != x || startY != y) {
    }
    else {
        //angle = 0.0;
        trackballMove = false;
    }
}

function mouseMotion(x, y) {
    var dx, dy, dz;

    var curPos = trackballView(x, y);
    if (trackingMouse) {
        dx = curPos[0] - lastPos[0];
        dy = curPos[1] - lastPos[1];
        dz = curPos[2] - lastPos[2];
        //console.log(dx,dy,dz);

        if (dx || dy || dz) {
            // angle = -0.1 * Math.sqrt(dx*dx + dy*dy + dz*dz);

            // axis[0] = lastPos[1]*curPos[2] - lastPos[2]*curPos[1];
            // axis[1] = lastPos[2]*curPos[0] - lastPos[0]*curPos[2];
            // axis[2] = lastPos[0]*curPos[1] - lastPos[1]*curPos[0];

            if (dx > 0) {
                theta += dr;
            }

            if (dx < 0) {
                theta -= dr;
            }

            if (dy > 0) {
                phi += dr;
            }

            if (dy < 0) {
                phi -= dr;
            }

            if (dz > 0) {
                //radius += 0.01;
            }

            if (dz < 0) {
                //radius -= 0.01;
            }

            lastPos[0] = curPos[0];
            lastPos[1] = curPos[1];
            lastPos[2] = curPos[2];
        }
    }

    render();
}

function trackballView(x, y) {
    var d, a;
    var v = [];

    v[0] = x;
    v[1] = y;

    d = v[0] * v[0] + v[1] * v[1];
    if (d < 4.0)
        v[2] = Math.sqrt(4.0 - d);
    else {
        v[2] = 0.0;
        a = 4.0 / Math.sqrt(d);
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
    aspect = canvas.width / canvas.height;
    gl.clearColor(0.0, 0.0, 0.0, 0.6);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // 第一个球体各参数-头部下部分的球
    pHead = new Sphere(0.9, 1, 1);
    pHead.createSphere();
    pHead.initBuffer(gl);

    //第三个球体各参数-左耳朵
    pLeftEar = new Sphere(0.24, 0.85, 0.24);
    pLeftEar.createSphere();
    pLeftEar.initBuffer(gl);

    //第四个球体各参数-右耳朵
    pRightEar = new Sphere(0.24, 0.85, 0.24);
    pRightEar.createSphere();
    pRightEar.initBuffer(gl);

    //第五个球体各参数-身体竖着的球
    pBody = new Sphere(0.75, 1.0, 0.85);
    pBody.createSphere();
    pBody.initBuffer(gl);

    //第十五个球体各参数-左手
    pLeftArm = new Sphere(0.85, 0.35, 0.20);
    pLeftArm.createSphere();
    pLeftArm.initBuffer(gl);

    //第十六个球体各参数-右手
    pRightArm = new Sphere(0.85, 0.35, 0.20);
    pRightArm.createSphere();
    pRightArm.initBuffer(gl);

    //获得模型视图矩阵和投影矩阵的位置
    CurModelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    CurProjectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");


    //event listeners for buttons

    document.getElementById("AntiRotate").onclick = function () {
        RotateAngle -= 5;
    };
    document.getElementById("ClockRotate").onclick = function () {
        RotateAngle += 5;
    };
    document.getElementById("IncreaseZ").onclick = function () {
        near *= 1.1;
        far *= 1.1;
    };
    document.getElementById("DecreaseZ").onclick = function () {
        near *= 0.9;
        far *= 0.9;
    };
    document.getElementById("IncreaseR").onclick = function () {
        radius += 0.5;
    };
    document.getElementById("DecreaseR").onclick = function () {
        radius -= 0.5;
    };
    document.getElementById("IncreaseTheta").onclick = function () {
        theta += dr;
    };
    document.getElementById("DecreaseTheta").onclick = function () {
        theta -= dr;
    };
    document.getElementById("IncreasePhi").onclick = function () {
        phi += dr;
    };
    document.getElementById("DecreasePhi").onclick = function () {
        phi -= dr;
    };

    document.getElementById("LightRotate1").onclick = function () {
        //lightPosition = vec4(0, 1.0, 0, 0.0);
        lightPosition[0] += 0.2;
        if (lightPosition[0] > 1) { lightPosition[0] -= 2; }
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition));
    };

    document.getElementById("LightRotate2").onclick = function () {
        lightPosition[1] += 0.2;
        if (lightPosition[1] > 1) { lightPosition[1] -= 2; }
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition));
    };

    document.getElementById("LightRotate3").onclick = function () {
        lightPosition[2] += 0.2;
        if (lightPosition[2] > 1) { lightPosition[2] -= 2; }
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition));
    };


    canvas.addEventListener("mousedown", function (evendinglixiangzhut) {
        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        startMotion(x, y);
    });

    canvas.addEventListener("mouseup", function (event) {
        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        stopMotion(x, y);
    });

    canvas.addEventListener("mousemove", function (event) {

        var x = 2 * event.clientX / canvas.width - 1;
        var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
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


    var pHeadImg = document.getElementById("pHeadImg");
    configureTexture(pHeadImg, 0);

    var pEarImg = document.getElementById("pEarImg");
    configureTexture(pEarImg, 1);

    var pBodyImg = document.getElementById("pBodyImg");
    configureTexture(pBodyImg, 2);

    var pSkinImg = document.getElementById("pSkinImg");
    configureTexture(pSkinImg, 3);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var lighting = document.getElementById("lighting").checked;

    //对eye的值进行计算
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));

    //虚拟跟踪球实现代码
    if (trackballMove) {
        eye = vec3(radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
    }


    //初始化模型视图矩阵和投影矩阵dinglixiangzhu
    CurModelViewMatrix = lookAt(eye, at, up);
    CurProjectionMatrix = perspective(fovy, aspect, near, far);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];

    //头的下部分球 head bottom sphere
    var RY = rotateY(RotateAngle - 90);
    var T = translate(-3.5, 0.5 + forwardX, 0);
    CurConversionMatrix = mult(T, RY);
    CurModelViewMatrix = mult(CurModelViewMatrix, CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix4fv(CurProjectionMatrixLoc, false, flatten(CurProjectionMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    pHead.draw(gl, 0);


    //左耳朵 left ear
    var RY = rotateY(RotateAngle - 90);
    var T = translate(-3.5, 0.6 + forwardX, 1.5);
    var RZ = rotateZ(45);
    // var S = scalem(0.7, 0.2, 0.2);
    CurConversionMatrix = mult(T, mult(RZ, RY));
    CurConversionMatrix = mult(CurConversionMatrix, translate(1.5, 1.5, 0));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix, CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    pLeftEar.draw(gl, 1);


    //右耳朵 right ear
    var RY = rotateY(RotateAngle - 90);
    var T = translate(-3.5, 0.5 + forwardX, -1.2);
    var RZ = rotateZ(-30);
    // var S = scalem(0.7, 0.2, 0.2);
    CurConversionMatrix = mult(T, mult(RZ, RY));
    CurConversionMatrix = mult(CurConversionMatrix, translate(-1.5, 1.5, 0));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix, CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    pRightEar.draw(gl, 1);


    //身体竖 body main
    var RY = rotateY(RotateAngle + 90);
    var T = translate(-3.5, -1.2 + forwardX, 0);

    CurConversionMatrix = mult(T, RY);
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix, CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    pBody.draw(gl, 2);

    //左手 left hand
    var RX = rotateX(-90 + RotateAngle);
    var T = translate(-4.5, -0.5 + forwardX, 0);
    var RZ = rotateZ(30);
    // var S = scalem(0.6, 0.18, 0.2);
    CurConversionMatrix = mult(T, mult(RZ, RX));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix, CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    pLeftArm.draw(gl, 3);


    //右手 right hand
    var RX = rotateX(RotateAngle - 90);
    var RZ = rotateZ(0);
    var RY = rotateY(30);
    var T = translate(-2.5, -1.1 + forwardX, 0);

    // var S = scalem(0.6, 0.18, 0.2);
    CurConversionMatrix = mult(T, mult(RY, mult(RZ, RX)));
    CurModelViewMatrix = lookAt(eye, at, up);
    CurModelViewMatrix = mult(CurModelViewMatrix, CurConversionMatrix);
    normalMatrix = [
        vec3(CurModelViewMatrix[0][0], CurModelViewMatrix[0][1], CurModelViewMatrix[0][2]),
        vec3(CurModelViewMatrix[1][0], CurModelViewMatrix[1][1], CurModelViewMatrix[1][2]),
        vec3(CurModelViewMatrix[2][0], CurModelViewMatrix[2][1], CurModelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(CurModelViewMatrixLoc, false, flatten(CurModelViewMatrix));
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    // gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);
    pRightArm.draw(gl, 3);

    gl.uniform1i(gl.getUniformLocation(program, "bTexCoord"), 0);

    requestAnimFrame(render);
}

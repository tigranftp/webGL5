let gl = null;

function initWebGl(canvas) {
    gl = canvas.getContext("webgl");

    if (!gl) {
        console.log("WebGL not supported")
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
        alert("Your browser does not support WebGL");
    }

    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function loadShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error! Shader compile status ", gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Error! Link program", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.validateProgram(shaderProgram)
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
        console.error("Error! validate program", gl.getProgramInfoLog(shaderProgram));
        return;
    }

    return shaderProgram;
}

function initBuffersCube() {
    let squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    let vertices =
        [ // X, Y, Z           X, Y, Z, U, V
            // Front
            -0.5, -0.5, -0.5, 0, 0, 1, 1, 0,// 3
            -0.5, 0.5, -0.5, 0, 0, 1, 1, 1,// 1
            0.5, 0.5, -0.5, 0, 0, 1, 0, 1,// 2

            -0.5, -0.5, -0.5, 0, 0, 1, 1, 0,// 3
            0.5, 0.5, -0.5, 0, 0, 1, 0, 1,// 2
            0.5, -0.5, -0.5, 0, 0, 1, 0, 0,// 4

            // Top
            -0.5, 0.5, -0.5, 0, 1, 0, 1, 0,// 1
            -0.5, 0.5, 0.5, 0, 1, 0, 1, 1,// 5
            0.5, 0.5, 0.5, 0, 1, 0, 0, 1,// 6

            -0.5, 0.5, -0.5, 0, 1, 0, 1, 0,// 1
            0.5, 0.5, -0.5, 0, 1, 0, 0, 0,// 2
            0.5, 0.5, 0.5, 0, 1, 0, 0, 1,// 6

            // Bottom
            -0.5, -0.5, -0.5, 0, -1, 0, 1, 1,// 3
            0.5, -0.5, 0.5, 0, -1, 0, 0, 0,// 8
            0.5, -0.5, -0.5, 0, -1, 0, 0, 1, // 4

            -0.5, -0.5, -0.5, 0, -1, 0, 1, 1,// 3
            0.5, -0.5, 0.5, 0, -1, 0, 0, 0,// 8
            -0.5, -0.5, 0.5, 0, -1, 0, 1, 0, // 7

            // Left
            -0.5, -0.5, -0.5, 1, 0, 0, 0, 0,// 3
            -0.5, 0.5, -0.5, 1, 0, 0, 0, 1,// 1
            -0.5, -0.5, 0.5, 1, 0, 0, 1, 0,// 7

            -0.5, 0.5, 0.5, 1, 0, 0, 1, 1,// 5
            -0.5, 0.5, -0.5, 1, 0, 0, 0, 1, // 1
            -0.5, -0.5, 0.5, 1, 0, 0, 1, 0,// 7

            //Right
            0.5, 0.5, -0.5, -1, 0, 0, 1, 1,// 2
            0.5, -0.5, 0.5, -1, 0, 0, 0, 0,// 8
            0.5, -0.5, -0.5, -1, 0, 0, 1, 0,// 4

            0.5, 0.5, -0.5, -1, 0, 0, 1, 1,// 2
            0.5, -0.5, 0.5, -1, 0, 0, 0, 0, // 8
            0.5, 0.5, 0.5, -1, 0, 0, 0, 1,// 6

            //Back
            -0.5, 0.5, 0.5, 0, 0, -1, 0, 1,// 5
            0.5, 0.5, 0.5, 0, 0, -1, 1, 1,// 6
            -0.5, -0.5, 0.5, 0, 0, -1, 0, 0, // 7

            0.5, -0.5, 0.5, 0, 0, -1, 1, 0, // 8
            0.5, 0.5, 0.5, 0, 0, -1, 1, 1,// 6
            -0.5, -0.5, 0.5, 0, 0, -1, 0, 0,// 7
        ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}


// function setNormals() {
//     let normalsBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
//     let normals = new Float32Array([
//         // Front
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//
//         // Top
//         0, 1, 0,
//         0, 1, 0,
//         0, 1, 0,
//         0, 1, 0,
//         0, 1, 0,
//         0, 1, 0,
//
//         // Bottom
//         0, -1, 0,
//         0, -1, 0,
//         0, -1, 0,
//         0, -1, 0,
//         0, -1, 0,
//         0, -1, 0,
//
//         // Left
//         -1, 0, 0,
//         -1, 0, 0,
//         -1, 0, 0,
//         -1, 0, 0,
//         -1, 0, 0,
//         -1, 0, 0,
//
//         //Right
//         1, 0, 0,
//         1, 0, 0,
//         1, 0, 0,
//         1, 0, 0,
//         1, 0, 0,
//         1, 0, 0,
//
//         //Back
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,
//         0, 0, -1,]);
//     gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array(normals), gl.STATIC_DRAW);
// }

function enableVertexAttrib(shaderProgram, attributeName, size, stride, offset) {
    let attribLocation = gl.getAttribLocation(shaderProgram, attributeName);
    gl.vertexAttribPointer(
        attribLocation,
        size,
        gl.FLOAT,
        false,
        stride * Float32Array.BYTES_PER_ELEMENT,
        offset * Float32Array.BYTES_PER_ELEMENT
    );

    return attribLocation;
}


const angle = (degree) => {
    return degree * (Math.PI / 180);
}

function changeCoordsOfMatrix(mat4, vec3) {
    mat4[12] = vec3[0]
    mat4[13] = vec3[1]
    mat4[14] = vec3[2]
}


function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}



function registerTexture(imgSRC) {
    let texture = gl.createTexture();
    let image = new Image();
    image.onload = function () {
        handleTextureLoaded(image, texture);
    }
    image.src = imgSRC;
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.samplerUniform2 = gl.getUniformLocation(shaderProgram, "uSampler2");
    gl.uniform1i(shaderProgram.samplerUniform,  0);
    gl.uniform1i(shaderProgram.samplerUniform2,  1);
    return texture
}

function setTextures(imgSRC) {
    let texture = gl.createTexture();

    let image = new Image();
    image.onload = function () {
        handleTextureLoaded(image, texture);
       // gl.drawArrays(gl.TRIANGLES, 0, 40);
    }
    image.src = imgSRC;
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    gl.uniform1i(shaderProgram.samplerUniform,  0);
}

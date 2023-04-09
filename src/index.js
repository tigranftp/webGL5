let currentAngle = 0;
let currentAngleY = 0;

let identitiyArray = new Float32Array(16);
let identityMatrix = glMatrix.mat4.identity(identitiyArray);

let topCubeWMatx = new Float32Array(16);
let botCubeWMatx = new Float32Array(16);
let leftCubeWMatx = new Float32Array(16);
let rightCubeWMatx = new Float32Array(16);

const norm = 1;
const defaultX = 0.5;
const defaultY = -1;
const defaultZ = -1;


glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [defaultX, norm + defaultY, defaultZ]);

glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [defaultX, defaultY, defaultZ]);

glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm + defaultX, defaultY, defaultZ]);

glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [-norm + defaultX, defaultY, defaultZ]);

let canvas = document.getElementById("pedestal");
canvas.width = 1000;
canvas.height = 1000;

initWebGl(canvas);

let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
gl.useProgram(shaderProgram);


initBuffersCube()

let positionAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertPositions",
    3, 8, 0);
gl.enableVertexAttribArray(positionAttribLocationCube);


let normalLocation = enableVertexAttrib(
    shaderProgram,
    "a_normal",
    3, 8, 3);
// Включаем атрибут нормалей
gl.enableVertexAttribArray(normalLocation);

let textureCoord = enableVertexAttrib(shaderProgram, "aTextureCoord", 2, 8, 6);
gl.enableVertexAttribArray(textureCoord);
//let uSampler = gl.getUniformLocation(shaderProgram, 'uSampler');
let matWorldLocationCube = gl.getUniformLocation(shaderProgram, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgram, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgram, "mProj");
let vecColors = gl.getUniformLocation(shaderProgram, "uColors");
var lightWorldPositionLocation = gl.getUniformLocation(shaderProgram, "u_lightWorldPosition");

let worldMatrixCube = new Float32Array(16);
let viewMatrixCube = new Float32Array(16);
let projMatrixCube = new Float32Array(16);
let uColorsCube = [0.0, 0.0, 0.0]

glMatrix.mat4.identity(worldMatrixCube)
glMatrix.mat4.lookAt(viewMatrixCube, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrixCube, angle(45), canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrixCube);
gl.uniform3fv(vecColors, uColorsCube)


gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

document.addEventListener('keydown', (event) => {
    let key = event.key;
    let angleRot = 3
    let step = 0.1
    let tmpVec3 = glMatrix.vec3.create()
    let axisOfBotCube = glMatrix.vec3.create()
    switch (key) {
        case "z":
            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, leftCubeWMatx)
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(-angleRot), [0, 1, 0]);
            axisOfBotCube = glMatrix.vec3.transformMat4(glMatrix.vec3.create(), glMatrix.vec3.create(), botCubeWMatx)
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(-angleRot))
            changeCoordsOfMatrix(leftCubeWMatx, tmpVec3)

            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, rightCubeWMatx)
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(-angleRot))
            changeCoordsOfMatrix(rightCubeWMatx, tmpVec3)

            break;
        case "c":
            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, leftCubeWMatx)
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(angleRot), [0, 1, 0]);
            axisOfBotCube = glMatrix.vec3.transformMat4(glMatrix.vec3.create(), glMatrix.vec3.create(), botCubeWMatx)
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(angleRot))
            changeCoordsOfMatrix(leftCubeWMatx, tmpVec3)

            tmpVec3 = [0.0, 0.0, 0.0]
            glMatrix.vec3.transformMat4(tmpVec3, tmpVec3, rightCubeWMatx)
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.vec3.rotateY(tmpVec3, tmpVec3, axisOfBotCube, angle(angleRot))
            changeCoordsOfMatrix(rightCubeWMatx, tmpVec3)
            break
        case "a":
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(-angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(-angleRot), [0, 1, 0]);
            break
        case "d":
            glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(angleRot), [0, 1, 0]);
            glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(angleRot), [0, 1, 0]);
            break
        case "q":
            glMatrix.mat4.rotate(viewMatrixCube, viewMatrixCube, angle(-angleRot), [0, 1, 0]);
            break
        case "e":

            glMatrix.mat4.rotate(viewMatrixCube, viewMatrixCube, angle(angleRot), [0, 1, 0]);
            break
        case "w":
            glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(topCubeWMatx, topCubeWMatx, [0, 0, step]);
            break
        case "s":
            step = -0.1
            glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, [0, 0, step]);
            glMatrix.mat4.translate(topCubeWMatx, topCubeWMatx, [0, 0, step]);
            break
        case "r":
            step = 0.1
            glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, [0, step, 0]);
            glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, [0, step, 0]);
            glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, [0, step, 0]);
            glMatrix.mat4.translate(topCubeWMatx, topCubeWMatx, [0, step, 0]);
            break
        case "f":
            step = -0.1
            glMatrix.mat4.translate(leftCubeWMatx, leftCubeWMatx, [0, step, 0]);
            glMatrix.mat4.translate(botCubeWMatx, botCubeWMatx, [0, step, 0]);
            glMatrix.mat4.translate(rightCubeWMatx, rightCubeWMatx, [0, step, 0]);
            glMatrix.mat4.translate(topCubeWMatx, topCubeWMatx, [0, step, 0]);
            break
    }
}, false);

initBuffersCube()

gl.uniform3fv(lightWorldPositionLocation, [20, 30, 50]);

tex1 = registerTexture("src//img//1.png")
tex1Mat = registerTexture("src//img//ice.jpg")
tex2 = registerTexture("src//img//2.png")
tex2Mat = registerTexture("src//img//fire.jpg")
tex3 = registerTexture("src//img//3.png")
tex3Mat = registerTexture("src//img//wood.jpg")

let coefElement = document.getElementById('coef')
let coefValue = coefElement.value

let coefOfColorLocation = gl.getUniformLocation(shaderProgram, "coefOfColor");
gl.uniform1f(coefOfColorLocation, coefElement.value/100);

coefElement.addEventListener("input", () => {
    gl.uniform1f(coefOfColorLocation, coefElement.value/100);
    });

    function loop() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex1Mat);

    gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);

    gl.uniform3fv(vecColors, [1, 0.84, 0])
    glMatrix.mat4.copy(worldMatrixCube, topCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);





    glMatrix.mat4.copy(worldMatrixCube, botCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex2);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex2Mat);

    gl.uniform3fv(vecColors, [0.66, 0.66, 0.66])
    glMatrix.mat4.copy(worldMatrixCube, leftCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex3);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex3Mat);

    gl.uniform3fv(vecColors, [0.66, 0.57, 0.33])
    glMatrix.mat4.copy(worldMatrixCube, rightCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawArrays(gl.TRIANGLES, 0, 40);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

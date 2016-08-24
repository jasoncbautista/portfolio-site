// Modified slightly from webgl tutorial / class.
window.onload = function(){
  console.log('Loaded');

  var canvas = document.getElementById('canvas'),
      width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;


        (function() {
          var gl,
          shaderProgram,
          vertices,
          vertexCount = 1000,
            mouseX = 0,
              mouseY = 0;

              initGL();
              createShaders();
              createVertices();
              draw();

              canvas.addEventListener("mousemove", function(event) {
                mouseX = map(event.clientX, 0, canvas.width, -1, 1);
                mouseY = map(event.clientY, 0, canvas.height, 1, -1);
              });


              function initGL() {
                var canvas = document.getElementById("canvas");
                gl = canvas.getContext("webgl");

                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.clearColor(0.98, 0.75, 0.8, 1);
              }

              function createShaders() {
                var vertexShader = getShader(gl, "shader-vs");

                var fragmentShader = getShader(gl, "shader-fs");

                shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                gl.useProgram(shaderProgram);
              }

              function createVertices() {

                vertices = [];
                for(var i = 0; i < vertexCount; i++) {
                  vertices.push(Math.random() * 2 - 1);
                  vertices.push(Math.random() * 2 - 1);
                }

                var buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

                var coords = gl.getAttribLocation(shaderProgram, "coords");
                //gl.vertexAttrib3f(coords, 0.75, -0.5, 0.0);
                gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(coords);
                //gl.bindBuffer(gl.ARRAY_BUFFER, null);

                var pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
                gl.vertexAttrib1f(pointSize, 3);

                var color = gl.getUniformLocation(shaderProgram, "color");
                gl.uniform4f(color, 0, 0, 1, 0.5);
              }


              function draw() {
                var ratio = width / height;
                
                if( width > height){
                  ratio = height / width;
                }
                for(var i = 0; i < vertexCount * 2; i += 2) {
                  var dx = vertices[i] - mouseX,
                    dy = vertices[i + 1] - mouseY,
                      dist = Math.sqrt(dx * dx + dy * dy);
                      if(dist < 0.2) {
                        vertices[i] = mouseX + dx / dist * 0.2  ;
                        vertices[i + 1] = mouseY + dy / dist *  0.2/ratio;
                      }
                      else {
                        vertices[i] += Math.random() * 0.01 - 0.005;
                        vertices[i + 1] += Math.random() * 0.01 - 0.005;
                      }
                }
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.LINES, 0, vertexCount);

                requestAnimationFrame(draw);
              }

              function map(value, minSrc, maxSrc, minDst, maxDst) {
                return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst;
              }




              function getShader(gl, id, type) {
                var shaderScript, theSource, currentChild, shader;

                shaderScript = document.getElementById(id);

                if (!shaderScript) {
                  return null;
                }

                theSource = shaderScript.text;

                if (!type) {
                  if (shaderScript.type == "x-shader/x-fragment") {
                    type = gl.FRAGMENT_SHADER;
                  } else if (shaderScript.type == "x-shader/x-vertex") {
                    type = gl.VERTEX_SHADER;
                  } else {
                    // Unknown shader type
                    return null;
                  }
                }
                shader = gl.createShader(type);


                gl.shaderSource(shader, theSource);

                // Compile the shader program
                gl.compileShader(shader);  

                // See if it compiled successfully
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
                  alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
                  gl.deleteShader(shader);
                  return null;  
                }

                return shader;
              }



        })();
}

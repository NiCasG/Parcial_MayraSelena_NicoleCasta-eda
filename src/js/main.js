/*Author: Nicole Castañeda Garcia, Mayra Selena delgado*/
var scene = null, //Place
    camera = null, //What I see
    renderer = null, //What im going to present
    myCanvas = null, //To draw
    controls = null; // To move

    MovingCube = null,
  collidableMeshList = [];
  

  var color = new THREE.Color();

var scale = 1;
var rotSpd = 0.05;
var spd = 0.09;
var input = { left: 0, right: 0, up: 0, down: 0 };

var posX = 3;
var posY = 0.5;
var posZ = 1;

let obstacles = [];
const boxSideLength = 0.5;

    
let numOfObstacles = 30;

gameOver = 0;
end=null;
limit=3;

var obstaclesBoundingBoxes = [];

const courseLength = 100;
const gridHelperSize = courseLength * 2;

const xBoundary = 4 - (boxSideLength / 2);
const yBoundary = xBoundary / 4;
    
// Call all functions that allow to create 3D
function start3dService() {
    initScene();//Inicializar la escena-proyecto
    //createBox();
    // createCube();
    
    createPlayerMove();
    createObstacle();
    
    createFrontera();
    initializeBoxes();
    //detectCollisions();
    //checkPlayerCollision()
    //checkCollisions();
   
   animate();//Represent frame by frame
    //controls();
    
}

function initScene() { 
  //createPlayerMove();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7CDDFF);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./src/img/cielo.jpeg');
    scene.background = texture;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    camera.position.set(0,1,101);
    //camera.position.set(0, player.height, -5);
    //camera.lookAt(new THREE.Vector3(0, player.height, 0));

    //clock = new THREE.Clock();

    myCanvas = document.querySelector('.webgl'); 

    renderer = new THREE.WebGLRenderer({canvas: myCanvas});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render(scene, camera);
    document.body.appendChild( renderer.domElement );
    
    //controls = new THREE.OrbitControls(camera,renderer.domElement);
    //controls.update();
    /*window.addEventListener('resize', () => {
      let w = window.innerWidth,
          h = window.innerHeight;
      
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });*/
    //Control

    //Create grid
    // const size = 10;
    // const divisions = 10;
    const gridHelper = new THREE.GridHelper(gridHelperSize, gridHelperSize);
    // const gridHelper = new THREE.GridHelper( size, divisions, 
    //                                         0x000,//Color cruz
    //                                         0xffffff );//Color cuadriculas
    //gridHelper.visible = false;
    scene.add( gridHelper );

    //AxesHelper
     const axesHelper = new THREE.AxesHelper( 5 );
     scene.add( axesHelper );

     const AmbientLight = new THREE.AmbientLight( 0x404040, 7 ); // soft white light
     scene.add( AmbientLight );

    

const geometry = new THREE.BoxGeometry( 21, 0.5, 100 ); 
const material = new THREE.MeshStandardMaterial( {color: 0x0000ff,map: textureLoader.load ('./src/img/Agua.jpg')} ); 
const cube = new THREE.Mesh( geometry, material );
cube.position.x=0;
cube.position.y = 0; 
cube.position.z = 50; 
scene.add( cube );  



}

function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  movePlayer();
  
 collisionAnimateWin();
 collisionAnimateLose();
 //collisionAnimateBorder();
  
  checkCollisionWithObstacles();
  
}

function createFrontera(){
  const geometry1 = new THREE.BoxGeometry( 21, 100, 111 ); 
const material1 = new THREE.MeshBasicMaterial( {color: 0x0000ff} ); 
const cube1 = new THREE.Mesh( geometry1, material1 );
cube1.position.x=0;
cube1.position.y = 0; 
cube1.position.z = 50; 
scene.add( cube1 );

collidableMeshList.push(cube1);  
}

function createObstacle() {
 // const numOfObstacles = 30; // Variable global para el número de obstáculos
  const obstacleScale = 4; // Escala de los obstáculos
  const basePositionZ = 50;

  for (let i = 0; i < numOfObstacles; i++) {
    const loader = new THREE.GLTFLoader();

    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      './src/Models/OBJMTL/Rock/scene.gltf',
      function (gltf) {
        const obstacle = gltf.scene;

        // Generar coordenadas aleatorias para la posición del obstáculo
        const x = Math.random() * 20 - 10; // Rango de -5 a 5
        const y = 0.5;
        const z = basePositionZ + Math.random() * 100 - 50; // Rango de -5 a 5

        obstacle.scale.set(obstacleScale, obstacleScale, obstacleScale);
        obstacle.position.set(x, y, z);

        // Obtener el tamaño del bounding box del obstáculo
        const box = new THREE.Box3().setFromObject(obstacle);
        const size = box.getSize(new THREE.Vector3());

        // Crear un objeto bounding box para el obstáculo
        const boundingBox = new THREE.Box3(
          new THREE.Vector3(),
          new THREE.Vector3(size.x, size.y, size.z)
        );

        // Añadir la propiedad boundingBox al obstáculo
        obstacle.boundingBox = boundingBox;

        scene.add(obstacle);
        collidableMeshList1.push(obstacle);

        
        
        
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      function (error) {
        console.log('An error happened');
      }
    );
  }
}






function initializeBoxes() {
  
  const geometry = new THREE.BoxGeometry(
    xBoundary * 2,
    yBoundary * 2,
    boxSideLength
  );
  
  const material = new THREE.MeshLambertMaterial({ color: "green" });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0);
  //allObjs.push(mesh);
  scene.add(mesh);
  collidableMeshList.push(mesh);

  const boundingBox = new THREE.Box3().setFromObject(mesh);
  obstaclesBoundingBoxes.push(boundingBox);
}



function createDashboard(){
     //object

     const textureLoader = new THREE.TextureLoader();
     const geometryPlane = new THREE.PlaneGeometry(40,40,40);
    const materialPLane =new THREE.MeshStandardMaterial( {color: 0xffffff, map: textureLoader.load ('./srcParques/img/tableroUndertale.jpg')});
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
    plane = new THREE.Mesh(geometryPlane,materialPLane);
           plane.position.y=1;

           plane.rotation.x=Math.PI*1.5;
           //plane.rotation.x=Math.PI*.5;
           scene.add( plane );
           //
           const geometryPlane2 = new THREE.PlaneGeometry(30,30,30);
           const materialPLane2 =new THREE.MeshStandardMaterial( {color: 0xffffff, map: textureLoader.load ('./srcParques/img/tableroatras.jpg')});
           plane2 = new THREE.Mesh(geometryPlane2,materialPLane2);
                  plane2.position.y=1;
      
                  plane2.rotation.x=Math.PI*.5;
                  //plane.rotation.x=Math.PI*.5;
                  scene.add( plane2 );
   }


  
// }
// Función Para mover al jugador:
// ----------------------------------
function movePlayer() {
  if (input.right == 1) {
    camera.rotation.y -= rotSpd;
    MovingCube.rotation.y -= rotSpd;
  }
  if (input.left == 1) {
    camera.rotation.y += rotSpd;
    MovingCube.rotation.y += rotSpd;
  }

  if (input.up == 1) {
    camera.position.z -= Math.cos(camera.rotation.y) * spd;
    camera.position.x -= Math.sin(camera.rotation.y) * spd;

    MovingCube.position.z -= Math.cos(camera.rotation.y) * spd;
    MovingCube.position.x -= Math.sin(camera.rotation.y) * spd;
  }
  if (input.down == 1) {
    camera.position.z += Math.cos(camera.rotation.y) * spd;
    camera.position.x += Math.sin(camera.rotation.y) * spd;

    MovingCube.position.z += Math.cos(camera.rotation.y) * spd;
    MovingCube.position.x += Math.sin(camera.rotation.y) * spd;
  }
}

window.addEventListener('keydown', function (e) {
  switch (e.keyCode) {
    case 68:
      input.right = 1;
      break;
    case 65:
      input.left = 1;
      break;
    case 87:
      input.up = 1;
      break;
    case 83:
      input.down = 1;
      break;
    case 27:
      document.getElementById("blocker").style.display = 'block';
      break;
  }
});


window.addEventListener('keyup', function (e) {
  switch (e.keyCode) {
    case 68:
      input.right = 0;
      break;
    case 65:
      input.left = 0;
      break;
    case 87:
      input.up = 0;
      break;
    case 83:
      input.down = 0;
      break;
  }
});

function createPlayerMove() {
  var cubeGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.0 });
  MovingCube = new THREE.Mesh(cubeGeometry, wireMaterial);
  MovingCube.position.set(camera.position.x, camera.position.y, camera.position.z);
  scene.add(MovingCube);

  // Paso 2: Crear la textura a partir de la imagen de "Perdiste"
  var lossImage = new Image();
  lossImage.src = './src/img/LoseScreen.jpg'; // Reemplaza la ruta con la ubicación correcta de tu imagen

  // Crear la textura a partir de la imagen
  var lossTexture = new THREE.Texture(lossImage);
  lossTexture.needsUpdate = true;

  // Paso 3: Crear el material con la textura
  var lossMaterial = new THREE.MeshBasicMaterial({ map: lossTexture, transparent: true });

  // Crear un plano para mostrar la imagen de "Perdiste"
  var lossPlaneGeometry = new THREE.PlaneGeometry(200, 100); // Ajusta el tamaño del plano según tus necesidades
  var lossPlane = new THREE.Mesh(lossPlaneGeometry, lossMaterial);
  lossPlane.position.set(0, 0, -50); // Coloca el plano en frente de la cámara o en una posición adecuada
  lossPlane.visible = false; // Inicialmente oculto
  scene.add(lossPlane);
}

function initialiseTimer() {
    var sec = 0;
    function pad(val) { return val > 9 ? val : "0" + val; }
  
    setInterval(function () {
      document.getElementById("seconds").innerHTML = String(pad(++sec % 60));
      document.getElementById("minutes").innerHTML = String(pad(parseInt(sec / 60, 10)));
    }, 1000);
  }
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function playSounds(whatSound) {
    switch (whatSound) {
        case 'OnceUponATime':
            document.getElementById("myBackgroundSound").play();
            break;
    
        case 'background':
            //document.getElementById("myBackgroundSound").play();
            break;
    }
}
function go2Play() {
    document.getElementById('blocker').style.display = 'none';
    document.getElementById('cointainerOthers').style.display = 'block';
    setInterval(setTime, 1000);
    initialiseTimer();
}
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;


function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}


function collisionAnimateWin() {

  var originPoint = MovingCube.position.clone();
  for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
    var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
    var directionVector = globalVertex.sub(MovingCube.position);

    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects(collidableMeshList);
    
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      document.getElementById("end").innerHTML = end;//'toco, '+ JSON.stringify(collisionResults[0].object.name);//points;
      camera.position.set(posX, posY, posZ);
      MovingCube.position.set(posX, posY, posZ);
      // Aqui disminuir las vidas
      end = 0;
      if (end == 0) {
        document.getElementById("won").style.display = "block";
      }
    } else {
      document.getElementById().innerHTML = end; // 'no toco';  
    }
  }
}

function collisionAnimateLose() {

  var originPoint = MovingCube.position.clone();
  for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
    var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
    var directionVector = globalVertex.sub(MovingCube.position);

    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects(collidableMeshList1);
    
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      document.getElementById("bad").innerHTML = gameOver;//'toco, '+ JSON.stringify(collisionResults[0].object.name);//points;
      camera.position.set(posX, posY, posZ);
      MovingCube.position.set(posX, posY, posZ);
     
      if (gameOver == 0) {
        document.getElementById("loser").style.display = "block";
        
        //document.getElementById("cointainerOthers").style.display = "none";
      }
    } else {
      document.getElementById().innerHTML = gameOver; // 'no toco';  
    }
  }
}

/*function collisionAnimateBorder() {

  var originPoint = MovingCube.position.clone();
  for (var vertexIndex = 0; vertexIndex < MovingCube.geometry.vertices.length; vertexIndex++) {
    var localVertex = MovingCube.geometry.vertices[vertexIndex].clone();
    var globalVertex = localVertex.applyMatrix4(MovingCube.matrix);
    var directionVector = globalVertex.sub(MovingCube.position);

    var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
    var collisionResults = ray.intersectObjects(collidableMeshList);
    
    if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
      document.getElementById("border").innerHTML = limit;//'toco, '+ JSON.stringify(collisionResults[0].object.name);//points;
      camera.position.set(0,1,101);
      MovingCube.position.set(0,1,101);
      
      if (limit == 0) {
        document.getElementById("bord").style.display = "block";
        document.getElementById("cointainerOthers").style.display = "none";
      }
    } else {
      document.getElementById("lives").innerHTML = lives; // 'no toco';  
    }
  }
    }*/

console.log(THREE);

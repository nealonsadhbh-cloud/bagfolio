import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// SCENE

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf3f0ea)



// CAMERA

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(
  0,
  -0.8,
  4
)

// RENDERER

const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

renderer.outputColorSpace =
  THREE.SRGBColorSpace

document.body.appendChild(
  renderer.domElement
)

// SCROLL AREA

const scrollContainer =
  document.createElement('div')

scrollContainer.style.height =
  '500vh'

document.body.appendChild(
  scrollContainer
)

// NAME TAG

const nameTag = document.createElement('div')

nameTag.className = 'name-tag'

nameTag.innerHTML = `
  <div class="name-title">
    Sadhbh Nealon
  </div>

  <div class="name-subtitle">
    3D Design • Motion Graphics • Systems
  </div>
`

document.body.appendChild(nameTag)

const charmPrompt = document.createElement('div')

charmPrompt.innerHTML = `
  <div class="prompt-line1">
    Charmed?
  </div>
  <div class="prompt-line2">
    Click one
  </div>
`

charmPrompt.className = 'charm-prompt'

document.body.appendChild(charmPrompt)
const arHud = document.createElement('div')

arHud.className = 'ar-hud'

arHud.innerHTML = `

<div class="compass">
  N 024°
</div>

<div class="route-line"></div>

<div class="route-node node1"></div>
<div class="route-node node2"></div>
<div class="route-node node3"></div>

`

document.body.appendChild(arHud)
arHud.style.opacity = '0'

const promptStyle = document.createElement('style')

promptStyle.innerHTML = `
.ar-hud{

  position:fixed;
  inset:0;

  opacity:0;

  pointer-events:none;

  z-index:3000;

  background:
    rgba(0,0,0,.92);

  transition:
    opacity .5s ease;

}

.nav-ring{

  position:absolute;

  width:320px;
  height:320px;

  border:2px solid
  rgba(137,231,255,.18);

  border-radius:50%;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

}

.nav-arrow{

  position:absolute;

  left:50%;
  top:50%;

  transform:
    translate(-50%,-50%);

  color:#89e7ff;

  font-size:5rem;

  text-shadow:
    0 0 20px #89e7ff,
    0 0 40px #89e7ff;

}
.elevation{

  position:absolute;

  right:60px;
  top:50%;

  width:4px;
  height:180px;

  background:
  linear-gradient(
    to top,
    transparent,
    white
  );

}
.route-line{

  position:absolute;

  left:53%;
  top:34%;

  width:12px;
  height:45%;

  transform:
    rotate(11deg);

  background:
    repeating-linear-gradient(
      to bottom,
      #8fe9ff 0 24px,
      transparent 24px 42px
    );

  filter:
    drop-shadow(
      0 0 20px #8fe9ff
    );

}
    .route-node{

  position:absolute;

  width:14px;
  height:14px;

  border-radius:50%;

  background:#a8efff;

  box-shadow:
    0 0 25px #a8efff;

}

.node1{
  left:46%;
  top:72%;
}

.node2{
  left:52%;
  top:52%;
}

.node3{
  left:58%;
  top:34%;
}
.compass{

  position:absolute;

  top:55px;
  left:50%;

  transform:
    translateX(-50%);

  color:#8fe9ff;

  letter-spacing:.25em;

  font-size:1rem;

  text-shadow:
    0 0 12px #8fe9ff;

}
.name-tag{
  position:fixed;
  top:40px;
  left:40px;
  z-index:1000;
  pointer-events:none;
}

.name-title{
  font-size:1rem;
  letter-spacing:0.08em;
  color:#222;
}

.name-subtitle{
  font-size:0.75rem;
  opacity:0.5;
  margin-top:4px;
}

.charm-prompt{
  position:fixed;
  right:40px;
  bottom:40px;
  text-align:right;
  z-index:1000;
  pointer-events:none;
}

.prompt-line1{
  font-family:Georgia, serif;
  font-size:1.35rem;
  font-style:italic;
  font-weight:400;
  letter-spacing:-0.02em;
  color:#222;
  opacity:0;
}

.prompt-line2{
  margin-top:5px;
  font-size:0.72rem;
  letter-spacing:0.12em;
  color:#222;
  opacity:0;
}

.show{
  opacity:0.7;
  transition:opacity 1.5s ease;
}

.hide{
  opacity:0;
  transition:opacity 2s ease;
}
`
document.head.appendChild(promptStyle)
const promptLine1 =
  charmPrompt.querySelector('.prompt-line1')

const promptLine2 =
  charmPrompt.querySelector('.prompt-line2')

// show "Charmed?"

setTimeout(() => {
  promptLine1.classList.add('show')
}, 3000)

// show "click one"

setTimeout(() => {
  promptLine2.classList.add('show')
}, 5000)






// LIGHTS

const ambient =
  new THREE.AmbientLight(
    0xffffff,
    2
  )

scene.add(ambient)

const keyLight =
  new THREE.DirectionalLight(
    0xffffff,
    4
  )

keyLight.position.set(
  5,
  5,
  5
)

scene.add(keyLight)

// CONTROLS

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  )

controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.55


// RAYCASTER

const raycaster =
  new THREE.Raycaster()

const mouse =
  new THREE.Vector2()

// MODEL VARIABLES

let bagModel = null

let leisureClicked = false
let archiveClicked = false
let emrldClicked = false
let comhClicked = false
let subzeroClicked = false

let leisureTimer = 0
let archiveTimer = 0

let leisureCharm = null
let lockShackle = null
let zipper = null
let emrldRope = null
let carabinerParts = []


let leisureStartX = 0
let sunglassesLens = null
let sunglassesClicked = false

let trivetClicked = false
let triskeleCharm = null

let lensPulse = 0
let scrollProgress = 0
let hasScrolled = false



// LOAD MODEL


const loader =
  new GLTFLoader()
window.addEventListener(
  'wheel',
  (e) => {

    hasScrolled = true

    scrollProgress +=
      e.deltaY * 0.0015

    scrollProgress =
      THREE.MathUtils.clamp(
        scrollProgress,
        0,
        1
      )

  }
)
loader.load(

  '/bag.glb',

  (gltf) => {

    bagModel = gltf.scene

    bagModel.scale.set(
      4.5,
      4.5,
      4.5
    )

    bagModel.position.set(
  0,
  -2.6,
  0
)

    bagModel.traverse(
  (child) => {

    console.log(
      'OBJECT:',
      child.name
    )
    if (
  child.name === 'Zipper'
) {

  zipper = child

}

    if (
      child.name === 'Mesh_0005_1'
    ) {

      sunglassesLens = child

      console.log(
        'LENS MATERIAL',
        sunglassesLens.material
      )

      sunglassesLens.material.transparent =
        true

    }

    if (
      child.name === 'Mesh_1_1'
    ) {

      leisureCharm = child

      leisureStartX =
        child.position.x

    }

    if (
      child.name === 'Lock_Shackle'
    ) {

      lockShackle = child

    }

    if (
      child.name === 'Torus009' ||
      child.name === 'BézierCurve004'
    ) {

      emrldRope = child

    }

    if (
      child.name.includes('Carabiner') ||
      child.name.includes('Latch')
    ) {

      carabinerParts.push(child)

    }

    if (
      child.name === 'Triskele_2'
    ) {

      triskeleCharm = child

    }

  }
)

    scene.add(
      bagModel
    )

  },

  undefined,

  (error) => {

    console.error(
      'GLB ERROR:',
      error
    )

  }

)
// HOVER

window.addEventListener(
  'mousemove',
  (event) => {

    mouse.x =
      (event.clientX /
        window.innerWidth) *
      2 - 1

    mouse.y =
      -(event.clientY /
        window.innerHeight) *
      2 + 1

    raycaster.setFromCamera(
      mouse,
      camera
    )

    const intersects =
      raycaster.intersectObjects(
        scene.children,
        true
      )

    renderer.domElement.style.cursor =
      'default'

    if (
      intersects.length > 0
    ) {

      const object =
        intersects[0].object
      console.log(object.name)

      if (
        object.name.startsWith('Mesh_0005') ||
        object.name === 'Mesh_1_1' ||
        object.name === 'Mesh_1001' ||
        object.name === 'Lock_Shackle' ||
        object.name === 'Triskele_2' ||
        object.name === 'Тело3-1' ||
        object.name.startsWith('Mesh005') ||
        object.name.includes('Torus') ||
        object.name.includes('BézierCurve') ||
        object.name.includes('Carabiner') ||
        object.name.includes('Latch')
      ) {

        renderer.domElement.style.cursor =
          'pointer'

      }

    }

  }
)

// CLICK

window.addEventListener(
  'click',
  (event) => {

    mouse.x =
      (event.clientX /
        window.innerWidth) *
      2 -
      1

    mouse.y =
      -(event.clientY /
        window.innerHeight) *
      2 +
      1

    raycaster.setFromCamera(
      mouse,
      camera
    )

    const intersects =
      raycaster.intersectObjects(
        scene.children,
        true
      )

    if (
      intersects.length > 0
    ) {

      const object =
        intersects[0].object

      console.log(
        'CLICKED:',
        object.name
      )

      // LEISURE

      if (
        object.name ===
        'Mesh_1_1'
      ) {

        leisureClicked = true
        controls.autoRotate = false

        setTimeout(
          () => {
            window.location.href =
              '/Leisure.html'
          },
          2200
        )
      }

      // EMRLD

      if (
        object.name.includes('Torus') ||
        object.name.includes('BézierCurve')
      ) {

        emrldClicked = true
        controls.autoRotate = false

        setTimeout(
          () => {
            window.location.href =
              '/EMRLD.html'
          },
          1800
        )
      }

      // ARCHIVE

      if (
        object.name === 'Mesh_1001' ||
        object.name === 'Lock_Shackle'
      ) {

        archiveClicked = true
        controls.autoRotate = false

        setTimeout(
          () => {
            window.location.href =
              '/Archive.html'
          },
          2200
        )
      }

      // COMH

      if (
        object.name.startsWith('Mesh005')
      ) {

        comhClicked = true
        controls.autoRotate = false

        setTimeout(
          () => {
            window.location.href =
              '/Comh.html'
          },
          2200
        )
      }

      // SUBZERO
      if (
        object.name.includes('Carabiner') ||
        object.name.includes('Latch')
      ) {

        subzeroClicked = true
        controls.autoRotate = false

        setTimeout(() => {

          window.location.href =
            '/SubZero.html'

        }, 1800)

      }
      // SUNGLASSES

     if (
  object.name.startsWith('Mesh_0005')
) {

  console.log('HUD ACTIVATED')

  sunglassesClicked = true

  controls.autoRotate = false

  arHud.style.opacity = '1'

  setTimeout(() => {

    window.location.href =
      '/ARGlasses.html'

  }, 2500)

}


      // TRIVET

      if (
        object.name === 'Triskele_2' ||
        object.name === 'Тело3-1'
      ) {

        controls.autoRotate = false

        setTimeout(() => {

          window.location.href = '/Trivet.html'

        }, 1800)

      }
      // TRIVET

      if (
        object.name === 'Triskele_2' ||
        object.name === 'Тело3-1'
      ) {

        trivetClicked = true

        controls.autoRotate = false

        setTimeout(() => {

          window.location.href =
            '/Trivet.html'

        }, 1800)

      }


    }
  }
)

// ANIMATE

function animate() {

  requestAnimationFrame(
    animate
  )

  controls.update()
const p = Math.min(
  scrollProgress,
  1
)
if (!hasScrolled) {

  controls.autoRotate = true
  controls.autoRotateSpeed = 0.55

} else {

  controls.autoRotateSpeed =
    THREE.MathUtils.lerp(
      0.55,
      0,
      p
    )

}

controls.autoRotateSpeed =
  THREE.MathUtils.lerp(
    0.55,
    0,
    p
  )

if (p < 0.05) {

  controls.update()

}

if (bagModel) {

  const topViewProgress =
  THREE.MathUtils.clamp(
    (p - 0.35) / 0.35,
    0,
    1
  )
  const zoomProgress =
  THREE.MathUtils.clamp(
    (p - 0.70) / 0.15,
    0,
    1
  )

  camera.position.x = 0

  camera.position.y =

  THREE.MathUtils.lerp(
    -0.8,
    8,
    topViewProgress
  )

  +

  THREE.MathUtils.lerp(
    0,
    4,
    zoomProgress
  )

camera.position.z =

  THREE.MathUtils.lerp(
    4,
    0.02,
    topViewProgress
  )

  +

  THREE.MathUtils.lerp(
    0,
    -0.5,
    zoomProgress
  )

 camera.lookAt(
  0,
  -1.5,
  0
)

  bagModel.rotation.x =
    THREE.MathUtils.lerp(
      0,
      0.6,
      topViewProgress
    )

  bagModel.scale.setScalar(

  THREE.MathUtils.lerp(
    4.5,
    13,
    topViewProgress
  )

)

}

if (zipper) {

  const unzipProgress =
  THREE.MathUtils.clamp(
    (p - 0.85) / 0.15,
    0,
    1
  )

  zipper.position.x =
  THREE.MathUtils.lerp(
    0,
    -0.4,
    unzipProgress
  )

}

  // LEISURE

  if (
    leisureClicked
  ) {

    camera.position.z -=
      0.006

    camera.position.x +=
      0.0005

    leisureTimer += 1

    if (
      leisureCharm &&
      leisureTimer < 80
    ) {

      leisureCharm.position.x =
        leisureStartX +
        Math.sin(
          leisureTimer * 0.08
        ) *
        0.001
    }
  }

  // EMRLD

  if (
    emrldClicked
  ) {

    camera.position.z -=
      0.005

    camera.position.x +=
      0.0005

  }

  // ARCHIVE

  if (
    archiveClicked
  ) {

    camera.position.z -=
      0.005

    camera.position.x +=
      0.0005

    archiveTimer += 1

    if (
      lockShackle &&
      archiveTimer < 35
    ) {

      lockShackle.position.y +=
        0.00008

      lockShackle.rotation.z +=
        0.0008
    }
  }

  // COMH

  if (
    comhClicked
  ) {

    camera.position.z -=
      0.006

    camera.position.x -=
      0.002

    camera.position.y +=
      0.001
  }

  // SUBZERO
  if (subzeroClicked) {

    camera.position.z -= 0.003

    carabinerParts.forEach(part => {

      if (part.material) {

        part.material.emissive =
          new THREE.Color(0xffffff)

        part.material.emissiveIntensity =
          Math.sin(
            performance.now() * 0.005
          ) * 0.3 + 0.3

      }

    })

  }

  // SUNGLASSES
  if (sunglassesClicked) {

  lensPulse += 1

  camera.position.z -= 0.012

  camera.position.y -= 0.001

 }

  // TRIVET
  if (trivetClicked && triskeleCharm) {

    camera.position.z -= 0.002

    const targetRotation = 0.15

    triskeleCharm.rotation.z +=
      (targetRotation - triskeleCharm.rotation.z) * 0.08

  }
  renderer.render(
    scene,
    camera
  )

}

animate()

// RESIZE
window.addEventListener(
  'resize',
  () => {
    camera.aspect =
      window.innerWidth /
      window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )
  }
)
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'


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



// NAME TAG

const nameTag = document.createElement('div')

nameTag.className = 'name-tag'

nameTag.innerHTML = `
  <div class="name-title" style="cursor: pointer;">
    <a href="https://www.linkedin.com/in/sadhbh-nealon-7a9035161" target="_blank" style="text-decoration: none; color: inherit;">
      Sadhbh Nealon
    </a>
  </div>

  <div class="name-subtitle">
    Spatial Design • Installation • Visual Storytelling
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

<div class="route-node node1">
  <span class="route-label"><span>Base Station</span><small>2.1 km</small></span>
</div>
<div class="route-node node2">
  <span class="route-label"><span>Lift Access</span><small>320 m</small></span>
</div>
<div class="route-node node3">
  <span class="route-label"><span>Summit Route</span><small>1.4 km</small></span>
</div>

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
    rgba(0,0,0,.98);

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

  width:10px;
  height:53%;

  transform:
    rotate(11deg);

  background:
    repeating-linear-gradient(
      to bottom,
      #8fe9ff 0 14px,
      transparent 14px 34px
    );

  filter:
    drop-shadow(
      0 0 12px #8fe9ff
    );

}
    .route-node{

  position:absolute;

  width:14px;
  height:14px;

  border-radius:50%;

  background:#a8efff;

  box-shadow:
    0 0 18px #a8efff;

}

.route-node::after{

  content:"";

  position:absolute;

  left:3px;
  top:12px;

  border-left:4px solid transparent;
  border-right:4px solid transparent;
  border-top:7px solid #a8efff;

}

.route-label{

  position:absolute;

  top:11px;
  left:16px;

  display:flex;
  flex-direction:column;
  gap:3px;

  color:#b9f4ff;
  font-size:1rem;
  font-weight:600;
  line-height:1.25;
  white-space:nowrap;
  z-index:2;

}

.node1 .route-label,
.node2 .route-label{
  left:auto;
  right:20px;
  text-align:right;
}

.node3 .route-label{
  left:20px;
}

.route-label small{

  color:#8fe9ff;
  font-size:.85rem;
  font-weight:400;

}

.node1{
  left:46%;
  top:78%;
}

.node2{
  left:52%;
  top:62%;
}

.node3{
  left:58%;
  top:43%;
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

if (
  window.location.pathname === '/' ||
  window.location.pathname === '/index.html'
) {

  setTimeout(() => {
    promptLine1.classList.add('show')
  }, 3000)

  setTimeout(() => {
    promptLine2.classList.add('show')
  }, 5000)

}






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

const isKeychainMesh = (name) =>
  name === 'Mesh_1_1' ||
  name === 'Mesh_1001' ||
  name === 'Torus009' ||
  name === 'Plastic001' ||
  name === 'Plastic.001' ||
  name.startsWith('Mesh005')

// MODEL VARIABLES

let bagModel = null

let leisureClicked = false
let leisureClickedAt = 0
let archiveClicked = false
let archiveClickedAt = 0
let emrldClicked = false
let comhClicked = false
let comhClickedAt = 0
let subzeroClicked = false

let archiveTimer = 0

let leisureCharm = null
let lockShackle = null
let zipper = null
let emrldRope = null
let carabinerParts = []


const leisureSway = { value: 0 }
let sunglassesLens = null
let sunglassesClicked = false
let sunglassesClickedAt = 0

let trivetClicked = false
let triskeleCharm = null

let lensPulse = 0
let idleTime = 0



// LOAD MODEL


const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)


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
      child.name === 'Mesh_0005_1' ||
      child.name.includes('Sunglasses') && (child.name.includes('Lens') || child.isMesh)
    ) {

      if (!sunglassesLens || child.name.includes('Lens')) {
        sunglassesLens = child

        console.log(
          'LENS FOUND:',
          child.name,
          child.material
        )

        if (sunglassesLens.material) {
          sunglassesLens.material.transparent = true
        }
      }

    }

    if (child.name === 'Torus009' && child.isMesh) {
      leisureCharm = child
      child.material = child.material.clone()
      child.material.onBeforeCompile = (shader) => {
        shader.uniforms.leisureSway = leisureSway
        shader.uniforms.leisureTransform = { value: child.matrix.clone() }
        // The Leisure logo shares a mesh with other bag details.
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', `#include <common>
            uniform float leisureSway;
            uniform mat4 leisureTransform;`)
          .replace('#include <begin_vertex>', `#include <begin_vertex>
            vec3 leisurePosition = (leisureTransform * vec4(transformed, 1.0)).xyz;
            if (leisurePosition.x > 0.085 && leisurePosition.x < 0.135 &&
                leisurePosition.y > 0.12 && leisurePosition.y < 0.162) {
              transformed.x += leisureSway;
            }`)
      }
    }

    if (
  child.name === 'Тело1-1'
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
        isKeychainMesh(object.name) ||
        object.name.startsWith('Sunglasses') ||
        object.name === 'Triskele_2' ||
        object.name === 'Тело3-1' ||
        object.name === 'BézierCurve004' ||
        object.name === 'Lock_Body' ||
        object.name === 'Тело1-1'
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

      if (leisureClicked) return

      const hitPosition = bagModel.worldToLocal(intersects[0].point.clone())
      if (
        object === leisureCharm &&
        hitPosition.x > 0.085 && hitPosition.x < 0.135 &&
        hitPosition.y > 0.12 && hitPosition.y < 0.162
      ) {
        leisureClicked = true
        leisureClickedAt = performance.now()
        controls.autoRotate = false

        setTimeout(() => {
          window.location.href = '/Commercial.html'
        }, 1600)

        return
      }

      if (isKeychainMesh(object.name)) {
        console.log('COMH CLICKED - KEYCHAIN')
        comhClicked = true
        comhClickedAt = performance.now()
        controls.autoRotate = false

        setTimeout(() => {
          window.location.href = '/Comh.html'
        }, 2200)

        return
      }

      // EMRLD

      if (
        object.name === 'BézierCurve004'
      ) {

        console.log('EMRLD CLICKED - GREEN THREAD')
        emrldClicked = true
        controls.autoRotate = false

        window.location.href =
          '/ARGlasses.html#emrld'

        return
      }

      // ARCHIVE

      if (
  object.name === 'Lock_Body' ||
  object.name === 'Тело1-1'
) {

        console.log('ARCHIVE CLICKED')
        archiveClicked = true
        archiveClickedAt = performance.now()
        controls.autoRotate = false

        setTimeout(
          () => {
            window.location.href =
              '/Archive.html'
          },
          1200
        )

        return
      }

      // COMH

      if (
        object.name.startsWith('Mesh005')
      ) {

        console.log('COMH CLICKED')
        comhClicked = true
        controls.autoRotate = false

        setTimeout(
          () => {
            window.location.href =
              '/Comh.html'
          },
          2200
        )

        return
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

        return
      }
      // SUNGLASSES

      if (archiveClicked) return

      if (
  object.name.startsWith('Sunglasses')
) {

  console.log('SUNGLASSES/ARGlasses CLICKED')

  sunglassesClicked = true
  sunglassesClickedAt = performance.now()

  controls.autoRotate = false

  arHud.style.opacity = '1'

  setTimeout(() => {

    window.location.href =
      '/ARGlasses.html'

  }, 2500)

  return
}
// TRIVET - REMOVED DUPLICATE

      if (
        object.name === 'Triskele_2' ||
        object.name === 'Тело3-1'
      ) {

        trivetClicked = true

        controls.autoRotate = false

        setTimeout(() => {

          window.location.href = '/ARGlasses.html#trivet'

        }, 1800)

        return
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
controls.enabled = false

idleTime += 0.003

if (bagModel) {
  bagModel.rotation.y =
    Math.sin(idleTime) *
    (Math.PI * 0.25)
}

if (bagModel) {

  camera.position.set(
    0,
    -0.8,
    4
  )

  camera.lookAt(
    0,
    -1.5,
    0
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

    if (leisureCharm) {
      const elapsed = (performance.now() - leisureClickedAt) / 1000
      leisureSway.value = Math.sin(elapsed * 10) * Math.exp(-elapsed * 1.5) * 0.01
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
  }

  // COMH

  if (
    comhClicked
  ) {

    const elapsed = (performance.now() - comhClickedAt) / 2200
    const progress = Math.min(1, elapsed)
    const easeProgress = progress < 0.7 ? progress / 0.7 : 1

    camera.position.z -=
      0.15 * easeProgress

    camera.position.x -=
      0.04 * easeProgress

    camera.position.y +=
      0.02 * easeProgress
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
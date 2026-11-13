import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

const viewport = document.querySelector('#walkthrough-canvas')
const walkthrough = document.querySelector('.walkthrough')
const enterButton = document.querySelector('#walkthrough-enter')
const overlay = document.querySelector('#walkthrough-intro')
const status = document.querySelector('#walkthrough-status')
const artworkDialog = document.querySelector('#artwork-dialog')
const artworkDialogClose = document.querySelector('#artwork-dialog-close')
const artworkDialogImage = document.querySelector('#artwork-dialog-image')
const artworkDialogTitle = document.querySelector('#artwork-dialog-title')
const artworkDialogMeta = document.querySelector('#artwork-dialog-meta')
const artworkDialogDescription = document.querySelector('#artwork-dialog-description')
const artworkHint = document.querySelector('#walkthrough-artwork-hint')

if (artworkHint) artworkHint.hidden = true

if (viewport && walkthrough) {
  const scene = new THREE.Scene()
  const interiorBackground = new THREE.Color(0xe4e0d8)
  let exteriorSky = interiorBackground
  scene.background = interiorBackground

  const camera = new THREE.PerspectiveCamera(68, 1, 0.05, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  viewport.appendChild(renderer.domElement)

  scene.add(new THREE.HemisphereLight(0xffffff, 0x746d60, 2.2))
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
  keyLight.position.set(-5, 12, 7)
  scene.add(keyLight)

  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()
  new HDRLoader().load(
    '/kloppenheim_06_puresky_1k.hdr',
    (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping
      exteriorSky = hdrTexture
      scene.environment = pmremGenerator.fromEquirectangular(hdrTexture).texture
      scene.environmentIntensity = 0.28
      if (routeStage !== 'inside') scene.background = exteriorSky
      pmremGenerator.dispose()
    },
    undefined,
    (error) => console.error('Could not load the exterior sky HDRI:', error),
  )

  const modelRoot = new THREE.Group()
  scene.add(modelRoot)

  const raycaster = new THREE.Raycaster()
  const floorRaycaster = new THREE.Raycaster()
  const walkableMeshes = []
  const artworkMeshes = []
  const artworkNodeNames = new Set([
    'Plane002', 'Plane003', 'Plane004', 'Plane005', 'Plane006', 'Plane007',
    'Plane008', 'Plane009', 'Plane010',
    'Plane011', 'Plane013', 'Plane017', 'Plane018', 'Plane019', 'Plane021',
    'Plane020', 'Plane023', 'Plane024',
  ])
  const artworkDetails = {
    Plane002: { title: 'Shared Faces VI', artist: 'Robert Coan', year: '2026', medium: 'Giclée print (from gouache, projection, and photography)', dimensions: '29.7 × 42 cm', description: 'A portrait from the Shared Faces series.' },
    Plane003: { title: 'Shared Faces IV', artist: 'Robert Coan', year: '2026', medium: 'Giclée print (from gouache, projection, and photography)', dimensions: '29.7 × 42 cm', description: 'A portrait from the Shared Faces series.' },
    Plane004: { title: 'Shared Faces V', artist: 'Robert Coan', year: '2026', medium: 'Giclée print (from gouache, projection, and photography)', dimensions: '29.7 × 42 cm', description: 'A portrait from the Shared Faces series.' },
    Plane005: { title: 'Shared Faces III', artist: 'Robert Coan', year: '2026', medium: 'Giclée print (from gouache, projection, and photography)', dimensions: '29.7 × 42 cm', description: 'A portrait from the Shared Faces series.' },
    Plane006: { title: 'Shared Faces II', artist: 'Robert Coan', year: '2026', medium: 'Giclée print (from gouache, projection, and photography)', dimensions: '29.7 × 42 cm', description: 'A portrait from the Shared Faces series.' },
    Plane007: { title: 'Shared Faces I', artist: 'Robert Coan', year: '2026', medium: 'Giclée print (from gouache, projection, and photography)', dimensions: '29.7 × 42 cm', description: 'A portrait from the Shared Faces series.' },
    Plane008: { title: 'Tenther 2', artist: 'Sadhbh Nealon', medium: 'Oil and acrylic on wooden canvas', dimensions: '12 × 9 in', description: 'A painting from the Tenther series.' },
    Plane009: { title: 'Tenther 3', artist: 'Sadhbh Nealon', medium: 'Oil and acrylic on wooden canvas', dimensions: '12 × 9 in', description: 'A painting from the Tenther series.' },
    Plane010: { title: 'Tenther 1', artist: 'Sadhbh Nealon', medium: 'Oil and acrylic on wooden canvas', dimensions: '9 × 9 in', description: 'A painting from the Tenther series.' },
    Plane011: { title: 'Resurface 2', artist: 'Orla Lynch', year: '2026', medium: 'Acrylic and paper on canvas', dimensions: '70 × 100 cm', description: 'One of two paintings in the Resurface series.' },
    Plane013: { title: 'Resurface 1', artist: 'Orla Lynch', year: '2026', medium: 'Acrylic and paper on canvas', dimensions: '70 × 100 cm', description: 'One of two paintings in the Resurface series.' },
    Plane017: { title: 'Untitled Diptych I', artist: 'Treasa Brownlee', year: '2026', medium: 'Pen, ink, and collage on paper', dimensions: '30 × 30 cm each; 60 × 30 cm overall', description: 'The first panel of an untitled diptych.' },
    Plane018: { title: 'Untitled Diptych II', artist: 'Treasa Brownlee', year: '2026', medium: 'Pen, ink, and collage on paper', dimensions: '30 × 30 cm each; 60 × 30 cm overall', description: 'The second panel of an untitled diptych.' },
    Plane019: { title: 'Untitled', artist: 'Treasa Brownlee', year: '2026', medium: 'Pen and acrylic on paper', dimensions: '24 × 30 cm', description: 'An untitled work on paper.' },
    Plane021: { title: 'Untitled', artist: 'Treasa Brownlee', year: '2026', medium: 'Pen and acrylic on paper', dimensions: '24 × 30 cm', description: 'An untitled work on paper.' },
    Plane020: { title: 'Stones 1', year: '2026', medium: 'Print on Fabriano paper', dimensions: '32 × 25.5 cm', description: 'A print from the Stones series.' },
    Plane023: { title: 'Stones 2', year: '2026', medium: 'Print on Fabriano paper', dimensions: '29 × 23 cm', description: 'A print from the Stones series.' },
    Plane024: { title: 'Stones 3', year: '2026', medium: 'Print on Fabriano paper', dimensions: '35.5 × 24 cm', description: 'A print from the Stones series.' },
  }
  const backWallArtworkNodeNames = new Set(['Plane011', 'Plane013', 'Plane017', 'Plane018', 'Plane019', 'Plane021'])
  const portraitPlaneNames = new Set([
    'Plane002', 'Plane003', 'Plane004', 'Plane005', 'Plane006', 'Plane007',
    'Plane008', 'Plane009', 'Plane010',
  ])
  const walkwayMeshNames = new Set(['Plane031', 'Plane032'])

  const createAsphaltTexture = () => {
    const size = 256
    const gridSize = 16
    const pixels = new Uint8Array(size * size * 4)
    let seed = 84271
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0x100000000
    }
    const broadNoise = Array.from({ length: gridSize * gridSize }, random)
    const sampleBroadNoise = (x, y) => {
      const gridX = (x / size) * gridSize
      const gridY = (y / size) * gridSize
      const x0 = Math.floor(gridX)
      const y0 = Math.floor(gridY)
      const tx = gridX - x0
      const ty = gridY - y0
      const at = (sampleX, sampleY) => broadNoise[
        ((sampleY + gridSize) % gridSize) * gridSize + ((sampleX + gridSize) % gridSize)
      ]
      const top = THREE.MathUtils.lerp(at(x0, y0), at(x0 + 1, y0), tx)
      const bottom = THREE.MathUtils.lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), tx)
      return THREE.MathUtils.lerp(top, bottom, ty)
    }

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = (y * size + x) * 4
        const aggregate = random() < 0.004 ? (random() - 0.5) * 8 : 0
        const intensity = THREE.MathUtils.clamp(
          68 + (sampleBroadNoise(x, y) - 0.5) * 7 + (random() - 0.5) * 8 + aggregate,
          52,
          86,
        )
        pixels[index] = intensity
        pixels[index + 1] = intensity + 1
        pixels[index + 2] = intensity + 3
        pixels[index + 3] = 255
      }
    }

    const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.channel = 1
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    texture.needsUpdate = true
    return texture
  }

  const asphaltTexture = createAsphaltTexture()

  const createPavementTexture = () => {
    const size = 256
    const pixels = new Uint8Array(size * size * 4)
    let seed = 193417
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 0x100000000
    }

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = (y * size + x) * 4
        const edge = x < 2 || y < 2 || x >= size - 2 || y >= size - 2
        const jointShadow = (x === 2 || y === 2 || x === size - 3 || y === size - 3) ? 5 : 0
        const noise = (random() - 0.5) * 12
        const value = edge
          ? 88 + random() * 6
          : THREE.MathUtils.clamp(118 + noise - jointShadow, 90, 144)
        pixels[index] = value
        pixels[index + 1] = value
        pixels[index + 2] = value
        pixels[index + 3] = 255
      }
    }

    const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 15)
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    texture.needsUpdate = true
    return texture
  }

  const pavementTexture = createPavementTexture()

  const createArrowTarget = (label) => {
    const target = document.createElement('button')
    target.type = 'button'
    target.className = 'walkthrough-arrow-target'
    target.setAttribute('aria-label', label)
    target.hidden = true

    const mark = document.createElement('span')
    mark.className = 'walkthrough-arrow-mark'
    mark.setAttribute('aria-hidden', 'true')
    target.appendChild(mark)
    walkthrough.appendChild(target)

    return { target, mark }
  }

  const { target: arrowTarget, mark: arrowMark } = createArrowTarget('Move along the exhibition route')
  const { target: leftArrowTarget, mark: leftArrowMark } = createArrowTarget('Move left through the exhibition')
  const { target: rightArrowTarget, mark: rightArrowMark } = createArrowTarget('Move right through the exhibition')
  arrowTarget.classList.add('walkthrough-arrow-target--outside')

  const transitionCurtain = document.createElement('div')
  transitionCurtain.className = 'walkthrough-transition'
  transitionCurtain.setAttribute('aria-hidden', 'true')
  walkthrough.appendChild(transitionCurtain)

  let mixer = null
  let modelLoaded = false
  let isWalking = false
  let yaw = 0
  let pitch = 0
  let eyeHeight = 1.6
  let moveSpeed = 3.2
  let touchLookPointer = null
  let lookMoved = false
  let previousTouchX = 0
  let previousTouchY = 0
  let previousFrameTime = performance.now()
  let movementProgress = 1
  let movementDuration = 0.65
  let turnStartYaw = 0
  let turnDeltaYaw = 0
  let turningDuringMovement = false
  let galleryEntryYaw = -Math.PI / 2
  let galleryArtworkTarget = null
  let galleryRoute = null
  let pendingGalleryProgress = null
  const movementStart = new THREE.Vector3()
  const movementEnd = new THREE.Vector3()
  const routeStart = new THREE.Vector3()
  const routeForward = new THREE.Vector3(0, 0, -1)
  const routeLeft = new THREE.Vector3(-1, 0, 0)
  let galleryEntryPosition = null
  let isTransitioning = false
  let routeStage = 'street'
  let streetTurnDistance = 0

  const resize = () => {
    const { width, height } = viewport.getBoundingClientRect()
    if (!width || !height) return
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  new ResizeObserver(resize).observe(viewport)
  resize()

  const setStatus = (message) => {
    if (status) status.textContent = message
  }

  const setWalking = (walking) => {
    isWalking = walking
    if (overlay) overlay.hidden = walking
    arrowTarget.hidden = !walking || routeStage === 'inside'
    leftArrowTarget.hidden = !walking || routeStage !== 'inside'
    rightArrowTarget.hidden = !walking || routeStage !== 'inside'
    if (artworkHint) artworkHint.hidden = !walking || routeStage !== 'inside'
  }

  const enterWalkthrough = () => {
    if (!modelLoaded) return
    setWalking(true)
  }

  enterButton?.addEventListener('click', enterWalkthrough)

  renderer.domElement.addEventListener('pointerdown', (event) => {
    if (!isWalking) return
    touchLookPointer = event.pointerId
    previousTouchX = event.clientX
    previousTouchY = event.clientY
    lookMoved = false
    renderer.domElement.setPointerCapture(event.pointerId)
  })

  renderer.domElement.addEventListener('pointermove', (event) => {
    if (event.pointerId === touchLookPointer) {
      const deltaX = event.clientX - previousTouchX
      const deltaY = event.clientY - previousTouchY
      if (Math.abs(deltaX) + Math.abs(deltaY) > 2) lookMoved = true
      yaw -= deltaX * 0.006
      pitch = THREE.MathUtils.clamp(pitch - deltaY * 0.006, -1.25, 1.25)
      previousTouchX = event.clientX
      previousTouchY = event.clientY
      return
    }

    if (!isWalking || !modelLoaded) return
    const bounds = renderer.domElement.getBoundingClientRect()
    const pointer = new THREE.Vector2(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    const artworkHits = raycaster.intersectObjects(artworkMeshes, false)
    const artworkHit = routeStage === 'inside' && artworkHits.length > 0
    renderer.domElement.style.cursor = artworkHit ? 'zoom-in' : 'grab'
    
    // Highlight hovered artwork
    artworkMeshes.forEach((mesh) => {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((material) => {
        if (artworkHit && artworkHits[0].object === mesh) {
          material.emissiveIntensity = 0.4
          material.emissive?.setHex(0xffffff)
        } else {
          material.emissiveIntensity = 0
        }
      })
    })
  })

  const endLook = (event) => {
    if (event.pointerId === touchLookPointer) touchLookPointer = null
  }
  renderer.domElement.addEventListener('pointerup', endLook)
  renderer.domElement.addEventListener('pointercancel', endLook)

  artworkDialogClose?.addEventListener('click', () => artworkDialog?.close())

  const showArtworkDetails = (object) => {
    const nodeName = object.name.replace(/[^a-z0-9]/gi, '')
    const details = artworkDetails[nodeName]
    if (!details || !artworkDialog) return

    const materials = Array.isArray(object.material) ? object.material : [object.material]
    const texture = materials.map((material) => material.map).find(Boolean)
    const source = texture?.image
    if (!source) return

    const width = source.naturalWidth || source.videoWidth || source.width
    const height = source.naturalHeight || source.videoHeight || source.height
    const imageCanvas = document.createElement('canvas')
    imageCanvas.width = width
    imageCanvas.height = height
    const context = imageCanvas.getContext('2d')
    if (!context) return
    context.drawImage(source, 0, 0, width, height)

    artworkDialogImage.src = imageCanvas.toDataURL('image/png')
    artworkDialogImage.alt = details.title
    artworkDialogTitle.textContent = details.title
    artworkDialogMeta.textContent = [details.artist, details.medium, details.dimensions, details.year]
      .filter(Boolean)
      .join('  ·  ')
    artworkDialogDescription.textContent = details.description
    artworkDialog.showModal()
    artworkDialogClose?.focus()
  }

  renderer.domElement.addEventListener('click', (event) => {
    if (!isWalking || routeStage !== 'inside' || lookMoved || artworkDialog?.open) return
    const bounds = renderer.domElement.getBoundingClientRect()
    const pointer = new THREE.Vector2(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(artworkMeshes, false)[0]
    if (hit) showArtworkDetails(hit.object)
  })

  const getNavigationStep = (scale = 1) => {
    const routeProgress = (camera.position.x - routeStart.x) * routeForward.x
      + (camera.position.z - routeStart.z) * routeForward.z
    if (routeStage === 'street' && routeProgress >= streetTurnDistance - moveSpeed * 0.5) {
      routeStage = 'entrance'
    }

    let directionX = routeForward.x
    let directionZ = routeForward.z
    if (routeStage === 'entrance') {
      directionX = routeLeft.x
      directionZ = routeLeft.z
    } else if (routeStage === 'inside') {
      directionX = -Math.sin(yaw)
      directionZ = -Math.cos(yaw)
    }

    const distance = routeStage === 'inside'
      ? Math.min(moveSpeed * 0.22, 0.65) * scale
      : moveSpeed * (routeStage === 'street' ? 0.9 : 0.65) * scale
    const rightX = Math.cos(yaw)
    const rightZ = Math.sin(yaw)
    const screenX = directionX * rightX - directionZ * rightZ
    const screenForward = -directionX * Math.sin(yaw) - directionZ * Math.cos(yaw)
      const markerForwardDistance = routeStage === 'inside' ? 1.3 : moveSpeed * 0.9
      const markerDirectionX = routeStage === 'inside' ? directionX : routeForward.x
      const markerDirectionZ = routeStage === 'inside' ? directionZ : routeForward.z

    return {
      x: directionX * distance,
      z: directionZ * distance,
        markerX: markerDirectionX * markerForwardDistance,
        markerZ: markerDirectionZ * markerForwardDistance,
      screenAngle: Math.atan2(screenX, screenForward),
    }
  }

  const transitionToGallery = () => {
    if (!galleryEntryPosition || isTransitioning) return
    isTransitioning = true
    arrowTarget.disabled = true
    transitionCurtain.classList.add('is-active')

    window.setTimeout(() => {
      camera.position.copy(galleryEntryPosition)
      if (galleryArtworkTarget) {
        const viewDirection = galleryArtworkTarget.clone().sub(camera.position)
        yaw = Math.atan2(-viewDirection.x, -viewDirection.z)
        pitch = Math.atan2(viewDirection.y, Math.hypot(viewDirection.x, viewDirection.z))
      } else {
        yaw = galleryEntryYaw
        pitch = 0
      }
      camera.rotation.set(pitch, yaw, 0)
      routeStart.copy(camera.position)
      routeForward.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize()
      routeLeft.set(routeForward.z, 0, -routeForward.x).normalize()
      routeStage = 'inside'
      if (artworkHint) artworkHint.hidden = false
      arrowTarget.hidden = true
      leftArrowTarget.hidden = false
      rightArrowTarget.hidden = false
      movementStart.copy(camera.position)
      movementEnd.copy(camera.position)
      movementProgress = 1
      transitionCurtain.classList.remove('is-active')

      window.setTimeout(() => {
        isTransitioning = false
        arrowTarget.disabled = false
      }, 360)
    }, 320)
  }

  const startNavigation = () => {
    if (!isWalking || !modelLoaded || movementProgress < 1) return
    if (routeStage === 'inside') return
    if (routeStage === 'entrance') {
      transitionToGallery()
      return
    }
    const step = [1, 0.75, 0.5, 0.25]
      .map((scale) => getNavigationStep(scale))
      .find((candidate) => !blocked(candidate.x, candidate.z))
    if (!step) return

    movementStart.copy(camera.position)
    movementEnd.copy(camera.position)
    movementEnd.x += step.x
    movementEnd.z += step.z
    movementDuration = 0.65
    movementProgress = 0
  }

  arrowTarget.addEventListener('click', startNavigation)

  const getGalleryRoutePose = (routeProgress) => {
    if (!galleryRoute) return null
    const { minX, maxX, minZ, maxZ, width, depth, perimeter } = galleryRoute
    const progress = THREE.MathUtils.euclideanModulo(routeProgress, perimeter)
    let x
    let z

    if (progress < depth) {
      x = minX
      z = minZ + progress
    } else if (progress < depth + width) {
      x = minX + progress - depth
      z = maxZ
    } else if (progress < depth * 2 + width) {
      x = maxX
      z = maxZ - (progress - depth - width)
    } else {
      x = maxX - (progress - depth * 2 - width)
      z = minZ
    }

    const centerX = (minX + maxX) * 0.5
    const centerZ = (minZ + maxZ) * 0.5
    const yaw = Math.atan2(-(centerX - x), -(centerZ - z))
    return { x, z, yaw }
  }

  const navigateGallery = (side) => {
    if (!isWalking || !modelLoaded || routeStage !== 'inside' || movementProgress < 1 || !galleryRoute) return

    const stepLength = Math.min(moveSpeed * 0.32, 0.9)
    const candidates = [1, 0.75, 0.5, 0.25].map((scale) => {
      const progress = THREE.MathUtils.euclideanModulo(
        galleryRoute.progress - side * stepLength * scale,
        galleryRoute.perimeter,
      )
      const pose = getGalleryRoutePose(progress)
      return {
        progress,
        pose,
        x: pose.x - camera.position.x,
        z: pose.z - camera.position.z,
      }
    })
    const step = candidates.find((candidate) => !blocked(candidate.x, candidate.z))
    if (!step) return

    movementStart.copy(camera.position)
    movementEnd.copy(camera.position)
    movementEnd.x = step.pose.x
    movementEnd.z = step.pose.z
    turnStartYaw = yaw
    turnDeltaYaw = THREE.MathUtils.euclideanModulo(step.pose.yaw - yaw + Math.PI, Math.PI * 2) - Math.PI
    turningDuringMovement = true
    pendingGalleryProgress = step.progress
    movementDuration = 0.9
    movementProgress = 0
  }

  leftArrowTarget.addEventListener('click', () => navigateGallery(-1))
  rightArrowTarget.addEventListener('click', () => navigateGallery(1))

  const loader = new GLTFLoader()
  loader.setMeshoptDecoder(MeshoptDecoder)
  loader.load(
    '/comh-exhibition.glb',
    (gltf) => {
      const model = gltf.scene
      const bounds = new THREE.Box3().setFromObject(model)
      const size = bounds.getSize(new THREE.Vector3())
      const center = bounds.getCenter(new THREE.Vector3())
      const footprint = Math.max(size.x, size.z)

      if (!Number.isFinite(footprint) || footprint <= 0) {
        setStatus('This model has no measurable exhibition geometry.')
        return
      }

      const scale = 20 / footprint
      model.scale.setScalar(scale)
      model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
      modelRoot.add(model)
      model.updateMatrixWorld(true)

      model.traverse((object) => {
        if (!object.isMesh) return
        const nodeName = object.name.replace(/[^a-z0-9]/gi, '')
        if (artworkDetails[nodeName]) artworkMeshes.push(object)
        if (artworkNodeNames.has(nodeName)) {
          if (portraitPlaneNames.has(nodeName)) object.translateY(0.08)
          const offsetArtworkMaterial = (material) => {
            const artworkMaterial = material.clone()
            artworkMaterial.polygonOffset = true
            artworkMaterial.polygonOffsetFactor = -2
            artworkMaterial.polygonOffsetUnits = -4
            artworkMaterial.emissive = new THREE.Color(0xffffff)
            artworkMaterial.emissiveIntensity = 0
            return artworkMaterial
          }
          object.material = Array.isArray(object.material)
            ? object.material.map(offsetArtworkMaterial)
            : offsetArtworkMaterial(object.material)
          object.renderOrder = 5
        }
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        const isGroundMaterial = materials.some((material) => material.name === 'Material.038')
        if (isGroundMaterial) {
          if (!object.geometry.boundingBox) object.geometry.computeBoundingBox()
          const dimensions = object.geometry.boundingBox.getSize(new THREE.Vector3())
          const horizontalDimensions = [dimensions.x, dimensions.z].sort((a, b) => b - a)
          const isRoad = dimensions.y > 0.1 && horizontalDimensions[0] > horizontalDimensions[1] * 3
          const isWalkway = walkwayMeshNames.has(object.name) || walkwayMeshNames.has(object.geometry.name)

          if (isRoad) {
            const textureRoad = (material) => {
              const roadMaterial = material.clone()
              roadMaterial.color.set(0xffffff)
              roadMaterial.map = asphaltTexture
              roadMaterial.roughness = 0.96
              return roadMaterial
            }
            object.material = Array.isArray(object.material)
              ? object.material.map(textureRoad)
              : textureRoad(object.material)
          } else if (isWalkway) {
            const textureWalkway = (material) => {
              const walkwayMaterial = material.clone()
              walkwayMaterial.color.set(0xffffff)
              walkwayMaterial.map = pavementTexture
              walkwayMaterial.roughness = 0.94
              return walkwayMaterial
            }
            object.material = Array.isArray(object.material)
              ? object.material.map(textureWalkway)
              : textureWalkway(object.material)
          }
        }
        walkableMeshes.push(object)
        object.castShadow = true
        object.receiveShadow = true
      })

      if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model)
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play())
      }

      const normalizedHeight = size.y * scale
      const normalizedDepth = size.z * scale
      eyeHeight = THREE.MathUtils.clamp(normalizedHeight * 0.38, 1.25, 1.72)
      moveSpeed = THREE.MathUtils.clamp(footprint * scale * 0.16, 2.4, 4.2)

      let galleryFloor = null
      const backWallArtworkBounds = new THREE.Box3()
      model.traverse((object) => {
        if (!object.isMesh) return
        const nodeName = object.name.replace(/[^a-z0-9]/gi, '')
        if (nodeName === 'Plane014') galleryFloor = object
        if (backWallArtworkNodeNames.has(nodeName)) backWallArtworkBounds.expandByObject(object)
      })
      if (galleryFloor && !backWallArtworkBounds.isEmpty()) {
        const floorBounds = new THREE.Box3().setFromObject(galleryFloor)
        let galleryShell = null
        model.traverse((object) => {
          if (object.name === 'node0') galleryShell = object
        })
        const shellBounds = galleryShell
          ? new THREE.Box3().setFromObject(galleryShell)
          : new THREE.Box3().setFromObject(model)
        galleryArtworkTarget = backWallArtworkBounds.getCenter(new THREE.Vector3())
        galleryEntryPosition = new THREE.Vector3(
          backWallArtworkBounds.max.x + 0.8,
          floorBounds.max.y + 0.56,
          galleryArtworkTarget.z,
        )
        galleryEntryYaw = Math.PI / 2

        const clearance = 0.75
        const minX = Math.max(shellBounds.min.x + clearance, galleryEntryPosition.x)
        const maxX = shellBounds.max.x - clearance
        const minZ = shellBounds.min.z + clearance
        const maxZ = shellBounds.max.z - clearance
        const width = maxX - minX
        const depth = maxZ - minZ
        if (width > 1 && depth > 1) {
          galleryEntryPosition.x = minX
          galleryEntryPosition.z = THREE.MathUtils.clamp(galleryEntryPosition.z, minZ, maxZ)
          const perimeter = 2 * (width + depth)
          const progress = galleryEntryPosition.z - minZ
          galleryRoute = { minX, maxX, minZ, maxZ, width, depth, perimeter, progress }
        }
      }

      camera.position.set(0, eyeHeight, normalizedDepth * 0.42)
      camera.rotation.order = 'YXZ'
      camera.rotation.set(pitch, yaw, 0)
      routeStart.copy(camera.position)
      routeForward.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize()
      routeLeft.set(routeForward.z, 0, -routeForward.x).normalize()
      streetTurnDistance = moveSpeed * 1.25

      modelLoaded = true
      setStatus('Exhibition ready')
      if (enterButton) {
        enterButton.disabled = false
        enterButton.textContent = 'Enter exhibition'
      }
    },
    (event) => {
      if (event.total) setStatus(`Loading exhibition ${Math.round((event.loaded / event.total) * 100)}%`)
    },
    (error) => {
      console.error('Could not load the Comh exhibition model:', error)
      setStatus('The exhibition model could not be loaded. Please check the GLB file.')
      if (enterButton) enterButton.textContent = 'Model unavailable'
    },
  )

  const blocked = (stepX, stepZ) => {
    const distance = Math.hypot(stepX, stepZ)
    if (distance === 0) return false
    const origin = new THREE.Vector3(camera.position.x, eyeHeight * 0.55, camera.position.z)
    raycaster.set(origin, new THREE.Vector3(stepX, 0, stepZ).normalize())
    raycaster.far = distance + 0.2
    return raycaster.intersectObjects(walkableMeshes, false).length > 0
  }

  const floorHeightAt = (x, z) => {
    floorRaycaster.set(
      new THREE.Vector3(x, camera.position.y + 10, z),
      new THREE.Vector3(0, -1, 0),
    )
    floorRaycaster.far = 40
    const floorHit = floorRaycaster
      .intersectObjects(walkableMeshes, false)
      .find((hit) => hit.point.y <= camera.position.y + 0.15)
    return floorHit ? floorHit.point.y + 0.08 : 0.08
  }

  const projectFloorArrow = (target, mark, x, z, angle) => {
    const position = new THREE.Vector3(x, floorHeightAt(x, z), z)
    camera.updateMatrixWorld()
    const projected = position.project(camera)
    const bounds = viewport.getBoundingClientRect()
    const screenX = (projected.x * 0.5 + 0.5) * bounds.width
    const screenY = (-projected.y * 0.5 + 0.5) * bounds.height
    const onScreen = projected.z >= -1
      && projected.z <= 1
      && screenX >= 0
      && screenX <= bounds.width
      && screenY >= 0
      && screenY <= bounds.height

    target.hidden = movementProgress !== 1 || !onScreen || isTransitioning
    target.style.left = `${screenX}px`
    target.style.top = `${screenY}px`
    mark.style.transform = `translate(-50%, -50%) perspective(360px) rotateX(56deg) rotate(${angle}rad)`
  }

  const animate = () => {
    requestAnimationFrame(animate)
    const currentTime = performance.now()
    const delta = Math.min((currentTime - previousFrameTime) / 1000, 0.05)
    previousFrameTime = currentTime
    if (mixer) mixer.update(delta)

    if (isWalking && modelLoaded) {
      const currentBackground = routeStage === 'inside' ? interiorBackground : exteriorSky
      if (scene.background !== currentBackground) scene.background = currentBackground
      if (movementProgress < 1) {
        movementProgress = Math.min(movementProgress + delta / movementDuration, 1)
        const easedProgress = movementProgress * movementProgress * (3 - 2 * movementProgress)
        camera.position.lerpVectors(movementStart, movementEnd, easedProgress)
        if (turningDuringMovement) {
          yaw = turnStartYaw + turnDeltaYaw * easedProgress
          if (movementProgress === 1) {
            turningDuringMovement = false
            if (pendingGalleryProgress !== null && galleryRoute) {
              galleryRoute.progress = pendingGalleryProgress
              pendingGalleryProgress = null
            }
          }
        }
      }
      camera.rotation.set(pitch, yaw, 0)

      if (routeStage === 'inside' && galleryRoute) {
        const entranceThreshold = 0.5
        const atEntrance = galleryRoute.progress < entranceThreshold || galleryRoute.progress > galleryRoute.perimeter - entranceThreshold
        if (atEntrance) {
          routeStage = 'entrance'
          if (artworkHint) artworkHint.hidden = true
        }
      }

      if (routeStage === 'inside') {
        arrowTarget.hidden = true
        leftArrowTarget.hidden = false
        rightArrowTarget.hidden = false
        if (artworkHint) artworkHint.hidden = false
        const forwardX = -Math.sin(yaw)
        const forwardZ = -Math.cos(yaw)
        const rightX = Math.cos(yaw)
        const rightZ = -Math.sin(yaw)
        const forwardDistance = 0.7
        const sideDistance = 0.45

        projectFloorArrow(
          leftArrowTarget,
          leftArrowMark,
          camera.position.x + forwardX * forwardDistance - rightX * sideDistance,
          camera.position.z + forwardZ * forwardDistance - rightZ * sideDistance,
          -Math.PI / 2,
        )
        projectFloorArrow(
          rightArrowTarget,
          rightArrowMark,
          camera.position.x + forwardX * forwardDistance + rightX * sideDistance,
          camera.position.z + forwardZ * forwardDistance + rightZ * sideDistance,
          Math.PI / 2,
        )
      } else {
        leftArrowTarget.hidden = true
        rightArrowTarget.hidden = true
        if (artworkHint) artworkHint.hidden = true
        const step = getNavigationStep()
        projectFloorArrow(
          arrowTarget,
          arrowMark,
          camera.position.x + step.markerX,
          camera.position.z + step.markerZ,
          step.screenAngle,
        )
      }
    }

    renderer.render(scene, camera)
  }

  animate()
}

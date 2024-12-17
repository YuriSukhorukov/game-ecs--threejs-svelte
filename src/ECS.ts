import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'

export type EntityID = string

export interface Entity {
  id: EntityID
}

export interface Component<T> {
  id: EntityID
  data: T
}

const entities: Array<Entity> = []
const components: {
  move: Array<Component<any>>
  mesh: Array<Component<THREE.Mesh>>
  scene: Array<Component<THREE.Scene>>
  camera: Array<Component<THREE.Camera>>
  renderer: Array<Component<THREE.WebGLRenderer>>
  ambientLight: Array<Component<THREE.AmbientLight>>
  directionalLight: Array<Component<THREE.DirectionalLight>>
  queueAddOnScene: Array<Component<null>>
} = {
  move: [],
  mesh: [],
  scene: [],
  camera: [],
  renderer: [],
  ambientLight: [],
  directionalLight: [],
  queueAddOnScene: [],
}

// const SystemMove = () => {
//   components.move.forEach((component: Component<any>) => {
//     console.log(component.id)
//   })
// }
const SystemRender = () => {
  components.renderer[0].data.render(
    components.scene[0].data,
    components.camera[0].data
  )
}

const cube = { id: crypto.randomUUID() }
const scene = { id: crypto.randomUUID() }
const camera = { id: crypto.randomUUID() }
const renderer = { id: crypto.randomUUID() }
const ambientLight = { id: crypto.randomUUID() }
const directionalLight = { id: crypto.randomUUID() }

entities.push(scene, camera, renderer, cube)

//
//
//
//
//
// --------------------
components.scene.push({
  id: scene.id,
  data: new THREE.Scene(),
})
components.camera.push({
  id: camera.id,
  data: new THREE.PerspectiveCamera(
    75,
    2, // sizes.width / sizes.height,
    0.1,
    1000
  ),
})
// components.renderer.push({
//   id: renderer.id,
//   data: new THREE.WebGLRenderer({ canvas, antialias: true }),
// })
components.mesh.push({
  id: cube.id,
  data: new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.1, 6, 1),
    new THREE.MeshToonMaterial({ color: 0xaae06c })
  ),
})
components.queueAddOnScene.push({
  id: cube.id,
  data: null,
})

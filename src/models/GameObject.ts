import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'

// ---------------------------
const minFilter = THREE.NearestFilter
// -------------------------------------
interface GameObjectInterface {
  setShadows(params: {
    castShadow?: boolean
    receiveShadow?: boolean
  }): GameObject
}

interface GameObjectParameters {
  geometry: THREE.BufferGeometry | null
  material: THREE.Material | null
  rigidBody: RAPIER.RigidBody | null
  collider: RAPIER.Collider | null
}

export class GameObject implements GameObjectInterface {
  id: string
  mesh: THREE.Mesh | null
  rigidBody: RAPIER.RigidBody | null
  collider: RAPIER.Collider | null

  constructor(params: GameObjectParameters) {
    this.mesh = new THREE.Mesh(params.geometry, params.material)
    return this
  }

  setShadows(params: {
    castShadow?: boolean
    receiveShadow?: boolean
  }): GameObject {
    this.mesh.castShadow = params.castShadow
    this.mesh.receiveShadow = params.receiveShadow
    return this
  }
}

// const model = await loader.loadAsync('models/cube.glb')

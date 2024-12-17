import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GameObject } from './GameObject'
import * as RAPIER from '@dimforge/rapier3d'
import { RapierDebugRenderer } from '../utils/RapierDebugRenderer'
import { generateUID } from '../utils/uid'
import { PhysicsInterface, Physics } from './Phisics'
import { degToRad, radToDeg } from 'three/src/math/MathUtils'
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { init } from 'recast-navigation'
import { threeToSoloNavMesh, threeToTiledNavMesh, threeToTileCache, DebugDrawer, NavMeshHelper } from '@recast-navigation/three';
import {Vector3} from "three";

// export async function initRecastLib() {
//   await init()
// }

export enum RIGIDBODY_TYPE {
  FIXED = 'fixed',
  DYNAMIC = 'dynamic'
}

type EntityID = string
export interface EntityInterface {
  id: EntityID
  used: boolean
}

class Entity implements EntityInterface {
  id = null
  used = null
  constructor() {
    this.id = generateUID()
    this.used = true
  }
}

export interface ComponentInterface<T> {
  id: EntityID
  type: COMPONENT_TYPE
  data: T
}
class Component<T> implements ComponentInterface<T> {
  id = null
  type = null
  data = null
  constructor(id: EntityID, type: COMPONENT_TYPE, data: T) {
    this.id = id
    this.type = type
    this.data = data
  }
}

interface ComponenMove {
  velocity: THREE.Vector3
}

export enum COMPONENT_TYPE {
  OBJECT_3D = 'OBJECT_3D',
  PIVOT_3D = 'PIVOT_3D',
  RIGID_BODY = 'RIGID_BODY',
  COLLIDER = 'COLLIDER',
  RESIZE_APP_QUEUE = 'RESIZE_APP_QUEUE',
  ADD_TO_SCENE_QUEUE = 'ADD_TO_SCENE_QUEUE',
  REMOVE_FROM_SCENE_QUEUE = 'REMOVE_FROM_SCENE_QUEUE',
  SELECTED = 'SELECTED',
  CHARACTER_CONTROLLER = 'CHARACTER_CONTROLLER',
  MOVE_CHARACTER = 'MOVE_CHARACTER',
  MOVE_CHARACTER_SPEED = 'MOVE_CHARACTER_SPEED',
  FIXED_ROTATION = 'FIXED_ROTATION',
  CAMERA_TARGET = 'CAMERA_TARGET',
  CAMERA_CONTROLLER = 'CAMERA_CONTROLLER',
  MOUSE_MOVE_EVENT = 'MOUSE_MOVE_EVENT',
  ADD_MESH_TO_NAVIGATION_MESH_QUEUE = 'ADD_MESH_TO_NAVIGATION_MESH_QUEUE',
  NAVIGATION_MESH = 'NAVIGATION_MESH',
}

interface WorldInterface {
  // entitiesStorage: Array<EntityInterface>
  entitiesStorage: {
    updated: boolean
    list: Array<Entity>
    cache: { [key: EntityID]: number }
  }
  componentsStorage: {
    [key in COMPONENT_TYPE]: {
      cache: { [key: EntityID]: number }
      list: Array<ComponentInterface<any>>
    }
  }
  addEntity()
  removeEntity(entity: EntityInterface)
  addComponent<T>(
    entity: EntityInterface,
    type: COMPONENT_TYPE,
    data: T
  ): WorldInterface // : Component<T>
  replaceComponent<T>(
    entity: EntityInterface,
    type: COMPONENT_TYPE,
    data: T
  ): WorldInterface
  replaceComponentForEntity<T>(
    entity: EntityInterface,
    type: COMPONENT_TYPE,
    data: T
  ): WorldInterface
  queryComponents<T>(type: COMPONENT_TYPE): ComponentInterface<T>[] | null
  queryComponentForEntity<T>(
    entity: EntityInterface,
    type: COMPONENT_TYPE
  ): ComponentInterface<T> | null
  clearComponentsByType(type: COMPONENT_TYPE)
}
export class World implements WorldInterface {
  entitiesStorage: {
    updated: boolean
    list: Array<Entity>
    cache: { [key: EntityID]: number }
  }
  componentsTypes: Array<COMPONENT_TYPE>
  componentsStorage: {
    OBJECT_3D: {
      cache: {}
      list: ComponentInterface<THREE.Object3D>[]
    }
    PIVOT_3D: {
      cache: {}
      list: ComponentInterface<THREE.Object3D>[]
    }
    SELECTED: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    ADD_TO_SCENE_QUEUE: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    RIGID_BODY: {
      cache: {}
      list: ComponentInterface<RAPIER.RigidBody>[]
    }
    COLLIDER: {
      cache: {}
      list: ComponentInterface<RAPIER.Collider>[]
    }
    REMOVE_FROM_SCENE_QUEUE: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    RESIZE_APP_QUEUE: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    CHARACTER_CONTROLLER: {
      cache: {}
      list: ComponentInterface<RAPIER.KinematicCharacterController>[]
    }
    MOVE_CHARACTER: {
      cache: {}
      list: ComponentInterface<{ x: number; y: number; z: number }>[]
    }
    MOVE_CHARACTER_SPEED: {
      cache: {}
      list: ComponentInterface<{ speed: number }>[]
    }
    FIXED_ROTATION: {
      cache: {}
      list: ComponentInterface<{ w: number; x: number; y: number; z: number }>[]
    }
    CAMERA_TARGET: {
      cache: {}
      list: ComponentInterface<string>[]
    }
    CAMERA_CONTROLLER: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    MOUSE_MOVE_EVENT: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    NAVIGATION_MESH: {
      cache: {}
      list: ComponentInterface<any>[]
    }
    ADD_MESH_TO_NAVIGATION_MESH_QUEUE: {
      cache: {}
      list: ComponentInterface<any>[]
    }
  }
  constructor() {
    this.entitiesStorage = {
      updated: false,
      list: [],
      cache: {},
    }
    this.componentsStorage = {
      [COMPONENT_TYPE.OBJECT_3D]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.PIVOT_3D]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.RIGID_BODY]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.COLLIDER]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.SELECTED]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.ADD_TO_SCENE_QUEUE]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.REMOVE_FROM_SCENE_QUEUE]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.RESIZE_APP_QUEUE]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.CHARACTER_CONTROLLER]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.MOVE_CHARACTER]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.MOVE_CHARACTER_SPEED]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.FIXED_ROTATION]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.CAMERA_TARGET]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.CAMERA_CONTROLLER]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.MOUSE_MOVE_EVENT]: {
        cache: {},
        list: [],
      },
      [COMPONENT_TYPE.ADD_MESH_TO_NAVIGATION_MESH_QUEUE]: {
        cache: {},
        list: []
      },
      [COMPONENT_TYPE.NAVIGATION_MESH]: {
        cache: {},
        list: []
      }
    }

    this.componentsTypes = [
      COMPONENT_TYPE.OBJECT_3D,
      COMPONENT_TYPE.PIVOT_3D,
      COMPONENT_TYPE.RIGID_BODY,
      COMPONENT_TYPE.COLLIDER,
      COMPONENT_TYPE.SELECTED,
      COMPONENT_TYPE.ADD_TO_SCENE_QUEUE,
      COMPONENT_TYPE.REMOVE_FROM_SCENE_QUEUE,
      COMPONENT_TYPE.RESIZE_APP_QUEUE,
      COMPONENT_TYPE.CHARACTER_CONTROLLER,
      COMPONENT_TYPE.MOVE_CHARACTER,
      COMPONENT_TYPE.MOVE_CHARACTER_SPEED,
      COMPONENT_TYPE.FIXED_ROTATION,
      COMPONENT_TYPE.CAMERA_TARGET,
      COMPONENT_TYPE.CAMERA_CONTROLLER,
      COMPONENT_TYPE.MOUSE_MOVE_EVENT,
      COMPONENT_TYPE.ADD_MESH_TO_NAVIGATION_MESH_QUEUE,
      COMPONENT_TYPE.NAVIGATION_MESH
    ]
  }
  addEntity() {
    const entity = new Entity()
    const index = this.entitiesStorage.list.length
    this.entitiesStorage.cache[entity.id] = index
    this.entitiesStorage.list.push(entity)
    this.entitiesStorage.updated = true
    return entity
  }
  removeEntity(entity) {
    // if (this.entitiesStorage[entity.id] == null) return
    // this.entitiesStorage[entity.id].used = false
    if (this.entitiesStorage.cache[entity.id] == null) return
    const index = this.entitiesStorage.cache[entity.id]
    this.entitiesStorage.list[index].used = false
    this.entitiesStorage.updated = true
  }
  addComponent<T>(entity: EntityInterface, type: COMPONENT_TYPE, data: T) {
    const component = new Component(entity.id, type, data)
    this.componentsStorage[type].cache = {
      ...this.componentsStorage[type].cache,
      [entity.id]: this.componentsStorage[type].list.length,
    }
    this.componentsStorage[type].list.push(component)
    return this
  }
  replaceComponent<T>(entity: EntityInterface, type: COMPONENT_TYPE, data: T) {
    const component = new Component(entity.id, type, data)
    this.componentsStorage[type].list[0] = component
    this.componentsStorage[type].cache[entity.id] = 0
    return this
  }
  replaceComponentForEntity<T>(
    entity: EntityInterface,
    type: COMPONENT_TYPE,
    data: T
  ) {
    if (this.componentsStorage[type].cache[entity.id] == undefined) {
      const component = new Component(entity.id, type, data)
      this.componentsStorage[type].cache = {
        ...this.componentsStorage[type].cache,
        [entity.id]: this.componentsStorage[type].list.length,
      }
      this.componentsStorage[type].list.push(component)
      return this
    } else {
      const index = this.componentsStorage[type].cache[entity.id]
      const component = new Component(entity.id, type, data)
      this.componentsStorage[type].list[index] = component
      return this
    }
  }
  removeComponent<T>(entity: EntityInterface, type: COMPONENT_TYPE) {
    if (this.componentsStorage[type].cache[entity.id] == null) return this
    const id = entity.id
    const index = this.componentsStorage[type].cache[entity.id]
    this.componentsStorage[type].list[index] = null
    delete this.componentsStorage[type].cache[id]
    return this
  }
  clearComponentsByType(type: COMPONENT_TYPE) {
    this.componentsStorage[type].cache = {}
    this.componentsStorage[type].list.length = 0
  }
  queryComponents<T>(type: COMPONENT_TYPE): ComponentInterface<T>[] | null {
    return this.componentsStorage[type].list as ComponentInterface<T>[]
  }
  queryComponentForEntity<T>(
    entity: EntityInterface,
    type: COMPONENT_TYPE
  ): ComponentInterface<T> | null {
    if (this.componentsStorage[type].cache[entity.id] != null) {
      return this.componentsStorage[type].list[
        this.componentsStorage[type].cache[entity.id]
      ] as ComponentInterface<T>
    }
    return null
  }
}

export interface ApplicationInterface {
  world: World | null
  loader: GLTFLoader | null
  textureLoader: THREE.TextureLoader | null
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  controls: OrbitControls | null
  pointerLockControls: PointerLockControls | null
  ambientLight: THREE.AmbientLight | null
  directionalLight: THREE.DirectionalLight | null
  clock: THREE.Clock | null
  gridHelper: THREE.GridHelper | null
  directionalLightHelper: THREE.DirectionalLightHelper | null
  physics: PhysicsInterface | null
  debugDrawer: DebugDrawer | null
  navMeshHelper: NavMeshHelper | null

  createApplication(): Application
  createScene(): Application
  resize(sizes: { width: number; height: number; ratio: number }): Application
  start(): Application
  animate(): void
  add(gameObject: GameObject): Application
}

export class Application implements ApplicationInterface {
  world = null
  loader = null
  textureLoader = null
  scene = null
  camera = null
  renderer = null
  controls = null
  pointerLockControls = null
  ambientLight = null
  directionalLight = null
  clock = null
  gridHelper = null
  directionalLightHelper = null
  physics = null
  debugDrawer = null
  navMeshHelper = null

  constructor(canvas: any, sizes: { width: number; height: number }) {
    this.world = new World()
    this.loader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    )
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.pointerLockControls = new PointerLockControls(
    //   this.camera,
    //   this.renderer.domElement
    // )
    this.clock = new THREE.Clock()
    this.ambientLight = new THREE.AmbientLight(0xffffff, 3)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)


    this.physics = new Physics(this.scene)

    // this.debugDrawer = new DebugDrawer()

    console.log('constructor()')
    return this
  }

  createApplication() {
    this.camera.position.z = 5

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor(0x000000, 0)

    // this.ambientLight.position.set(0, 1, 0)

    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.width = 2048
    this.directionalLight.shadow.mapSize.height = 2048
    this.directionalLight.shadow.mapSize.x = 2048
    this.directionalLight.shadow.mapSize.y = 2048
    this.directionalLight.shadow.camera.near = 2
    this.directionalLight.shadow.camera.far = 15
    this.directionalLight.shadow.camera.left = -10
    this.directionalLight.shadow.camera.right = 10

    console.log('setupApplication()')


    // this.scene.add(this.ambientLight.target)

    return this
  }

  createScene() {
    this.directionalLight.position.set(2, 10, 1)
    this.directionalLight.target.position.set(-5, 0, 0)

    this.scene.add(this.ambientLight)
    this.scene.add(this.directionalLight)
    this.scene.add(this.directionalLight.target)

    console.log('setupScene()')

    return this
  }

  createHelpers() {
    this.gridHelper = new THREE.GridHelper(100, 5)
    this.directionalLightHelper = new THREE.DirectionalLightHelper(
      this.directionalLight,
      2
    )
    this.scene.add(this.gridHelper)
    this.scene.add(this.directionalLightHelper)

    return this
  }

  resize({
    width,
    height,
    ratio,
  }: {
    width: number
    height: number
    ratio: number
  }) {
    if (!this.camera || !this.renderer) return
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(ratio, 2))

    console.log('resize()')
    return this
  }

  start() {
    this.animate()
    return this
  }

  animate() {
    const start = performance.now()
    // console.time('animate')
    requestAnimationFrame(this.animate.bind(this))
    if (!this.clock || !this.scene || !this.camera || !this.renderer) return
    const delta = this.clock.getDelta()
    // this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.physics.update(delta)
    // if (this.navMeshHelper) {
      // this.navMeshHelper.update();
    // }

    // PHYSICS

    this.ResizeAppQueueSystem()
    this.AddToSceneQueueSystem()
    this.FixedRotationSystem()
    this.MoveCharacterSystem(delta)
    this.CopyRigidBodyPositionToObject3DSystem()
    this.CameraTargetSystem(delta)
    this.CameraControllerSystem(delta)
    this.CreatingNavigationMeshSystem()

    this.RemoveUnusedComponentsSystem()
    this.RemoveUnusedEntitiesSystem()
    this.RemoveFromSceneQueueSystem()
    this.RemoveMouseMoveEventsSystem()

    const end = performance.now()

    const _delta = end - start
    if (_delta > 10) {
      console.log(`delta: ${end - start}ms`);
    }
  }

  add(gameObject: GameObject): Application {
    this.scene.add(gameObject.mesh)
    return this
  }

  AddToSceneQueueSystem() {
    this.world
      .queryComponents(COMPONENT_TYPE.ADD_TO_SCENE_QUEUE)
      .forEach((component) => {
        const result = this.world.queryComponentForEntity(
          { id: component.id },
          COMPONENT_TYPE.OBJECT_3D
        )
        if (!!result) this.scene.add(result.data)
      })
    this.world.clearComponentsByType(COMPONENT_TYPE.ADD_TO_SCENE_QUEUE)
  }
  RemoveFromSceneQueueSystem() {
    // this.world
    //   .queryComponents(COMPONENT_TYPE.REMOVE_FROM_SCENE_QUEUE)
    //   .forEach((component, index) => {
    //     // REMOVE 3D_OBJECT
    //     console.log(component)
    //     this.scene.remove(
    //       this.world.queryComponentForEntity(
    //         { id: component.id },
    //         COMPONENT_TYPE.OBJECT_3D
    //       ).data
    //     )
    //     this.world.removeComponent(
    //       { id: component.id },
    //       COMPONENT_TYPE.OBJECT_3D
    //     )
    //     // // ----------------
    //     // // REMOVE SELECTED
    //     // this.world.removeComponent(
    //     //   { id: component.id },
    //     //   COMPONENT_TYPE.SELECTED
    //     // )
    //   })
    // this.world.clearComponents(COMPONENT_TYPE.REMOVE_FROM_SCENE_QUEUE)
  }
  RemoveUnusedComponentsSystem() {
    this.world.entitiesStorage.list.forEach((entity) => {
      if (entity?.used === false) {
        this.world.componentsTypes.forEach((componentType) => {
          if (
            this.world.componentsStorage[componentType].cache[entity.id] != null
          ) {
            if (componentType !== COMPONENT_TYPE.REMOVE_FROM_SCENE_QUEUE) {
              if (componentType === COMPONENT_TYPE.OBJECT_3D) {
                this.scene.remove(
                  this.world.queryComponentForEntity(
                    { id: entity.id },
                    COMPONENT_TYPE.OBJECT_3D
                  ).data
                )
              }
              if (componentType === COMPONENT_TYPE.COLLIDER) {
                this.physics.world.removeCollider(
                  this.world.queryComponentForEntity(
                    { id: entity.id },
                    COMPONENT_TYPE.COLLIDER
                  ).data
                )
              }
              if (componentType === COMPONENT_TYPE.RIGID_BODY) {
                this.physics.world.removeRigidBody(
                  this.world.queryComponentForEntity(
                    { id: entity.id },
                    COMPONENT_TYPE.RIGID_BODY
                  ).data
                )
              }
              this.world.removeComponent({ id: entity.id }, componentType)
            }
          }
        })
      }
    })
  }
  RemoveUnusedEntitiesSystem() {
    if (this.world.entitiesStorage.updated === true) {
      this.world.entitiesStorage.list = this.world.entitiesStorage.list.filter(
        (entity) => entity.used === true
      )
      let cache = {}
      this.world.entitiesStorage.list.forEach((el, i) => {
        cache[el.id] = i
      })
      this.world.entitiesStorage.cache = { ...cache }
      this.world.entitiesStorage.updated = false
    }
  }
  timeOutID = null
  ResizeAppQueueSystem() {
    if (!this.camera || !this.renderer) return
    const components = this.world.queryComponents(
      COMPONENT_TYPE.RESIZE_APP_QUEUE
    )
    if (components.length === 0) return
    const { width, height, ratio } = components[components.length - 1].data

    if (this.timeOutID != null) clearTimeout(this.timeOutID)

    this.timeOutID = setTimeout(() => {
      console.log('resize()')
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height)
      this.renderer.setPixelRatio(Math.min(ratio, 2))
      clearTimeout(this.timeOutID)
    }, 100)

    this.world.clearComponentsByType(COMPONENT_TYPE.RESIZE_APP_QUEUE)
  }
  CopyRigidBodyPositionToObject3DSystem() {
    this.world.entitiesStorage.list.forEach((entity: EntityInterface) => {
      if (
        entity.used === true &&
        this.world.componentsStorage[COMPONENT_TYPE.OBJECT_3D].cache[
          entity.id
        ] != null &&
        this.world.componentsStorage[COMPONENT_TYPE.RIGID_BODY].cache[
          entity.id
        ] != null
      ) {
        const mesh = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.OBJECT_3D
        ).data
        const rigidBody = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.RIGID_BODY
        ).data
        mesh.position.copy(rigidBody.translation())
        mesh.quaternion.copy(rigidBody.rotation())

        this.directionalLight.position.set(2 + mesh.position.x, 10, mesh.position.z + 1)
        this.directionalLight.target.position.set(-5 + mesh.position.x, 0, mesh.position.z)
      }
    })
  }
  MoveCharacterSystem(delta: number) {
    this.world.entitiesStorage.list.forEach((entity: EntityInterface) => {
      if (
        entity.used === true &&
        this.world.componentsStorage[COMPONENT_TYPE.MOVE_CHARACTER].cache[
          entity.id
        ] != null &&
        this.world.componentsStorage[COMPONENT_TYPE.RIGID_BODY].cache[
          entity.id
        ] != null &&
        this.world.componentsStorage[COMPONENT_TYPE.COLLIDER].cache[
          entity.id
        ] != null &&
        this.world.componentsStorage[COMPONENT_TYPE.OBJECT_3D].cache[
          entity.id
        ] != null
         &&
        this.world.componentsStorage[COMPONENT_TYPE.CHARACTER_CONTROLLER].cache[
          entity.id
        ] != null
          &&
          this.world.componentsStorage[COMPONENT_TYPE.CAMERA_TARGET].cache[entity.id] != null
      ) {
        const object = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.OBJECT_3D
        ).data
        const direction = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.MOVE_CHARACTER
        ).data
        const rigidBody = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.RIGID_BODY
        ).data
        const collider = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.COLLIDER
        ).data
        const controller = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.CHARACTER_CONTROLLER
        ).data

        const cameraEntity = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.CAMERA_TARGET
        )?.data

        const targetPivotObject3D = this.world.queryComponentForEntity(
          cameraEntity,
          COMPONENT_TYPE.OBJECT_3D
        )?.data
        if (!targetPivotObject3D) return

        const filterFlags = RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC

        const globalDirectionVector = new THREE.Vector3(
          direction.x * delta,
          direction.y * delta,
          direction.z * delta
        )
        const globalDirectionVectorRotated = globalDirectionVector
          .clone()
          .applyQuaternion(targetPivotObject3D.quaternion)

        controller.computeColliderMovement(
          collider,
          globalDirectionVectorRotated,
          filterFlags
        )
        const correctedMovement = controller.computedMovement()

        if (direction.x != 0 || direction.z != 0) {
          var pos = new THREE.Vector3()
          pos.addVectors(
            new THREE.Vector3(
              globalDirectionVectorRotated.x,
              0,
              globalDirectionVectorRotated.z
            ),
            object.position
          )
          object.lookAt(pos)
          rigidBody.setRotation(object.quaternion)
        }

        rigidBody.setLinvel(
          {
            x: correctedMovement.x / delta,
            y: correctedMovement.y / delta,
            z: correctedMovement.z / delta,
          },
          true
        )
      }
    })
  }
  CreatingNavigationMeshSystem() {
    let meshes = []
    this.world.entitiesStorage.list.forEach((entity: EntityInterface) => {
      if (entity.used === true && this.world.componentsStorage[COMPONENT_TYPE.ADD_MESH_TO_NAVIGATION_MESH_QUEUE].cache[entity.id] != null) {
        const mesh = this.world.queryComponentForEntity(
            entity,
            COMPONENT_TYPE.ADD_MESH_TO_NAVIGATION_MESH_QUEUE
        ).data
        meshes.push(mesh)
      }
    })
    if (meshes.length > 0) {
      console.log(meshes.length)
      const {success, navMesh} = threeToTileCache(meshes, {tileSize: 64})

      this.debugDrawer.drawNavMesh(navMesh);
      this.navMeshHelper = new NavMeshHelper(navMesh);
      this.scene.add(this.navMeshHelper);
      console.log(success)
    }
    this.world.clearComponentsByType(COMPONENT_TYPE.ADD_MESH_TO_NAVIGATION_MESH_QUEUE)
  }
  FixedRotationSystem() {
    this.world.entitiesStorage.list.forEach((entity: EntityInterface) => {
      if (
        entity.used === true &&
        this.world.componentsStorage[COMPONENT_TYPE.FIXED_ROTATION].cache[
          entity.id
        ] != null &&
        this.world.componentsStorage[COMPONENT_TYPE.RIGID_BODY].cache[
          entity.id
        ] != null
      ) {
        const rotation = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.FIXED_ROTATION
        ).data
        const rigidBody = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.RIGID_BODY
        ).data
        rigidBody.setRotation(rotation)
      }
    })
  }
  CameraControllerSystem(delta) {
    this.world.entitiesStorage.list.forEach((entity: EntityInterface) => {
      if (
        entity.used === true &&
        this.world.componentsStorage[COMPONENT_TYPE.CAMERA_CONTROLLER].cache[
          entity.id
        ] != null &&
        this.world.componentsStorage[COMPONENT_TYPE.OBJECT_3D].cache[
          entity.id
        ] != null
      ) {
        const mouseMoveEvent = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.MOUSE_MOVE_EVENT
        )?.data
        const targetPivotObject3D = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.OBJECT_3D
        )?.data

        if (!targetPivotObject3D || !mouseMoveEvent) return

        const { movementX, movementY } = mouseMoveEvent

        let pivotX = targetPivotObject3D.getObjectByName('pivot_x')
        if (!pivotX) {
          pivotX = new THREE.Object3D()
          pivotX.name = 'pivot_x'
          targetPivotObject3D.add(pivotX)
          pivotX.add(this.camera)
        }

        if (movementX != 0) {
          const angle = delta * 0.05 * -movementX
          const yQuat = new THREE.Quaternion()
          yQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle)
          targetPivotObject3D.quaternion.multiply(yQuat)
        }

        if (movementY != 0) {
          const angle = delta * 0.05 * -movementY
          const xQuat = new THREE.Quaternion()
          xQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angle)
          pivotX.quaternion.multiply(xQuat)

          const maxAngle = Math.PI / 2
          const euler = new THREE.Euler()
          euler.setFromQuaternion(pivotX.quaternion, 'XYZ')
          euler.x = Math.max(-maxAngle, Math.min(maxAngle, euler.x))
          pivotX.quaternion.setFromEuler(euler)
        }
      }
    })
  }
  RemoveMouseMoveEventsSystem() {
    if (
      this.world.componentsStorage[COMPONENT_TYPE.MOUSE_MOVE_EVENT].list
        .length > 0
    )
      this.world.clearComponentsByType(COMPONENT_TYPE.MOUSE_MOVE_EVENT)
  }
  CameraTargetSystem(delta) {
    this.world.entitiesStorage.list.forEach((entity: EntityInterface) => {
      if (
        entity.used === true &&
        this.world.componentsStorage[COMPONENT_TYPE.CAMERA_TARGET].cache[
          entity.id
        ] != null
      ) {
        const targetEntity = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.CAMERA_TARGET
        )?.data
        if (!targetEntity) return

        const targetObject3D = this.world.queryComponentForEntity(
          targetEntity,
          COMPONENT_TYPE.OBJECT_3D
        )?.data
        if (!targetObject3D) return

        const targetRigidBody = this.world.queryComponentForEntity(
          targetEntity,
          COMPONENT_TYPE.RIGID_BODY
        )?.data
        if (!targetRigidBody) return

        const targetPivotObject3D = this.world.queryComponentForEntity(
          entity,
          COMPONENT_TYPE.OBJECT_3D
        )?.data
        if (!targetPivotObject3D) return

        targetPivotObject3D.position.copy(targetRigidBody.translation())
        if (!targetPivotObject3D.getObjectByName('main_camera')) {
          this.camera.name = 'main_camera'
          targetPivotObject3D.add(this.camera)
        }
      }
    })
  }
}

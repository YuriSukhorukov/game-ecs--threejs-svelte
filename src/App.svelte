<script lang="ts">
  import {Application, World, COMPONENT_TYPE, RIGIDBODY_TYPE} from './models/Application.ts'
  import * as THREE from 'three'
  import * as RAPIER from '@dimforge/rapier3d'
  import {Vector3} from "three";

  let canvas

  let sizes = { width: null, height: null, ratio: window.devicePixelRatio }

  let app = null

  let appEntity = null
  let entities = []
  let components = {}
  let selectedEntity = null
  let container = null

  $: console.log(selectedEntity)

  window.addEventListener('mousemove', (event) => {})

  loop()

  function loop() {
    requestAnimationFrame(loop)

    if (!app?.world?.entitiesStorage) return
    if (app.world.entitiesStorage.list.length == entities?.length) return

    if (
      !!app.world.componentsStorage[COMPONENT_TYPE.SELECTED].list[0] &&
      selectedEntity?.id !==
        app?.world?.componentsStorage[COMPONENT_TYPE.SELECTED]?.list[0]?.id
    ) {
      selectedEntity = {
        ...app.world.componentsStorage[COMPONENT_TYPE.SELECTED].list[0],
      }
    }

    if (app?.world?.entitiesStorage?.list?.length != entities.length) {
      entities = [...app.world.entitiesStorage.list]
    } else {
      let different = false
      app.world.entitiesStorage.list.forEach((element, index) => {
        Object.keys(element).forEach((key) => {
          element[key] != entities[index][key]
          different = true
        })
      })
      if (different) {
        entities = [...app.world.entitiesStorage.list]
      }
    }
    components = { ...app.world.componentsStorage }
  }

  $: ((app) => {
    if (!app?.world?.entitiesStorage) return
  })(app)

  function createPlane(app) {
    const width = 20
    const height = 0.1
    const depth = 20
    const planeEntity = app.world.addEntity()
    const planeData = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth, 1),
      new THREE.MeshToonMaterial({ color: 0xaae06c })
    )
    planeData.receiveShadow = true

    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
    const rigidBody = app.physics.world.createRigidBody(rigidBodyDesc)

    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      width / 2,
      height / 2,
      depth / 2
    )
    const collider = app.physics.world.createCollider(colliderDesc, rigidBody)

    app.world
      .addComponent(planeEntity, COMPONENT_TYPE.OBJECT_3D, planeData)
      .addComponent(planeEntity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, planeData)
      .addComponent(planeEntity, COMPONENT_TYPE.RIGID_BODY, rigidBody)
      .addComponent(planeEntity, COMPONENT_TYPE.COLLIDER, collider)

    return planeEntity
  }

  function createPhysicsObject(
    app,
    params: {
      rigidBodybType: RIGIDBODY_TYPE,
      size: {
        width: number,
        height: number,
        depth: number,
      },
      position: {
        x: number, 
        y: number, 
        z: number
      },
      rotation: {
        w: number, 
        x: number, 
        y: number, 
        z: number
      }
    }
  ) {
    const {rigidBodybType} = params
    const {width, height, depth} = params.size;
    const position = Object.keys(params.position).map(key => params.position[key])
    const rotation = params.rotation

    const entity = app.world.addEntity()
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth, 1),
      new THREE.MeshToonMaterial({ color: 0xaae06c })
    )
    mesh.receiveShadow = true;
    mesh.position.set(...position)

    const rigidBodyDesc = RAPIER.RigidBodyDesc[rigidBodybType]().setTranslation(...position).setRotation({...rotation})
    const rigidBody = app.physics.world.createRigidBody(rigidBodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2)
    const collider = app.physics.world.createCollider(colliderDesc, rigidBody)
    app.world
      .addComponent(entity, COMPONENT_TYPE.OBJECT_3D, mesh)
      .addComponent(entity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, mesh)
      .addComponent(entity, COMPONENT_TYPE.RIGID_BODY, rigidBody)
      .addComponent(entity, COMPONENT_TYPE.COLLIDER, collider)
  }

  function createInclinedSurface() {
    const width = 2
    const height = 0.2
    const depth = 10
    const position = [3, 0.5, 5]
    const rotation = { w: 1.0, x: 0.25, y: 0.0, z: 0.0 }
    const entity = app.world.addEntity()

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth, 1),
      new THREE.MeshToonMaterial({ color: 0xaae06c })
    )
    mesh.position.set(...position)
    mesh.receiveShadow = true

    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      ...position
    )
    const rigidBody = app.physics.world.createRigidBody(rigidBodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      width / 2,
      height / 2,
      depth / 2
    )
    const collider = app.physics.world.createCollider(colliderDesc, rigidBody)

    rigidBody.setRotation(rotation)

    app.world
      .addComponent(entity, COMPONENT_TYPE.OBJECT_3D, mesh)
      .addComponent(entity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, mesh)
      .addComponent(entity, COMPONENT_TYPE.RIGID_BODY, rigidBody)
      .addComponent(entity, COMPONENT_TYPE.COLLIDER, collider)

    return entity
  }

  function createMap(app) {
    const data = [
      //       plane
      {
        position: [0,0,0],
        rotation: {w: 1.0, x: 0.0, y: 0.0, z: 0.0},
        sizes: {
          width: 50,
          height: 0.1,
          depth: 50,
        }
      },
      {
      position: [5,5,0],
      rotation: {w: 1.0, x: 0.0, y: 0.0, z: 0.0},
      sizes: {
        width: 1,
        height: 10,
        depth: 1,
      }
    }]
    const material = new THREE.MeshToonMaterial({ color: 0xaae06c })
    data.forEach((el)=>{
      const entity = app.world.addEntity()
      const {width, height, depth} = el.sizes
      const {position, rotation} = el
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      )
      mesh.position.set(...position)
      mesh.receiveShadow = true
      const rb = app.physics.world.createRigidBody(
        RAPIER.RigidBodyDesc
          .fixed()
          .setTranslation(...position)
          .setRotation({...rotation})
      )
      const coll = app.physics.world.createCollider(RAPIER.ColliderDesc.cuboid(width / 2, height / 2, depth / 2), rb)

      app.world
        .addComponent(entity, COMPONENT_TYPE.OBJECT_3D, mesh)
        .addComponent(entity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, mesh)
        .addComponent(entity, COMPONENT_TYPE.RIGID_BODY, rb)
        .addComponent(entity, COMPONENT_TYPE.COLLIDER, coll)
    })
  }

  const speed = 3
  let direction = { x: 0, y: -1.0, z: 0.0 }
  function createCharacter() {
    const width = 0.5
    const height = 0.5
    const depth = 1
    const position = [-1, 1, 1]

    const entity = app.world.addEntity()
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(width, height, 1, 8),
      new THREE.MeshToonMaterial({
        map: app.textureLoader.load('models/Cube_uv_grid.jpg'),
        gradientMap: (() => {
          const threeTone = app.textureLoader.load('models/threeTone.jpg')
          threeTone.minFilter = THREE.NearestFilter
          threeTone.magFilter = THREE.NearestFilter
          return threeTone
        })(),
        flatShading: true,
      })
    )
    mesh.castShadow = true
    mesh.position.set(...position)
    app.world
      .addComponent(entity, COMPONENT_TYPE.OBJECT_3D, mesh)
      .addComponent(entity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, mesh)

    const rigidBodyDesc = RAPIER.RigidBodyDesc
      // .kinematicPositionBased()
      .kinematicVelocityBased()
      .setTranslation(...position)
    const rigidBody = app.physics.world.createRigidBody(rigidBodyDesc)
    // const vertices = new Float32Array(mesh.geometry.attributes.position.array)
    // const indices = new Uint32Array((mesh.geometry.index as THREE.BufferAttribute).array)
    // const shape = (RAPIER.ColliderDesc.trimesh(vertices, indices) as RAPIER.ColliderDesc)
    //   .setMass(1)
    //   .setRestitution(1.1)
    // const collider = app.physics.world.createCollider(shape, rigidBody)
    const colliderDesc = RAPIER.ColliderDesc.capsule(height / 2, width)
    const collider = app.physics.world.createCollider(colliderDesc, rigidBody)
    app.world
      .addComponent(entity, COMPONENT_TYPE.RIGID_BODY, rigidBody)
      .addComponent(entity, COMPONENT_TYPE.COLLIDER, collider)
    // .addComponent(entity, COMPONENT_TYPE.FIXED_ROTATION, { w: 1.0, x: 0, y: 0.0, z: 0.0 })

    let characterController = app.physics.world.createCharacterController(0.01)
    characterController.enableSnapToGround(0.05)

    app.world.addComponent(
      entity,
      COMPONENT_TYPE.CHARACTER_CONTROLLER,
      characterController
    )

    // CAMERA CONTROLLER
    const cameraEntity = app.world.addEntity()
    const cameraPivot = new THREE.Object3D()
    app.world
      .addComponent(cameraEntity, COMPONENT_TYPE.CAMERA_CONTROLLER, entity)
      .addComponent(cameraEntity, COMPONENT_TYPE.CAMERA_TARGET, entity)
      .addComponent(
        cameraEntity,
        COMPONENT_TYPE.ADD_TO_SCENE_QUEUE,
        cameraPivot
      )
      .addComponent(cameraEntity, COMPONENT_TYPE.OBJECT_3D, cameraPivot)

    app.world.addComponent(entity, COMPONENT_TYPE.CAMERA_TARGET, cameraEntity)

    window.addEventListener('mousemove', (event) => {
      app.world.replaceComponentForEntity(
        cameraEntity,
        COMPONENT_TYPE.MOUSE_MOVE_EVENT,
        event
      )
    })

    return entity
  }

  function createTorus(app) {
    const torusEntity = app.world.addEntity()
    const torusData = new THREE.Mesh(
      new THREE.TorusKnotGeometry(),
      new THREE.MeshToonMaterial({
        map: app.textureLoader.load('models/Cube_uv_grid.jpg'),
        gradientMap: (() => {
          const threeTone = app.textureLoader.load('models/threeTone.jpg')
          threeTone.minFilter = THREE.NearestFilter
          threeTone.magFilter = THREE.NearestFilter
          return threeTone
        })(),
        flatShading: true,
      })
    )
    torusData.castShadow = true
    torusData.position.set(-1, 2, -3)
    app.world
      .addComponent(torusEntity, COMPONENT_TYPE.OBJECT_3D, torusData)
      .addComponent(torusEntity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, torusData)
  }

  function createBox(app) {
    const width = 1
    const height = 1
    const depth = 1
    const position = [1, 1, 1]
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth, 1),
      new THREE.MeshToonMaterial({ color: 0xf8ff36 })
    )
    mesh.castShadow = true
    mesh.position.set(...position)

    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
      ...position
    )
    const rigidBody = app.physics.world.createRigidBody(rigidBodyDesc)
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
      width / 2,
      height / 2,
      depth / 2
    )
    const collider = app.physics.world.createCollider(colliderDesc, rigidBody)

    rigidBody.setRotation({ w: 1.0, x: 0.3, y: 0.0, z: 0.0 })

    const entity = app.world.addEntity()
    app.world
      .addComponent(entity, COMPONENT_TYPE.OBJECT_3D, mesh)
      .addComponent(entity, COMPONENT_TYPE.ADD_TO_SCENE_QUEUE, mesh)
      .addComponent(entity, COMPONENT_TYPE.RIGID_BODY, rigidBody)
      .addComponent(entity, COMPONENT_TYPE.COLLIDER, collider)

    setTimeout(() => {
      rigidBody.addForce({ x: 0.0, y: 0.0, z: 0.0 }, true)
      rigidBody.addTorque({ x: -3.0, y: 0.0, z: 0.0 }, true)
    }, 2000)
  }

  let toggle = false
  let moveSides = {
    left: false,
    right: false,
    forward: false,
    backward: false,
  }
  function createPlayer(app) {
    window.addEventListener('keydown', (event) => {
      event.preventDefault()
      if (event?.code === 'Space' && direction.y != speed) {
        direction = {
          ...direction,
          y: speed,
        }
      }
      if (event?.code === 'KeyW' && direction.z != -speed) {
        direction = {
          ...direction,
          z: -speed,
        }
      }
      if (event?.code === 'KeyS' && direction.z != speed) {
        direction = {
          ...direction,
          z: speed,
        }
      }
      if (event?.code === 'KeyA' && direction.x != -speed) {
        direction = {
          ...direction,
          x: -speed,
        }
      }
      if (event?.code === 'KeyD' && direction.x != speed) {
        direction = {
          ...direction,
          x: speed,
        }
      }
    })
    window.addEventListener('keyup', (event) => {
      if (event?.code === 'Space') {
        direction = {
          ...direction,
          y: -speed,
        }
      }
      if (event?.code === 'KeyW') {
        direction = {
          ...direction,
          z: 0,
        }
      }
      if (event?.code === 'KeyS') {
        direction = {
          ...direction,
          z: 0,
        }
      }
      if (event?.code === 'KeyA') {
        direction = {
          ...direction,
          x: 0,
        }
      }
      if (event?.code === 'KeyD') {
        direction = {
          ...direction,
          x: 0,
        }
      }
    })
  }
  $: ((direction) => {
    if (!player) return

    app.world.replaceComponentForEntity(
      player,
      COMPONENT_TYPE.MOVE_CHARACTER,
      direction
    )
  })(direction)

  let player = null

  $: (async (canvas) => {
    if (!canvas || !!app) return
    // await initRecastLib()
    app = new Application(canvas, sizes)
      .createApplication()
      .createScene()
      .createHelpers()
      .start()

    canvas.addEventListener('click', async () => {
      await canvas.requestPointerLock()
      // app.pointerLockControls.lock()
    })

    appEntity = app.world.addEntity()

    // createPlane(app)
    createTorus(app)
    createBox(app)
    createPlayer(app)
    createPhysicsObject(app, {
      rigidBodybType: RIGIDBODY_TYPE.DYNAMIC,
      size: {
        width: 2,
        height: 1,
        depth: 2,
      },
      position: {
        x: 1,
        y: 1,
        z: 1,
      },
      rotation: {
        w: 1,        
        x: 0,
        y: 0,
        z: 0,
      },

    })
    createInclinedSurface(app)
    createMap(app)

    // createNavMesh([
    //   entity1,
    //   entity2
    // ])

    player = createCharacter(app)
  })(canvas)

  $: ((sizes) => {
    if (!app) return
    app.world.replaceComponent(
      appEntity,
      COMPONENT_TYPE.RESIZE_APP_QUEUE,
      sizes
    )
  })(sizes)

  let entitiesPanelVisible = false
  $: console.log(entitiesPanelVisible)
  function toggleEntitiesPanelVisible() {
    entitiesPanelVisible = !entitiesPanelVisible
  }
</script>

<div
  class="container"
  bind:this={container}
  bind:clientWidth={sizes.width}
  bind:clientHeight={sizes.height}
>
  <canvas
    id="glcanvas"
    bind:this={canvas}
    width="120px"
  ></canvas>
  <div class="ui">
    <button
      class="toggle-visible-btn"
      on:click={() => {
        toggleEntitiesPanelVisible()
      }}>{`${entitiesPanelVisible === true ? '<' : '>'}`}</button
    >
    <div class={`panel ${entitiesPanelVisible === true ? 'visible' : ''}`}>
      <div class={`entities`}>
        <div class="entities__list">
          <h3>Entities</h3>
          {#each entities as entity}
            {#if entity}
              <p
                class={`entities__item ${selectedEntity?.id == entity.id ? 'selected' : ''}`}
              >
                <a
                  href="/"
                  on:click={(e) => {
                    app.world.replaceComponent(
                      entity,
                      COMPONENT_TYPE.SELECTED,
                      {}
                    )
                    e.preventDefault()
                  }}>{entity?.id}: {entity?.used}</a
                >
                <a
                  href="/"
                  class="entities__remove"
                  on:click={(e) => {
                    app.world.removeEntity(entity)
                    e.preventDefault()
                  }}>Remove</a
                >
              </p>
            {/if}
          {/each}
        </div>
      </div>
      <div class="components">
        <h3>Components</h3>
        {#each Object.keys(components) as componentType}
          <div class="components__list">
            <div class="components__item-type">
              {JSON.stringify(componentType)}
            </div>
            <div class="components__item-cache">
              {JSON.stringify({
                cache: components[componentType].cache,
              })}
            </div>
            <div class="components__item-list">
              {JSON.stringify({
                list: components[componentType].list.map((item) => {
                  return { id: item?.id, type: item?.type }
                }),
              })}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  // .container {
  //   border: 3px solid red;
  // }
  .container {
    position: relative;
    width: 100%;
    height: 100%;

    #glcanvas {
      width: 100%;
      --button-height: 5.25;

      position: absolute;
      height: 100%;
    }

    .ui {
      position: relative;
      // left: 0.5rem;
      position: absolute;
      background-color: rgba(45, 45, 45, 0.8);
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 99vh;
      // border-radius: 0.5rem;
      * {
        margin: 0;
      }
      .toggle-visible-btn {
        font-size: 1rem;
        font-weight: 500;
        position: absolute;
        right: 0.5rem;
        background-color: rgba(74, 74, 74, 0.8);
        border-radius: 0.25rem;
      }
      .entities,
      .components {
        &__list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }
        &__item {
          display: flex;
          justify-content: space-between;
        }
        &__remove {
          // background-color: rgba(1,1,1,0.5);
          color: rgb(255, 91, 91);
        }
        .selected {
          background-color: rgba(62, 62, 62, 0.8);
        }
      }
      .panel {
        visibility: hidden;
        width: 20px;
      }
      .panel.visible {
        width: 100%;
        visibility: visible;
      }

      // .entities, .visible {
      //   visibility: visible;
      // }

      .components {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        &__list {
          border: 1px solid rgb(70, 70, 70);
          border-radius: 0.5rem;
          padding: 0.5rem;
        }
      }
    }
  }
</style>

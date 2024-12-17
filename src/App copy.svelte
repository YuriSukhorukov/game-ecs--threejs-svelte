<script lang="ts">
	import { GameObject } from './models/GameObject.ts';
	import { Application } from './models/Application.ts';
	import { RapierDebugRenderer } from './utils/RapierDebugRenderer.ts';
	import { rotate } from './../node_modules/three/src/nodes/utils/RotateNode.js';
  import * as THREE from 'three';
  // import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  import * as RAPIER from "@dimforge/rapier3d";

	import { onMount, afterUpdate } from 'svelte';
  import pageStore, { Page } from '$stores/pageStore';

  import vertexShader from './shaders/toon.vert'
  import fragmentShader from './shaders/toon.frag'

  import { type Entity } from "./ECS.ts";


  let canvas;
  let container;

  let sizes = {width: null, height: null};



// ----------------


  const cube = { id: crypto.randomUUID() }
  const scene = { id: crypto.randomUUID() }
  const camera = { id: crypto.randomUUID() }
  const renderer = { id: crypto.randomUUID() }
  const ambientLight = { id: crypto.randomUUID() }
  const directionalLight = { id: crypto.randomUUID() }
  const orbitControls = { id: crypto.randomUUID() }

  let entities: Array<Entity> = []
  
  interface ComponentsCache {
    [id: string]: number
  }

  let components: {
    move: {
      cache: ComponentsCache,
      list: Array<Component<any>>
    }
    scene: {
      cache: ComponentsCache,
      list: Array<Component<THREE.Scene>>
    }
    camera: {
      cache: ComponentsCache,
      list: Array<Component<THREE.Camera>>
    }
    renderer: {
      cache: ComponentsCache,
      list: Array<Component<THREE.WebGLRenderer>>
    }
    ambientLight: {
      cache: ComponentsCache,
      list: Array<Component<THREE.AmbientLight>>
    }
    directionalLight: {
      cache: ComponentsCache,
      list: Array<Component<THREE.DirectionalLight>>
    }
    orbitControls: {
      cache: ComponentsCache,
      list: Array<Component<OrbitControls>>
    }
    queueAddOnScene: {
      cache: ComponentsCache,
      list: Array<Component<null>>
    }
    add: (collection, component) => void
  } = {
    move: {
      cache: {},
      list: []
    },
    mesh: {
      cache: {},
      list: []
    },
    scene: {
      cache: {},
      list: []
    },
    camera: {
      cache: {},
      list: []
    },
    renderer: {
      cache: {},
      list: []
    },
    ambientLight: {
      cache: {},
      list: []
    },
    directionalLight: {
      cache: {},
      list: []
    },
    orbitControls: {
      cache: {},
      list: []
    },
    queueAddOnScene: {
      cache: {},
      list: []
    },

    add: (collection, component: Component) => {
      collection.cache = {...collection.cache, [component.id]: collection.list.length }
      collection.list.push(component)
    }
  }
let ready = false
  $: ((canvas)=>{
    if (!canvas || ready) return

    const cube = { id: crypto.randomUUID() }
    const scene = { id: crypto.randomUUID() }
    const camera = { id: crypto.randomUUID() }
    const renderer = { id: crypto.randomUUID() }
    const ambientLight = { id: crypto.randomUUID() }
    const directionalLight = { id: crypto.randomUUID() }
    const orbitControls = { id: crypto.randomUUID() }

    entities = [
      cube,
      scene,
      camera,
      renderer,
      ambientLight,
      directionalLight,
      orbitControls
    ]

    let sceneComponent = {
      id: scene.id, 
      data: new THREE.Scene()
    }
    let cameraComponent = {
      id: camera.id,
      data: new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
    }
    let rendererComponent = {
      id: renderer.id,
      data: new THREE.WebGLRenderer({ canvas, antialias: true })
    }
    let ambientLightComponent = {
      id: ambientLight.id,
      data: new THREE.AmbientLight(0xffffff, 2)
    }
    let directionalLightComponent = {
      id: directionalLight.id,
      data: new THREE.DirectionalLight(0xffffff, 1)
    }
    let cubeComponent = {
      id: cube.id,
      data: new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6, 1), new THREE.MeshToonMaterial({ color: 0xaae06c, wireframe: true, })),
    }
    let orbitControlsComponent = {
      id: orbitControls.id,
      data: new OrbitControls(cameraComponent.data, rendererComponent.data.domElement)
    }

    cameraComponent.data.position.z = 5
    rendererComponent.data.shadowMap = true

    components.scene.cache[sceneComponent.id] = components.scene.list.length
    components.scene.list.push(sceneComponent)
    components.camera.cache[cameraComponent.id] = components.camera.list.length
    components.camera.list.push(cameraComponent)
    components.renderer.cache[rendererComponent.id] = components.renderer.list.length
    components.renderer.list.push(rendererComponent)
    components.mesh.cache[cubeComponent.id] = components.mesh.list.length
    components.mesh.list.push(cubeComponent)
    components.ambientLight.cache[ambientLightComponent.id] = components.ambientLight.list.length
    components.ambientLight.list.push(ambientLightComponent)
    components.directionalLight.cache[directionalLightComponent.id] = components.directionalLight.list.length
    components.directionalLight.list.push(directionalLightComponent)
    components.orbitControls.cache[orbitControlsComponent.id] = components.orbitControls.list.length
    components.orbitControls.list.push(orbitControlsComponent)

    components.queueAddOnScene.cache[cube.id] = components.queueAddOnScene.list.length
    components.queueAddOnScene.list.push({id: cube.id})
    components.queueAddOnScene.cache[ambientLight.id] = components.queueAddOnScene.list.length
    components.queueAddOnScene.list.push({id: ambientLight.id})
    components.queueAddOnScene.cache[directionalLight.id] = components.queueAddOnScene.list.length
    components.queueAddOnScene.list.push({id: directionalLight.id})


    // components.add(components.scene ,sceneComponent)
    // components.add(components.camera ,cameraComponent)
    // components.add(components.renderer ,rendererComponent)
    
    // components.add(components.mesh, cubeComponent)
    // components.add(components.ambientLight, ambientLightComponent)
    // components.add(components.directionalLight, directionalLightComponent)
    // components.add(components.orbitControls, orbitControlsComponent)

    // components.add(components.queueAddOnScene, {id: cube.id, data: null})
    // components.add(components.queueAddOnScene, {id: ambientLight.id, data: null})
    // components.add(components.queueAddOnScene, {id: directionalLight.id, data: null})

    // components.add(components.queueAddOnScene, ambientLight)
    // components.add(components.queueAddOnScene, directionalLight)

    // orbitControlsComponent.data.addEventListener('change', ()=>console.log('c changed'))
    
    
    // setTimeout(() => {
    //   requestAnimationFrame(()=>{
        // loop()
    //   })
    //   // systems.queueAddOnScene()  
    // }, 2000);
    // 
    // console.log('cube', cube)
    // console.log('ambientLight', ambientLight)
    // console.log('directionalLight', directionalLight)
    // console.log('cubeComponent', cubeComponent)
    // console.log('ambientLight', ambientLight)
    // console.log('directionalLight', directionalLight)

    // console.log(ambientLightComponent)
    // console.log(components.ambientLight.list)
    // console.log(components.queueAddOnScene)

    ready = true
    
  })(canvas)

  // $: ((ready)=>{
  //   if (!ready) return
  //   console.log(ready)
  //   // requestAnimationFrame(()=>{
  //     loop()
  //   // })
  // })(ready)

  $: ((components)=>{
    if (components.camera.list.length == 0 
    || components.renderer.list.length == 0 
    || components.scene.list.length == 0 
  ) return
    requestAnimationFrame(()=>{
      loop()
    })
    console.log('components: ', components)
  })(components)

  $: ((entities)=>{
    if (entities.length == 0) return
    console.log('entities', entities)
  })(entities)



const systems = {
  queueAddOnScene: function() {
    if (components.queueAddOnScene.list.length == 0) return

    for (const element of components.queueAddOnScene.list) {
      console.log('element', element)
      if (components.mesh.cache[element.id] != null) {
        const index = components.mesh.cache[element.id]
        console.log(index)
        const component = components.mesh.list[index]
        components.scene.list[0].data.add(component.data)
        console.log('mesh:', component)
      }
      if (components.ambientLight.cache[element.id] != null) {
        const index = components.ambientLight.cache[element.id]
        console.log(index)
        const component = components.ambientLight.list[index]
        components.scene.list[0].data.add(component.data)

        component.data.position.set(1,1,1)

        console.log('ambient light:', component)
      }
      if (components.directionalLight.cache[element.id] != null) {
        const index = components.directionalLight.cache[element.id]
        console.log(index)
        const component = components.directionalLight.list[index]
        components.scene.list[0].data.add(component.data)

        component.data.position.set(0, 3, 0)
        component.data.castShadow = true
        component.data.shadow.mapSize.width = 4096
        component.data.shadow.mapSize.height = 4096
        component.data.shadow.camera.near = 2
        component.data.shadow.camera.far = 15

        console.log('direction light:', component)
      }
    }
    
    components.queueAddOnScene.cache = null
    components.queueAddOnScene.list.length = 0
  },
  rendererSystem: function() {
    if (components.renderer.list.length == 0) return
    components.renderer.list[0].data.render(
      components.scene.list[0].data,
      components.camera.list[0].data,
    )
  },
  obitControlsSystem: function() {
    if (components.orbitControls.list.length == 0) return
    components.orbitControls.list[0].data.update()
  }
}

function loop() {
  requestAnimationFrame(()=>{
    loop()
  })

  systems.queueAddOnScene()
  systems.obitControlsSystem()
  systems.rendererSystem()
}

// ----------------
// $:((components)=>{
//   console.log(components.queueAddOnScene)
// })(components)

  // let loader;
  // let textureLoader;
  // let scene;
  // let camera;
  // let renderer;

  // let controls;

  // let gravity = null
  // let world = null
  // const dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = []
  // // const rapierDebugRenderer = new RapierDebugRenderer(scene, world)
  // let groundColliderDesc = null
  // let ready = false;

  // let rapierDebugRenderer = null

  
  // let app = null
  // let plane = null
  
  // $: ((canvas)=>{
  //   if (!canvas || !!app) return
  //   app = new Application(canvas, sizes)
  //     .createApplication()
  //     .createScene()
  //     .createHelpers()
  //     .start()

  //   plane = new GameObject({
  //     geometry: new THREE.BoxGeometry(6, 0.1, 6, 1),
  //     material: new THREE.MeshToonMaterial({ color: 0xaae06c})
  //   }).setShadows({
  //     receiveShadow: true
  //   })

  //   app.add(plane)

  //   const torusKnotGeometry = new THREE.TorusKnotGeometry()
  //   const threeTone = app.textureLoader.load('models/threeTone.jpg')
  //   const texture = app.textureLoader.load('models/Cube_uv_grid.jpg')
  //   // const texture = textureLoader.load('models/grid.png')
  //   threeTone.minFilter = THREE.NearestFilter
  //   threeTone.magFilter = THREE.NearestFilter
  //   const material = new THREE.MeshToonMaterial({
  //     map: texture,
  //     gradientMap: threeTone,
  //     // wireframe: true,
  //     // flatShading: true
  //   })
  //   const cube = new THREE.Mesh(torusKnotGeometry, material)
  //   cube.castShadow = true
  //   // cube.receiveShadow = true;
  //   cube.position.x = 0
  //   app.scene.add(cube)
  // })(canvas)

  // $: ((sizes)=>{
  //   if (!app) return
  //   app.resize({...sizes, ratio: window.devicePixelRatio})
  // })(sizes)
  // let x = 0
  // function animate() {
  //   requestAnimationFrame(animate)
  //   const delta = app.clock.getDelta()
  //   // app.controls.update()
  //   // controls.update()
  //   app.renderer.render(app.scene, app.camera)
  //   // x+=0.01
  //   // plane.position.set(x,-x*0.25)
  // }

  // $: ((canvas)=>{
  //   if (!canvas || ready) return
  //   init()
  //   ready = true
  // })(canvas)

  // $: (async (ready)=>{
  //   if (!ready) return
  //   await load()
  //   setupLight()
  // })(ready)

  // $: (async (world)=>{
  //   if (!rapierDebugRenderer && world) {
  //     rapierDebugRenderer = new RapierDebugRenderer(scene, world);
  //     console.log(1)
  //   }
  // })(world)

  // var cube = null

  // function init() {
  //   loader = new GLTFLoader();
  //   textureLoader = new THREE.TextureLoader();
  //   scene = new THREE.Scene(); 
  //   camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 ); 
  //   renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  //   controls = new OrbitControls(camera, renderer.domElement)
  //   camera.position.z = 5;
  //   scene.add(camera)

  //   renderer.shadowMap.enabled = true;
  //   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //   renderer.setClearColor( 0x000000, 0 );
  //   // renderer.setAnimationLoop( animate );
  //   requestAnimationFrame(animate)
  // }

  // async function load() {
  //   const torusKnotGeometry = new THREE.TorusKnotGeometry()
  //   const threeTone = textureLoader.load('models/threeTone.jpg')
  //   const texture = textureLoader.load('models/Cube_uv_grid.jpg')
  //   // const texture = textureLoader.load('models/grid.png')
  //   threeTone.minFilter = THREE.NearestFilter
  //   threeTone.magFilter = THREE.NearestFilter
  //   const material = new THREE.MeshToonMaterial({
  //     map: texture,
  //     gradientMap: threeTone,
  //     // wireframe: true,
  //     // flatShading: true
  //   })
  //   const cube = new THREE.Mesh(torusKnotGeometry, material)
  //   cube.castShadow = true
  //   // cube.receiveShadow = true;
  //   cube.position.x = 0
  //   scene.add(cube)

  //   const plane = new THREE.Mesh(
  //     new THREE.BoxGeometry(6, 0.1, 6, 1), 
  //     new THREE.MeshToonMaterial({ 
  //       color: 0xaae06c,
  //     })
  //   )
  //   plane.receiveShadow = true;
  //   plane.position.set(0, -2)
  //   scene.add(plane)

  //   // 
  //   // 
  //   // 
  //   // PHYSICS
  //   gravity = {x: 0, y: -2, z: 0}
  //   world = new RAPIER.World(gravity)
  //   const eventQueue = new RAPIER.EventQueue(true)
  //   const model = plane.geometry;
  //   const vertices = new Float32Array(model.attributes.position.array);
  //   let indices;
  //   if (model.index) {
  //     indices = new Uint32Array(model.index.array);
  //   } else {
  //     // Handle unindexed geometry by generating indices
  //     indices = new Uint32Array([...Array(vertices.length / 3).keys()]);
  //   }
  //   const trimesh = new RAPIER.TriMesh(vertices, indices);

  //   const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshToonMaterial({ 
  //     // color: 0xFFFF00,
  //     gradientMap: threeTone,
  //     map: texture
  //   }))
  //   cubeMesh.receiveShadow = true;
  //   cubeMesh.castShadow = true
  //   scene.add(cubeMesh)
  //   const cubeBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(2, 2, 0).setCanSleep(false))
  //   const cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1).setRestitution(0.5)
  //   world.createCollider(cubeShape, cubeBody)
  //   dynamicBodies.push([cubeMesh, cubeBody])

  //   groundColliderDesc = RAPIER.ColliderDesc.cuboid(3.0, 0.1, 3.0);
  //   groundColliderDesc.setTranslation(0, -2, 0)
  //   world.createCollider(groundColliderDesc);
  // }

  // let directionalLight = null
  // function setupLight() {
  //   // var ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  //   var ambientLight = new THREE.AmbientLight(0xffffff, 2);
  //   ambientLight.position.set(1, 1, 1);
  //   scene.add(ambientLight);

  //   directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  //   const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2)
  //   directionalLight.position.set(0,3,0)
  //   directionalLight.castShadow = true;
  //   directionalLight.shadow.mapSize.width = 4096;
  //   directionalLight.shadow.mapSize.height = 4096;
  //   directionalLight.shadow.camera.near = 2;
  //   directionalLight.shadow.camera.far = 15;
  //   scene.add(directionalLight, directionalLightHelper); // !!!
  // }

  // function resize() {
  //   if (sizes.width === 0 || sizes.height === 0) return
  //   if(!camera || !renderer) return
  //   camera.aspect = sizes.width / sizes.height
  //   camera.updateProjectionMatrix()
  //   renderer.setSize(sizes.width, sizes.height)
  //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // }

  // // function physics() {
  // //   const gravity = {x: 0, y: -2, z: 0}
  // //   const eventQueue = new RAPIER.EventQueue(true)

  // // }

  // let acc = 0;

  // const clock = new THREE.Clock()
  // let delta

  // function animate() {
  //   requestAnimationFrame(animate)
  //   if (!scene || !camera || !renderer) return

  //   delta = clock.getDelta()
  //   world.timestep = Math.min(delta, 0.1)
  //   world.step()

  //   for (let i = 0, n = dynamicBodies.length; i < n; i++) {
  //     dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation())
  //     dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation())
  //   }

  //   rapierDebugRenderer.update()

  //   controls.update()

  //   acc += delta;
  //   directionalLight.position.x = Math.sin(acc);
  //   directionalLight.position.z = Math.sin(acc);

  //   // if (!!world) {
  //   //   world.step()
  //   // }
  //   renderer.render( scene, camera );
  // }
</script>

<div class="container" bind:this={container} bind:clientWidth={sizes.width} bind:clientHeight={sizes.height}>
  <canvas id="glcanvas" bind:this={canvas} width="120px"></canvas>
</div>

<style lang="scss">
  // .container {
  //   border: 3px solid red;
  // }
  .container {
    // border: 2px solid blue;
    position: relative;
    width: 100%;
    height: 100%;

    #glcanvas {
      // border: 2px solid red;
      width: 100%;
      --button-height: 5.25;
      // padding: var(--gutter-height) var(--gutter-width) var(--gutter-width);

      position: absolute;
      height: 100%;
      // padding-bottom: calc(var(--button-height) * var(--gutter-height) + var(--gutter-width) * 4.5);
    }
  }
</style>


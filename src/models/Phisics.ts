import { RapierDebugRenderer } from '../utils/RapierDebugRenderer'
import * as RAPIER from '@dimforge/rapier3d'
import * as THREE from 'three'
import { getRapier, Rapier } from '../utils/getRapier'

export interface GravityInterface {
  x: number
  y: number
  z: number
}

export interface PhysicsInterface {
  world: RAPIER.World
  gravity: GravityInterface
  colliders: Array<RAPIER.Collider>
  rigidBodies: Array<RAPIER.RigidBody>
  eventQueue: RAPIER.EventQueue
  debugger: RapierDebugRenderer
  rapier: Rapier
  update(number): void
}

export class Physics implements PhysicsInterface {
  world: RAPIER.World
  gravity: GravityInterface
  colliders: RAPIER.Collider[]
  rigidBodies: RAPIER.RigidBody[]
  eventQueue: RAPIER.EventQueue
  debugger: RapierDebugRenderer
  rapier: Rapier
  constructor(scene: THREE.Scene) {
    this.gravity = { x: 0, y: -9.8, z: 0 }
    this.world = new RAPIER.World(this.gravity)
    this.colliders = []
    this.rigidBodies = []
    this.eventQueue = new RAPIER.EventQueue(true)
    this.debugger = new RapierDebugRenderer(scene, this.world)
  }
  update(delta: number) {
    this.world.timestep = Math.min(delta, 0.1)
    this.world.step()
    this.debugger.update()
  }
  async attach() {
    this.rapier = await getRapier()
  }
}

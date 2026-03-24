import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createWorldSettings, createWorld, addBroadphaseLayer, addObjectLayer, enableCollision, registerAll, updateWorld, rigidBody, box, MotionType } from 'crashcat';
import { Vehicle } from './Vehicle.js';
import { Camera } from './Camera.js';
import { Controls } from './Controls.js';
import { buildTrack } from './Track.js';
import { buildWallColliders, createSphereBody } from './Physics.js';
import { SmokeTrails } from './Particles.js';
import { GameAudio } from './Audio.js';
import GUI from 'lil-gui';

const renderer = new THREE.WebGLRenderer( { antialias: true, outputBufferType: THREE.HalfFloatType } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.75;

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ) );
bloomPass.strength = 0.05;
bloomPass.radius = 0.05;
bloomPass.threshold = 0;

renderer.setEffects( [ bloomPass ] );

document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadb2ba );
scene.fog = new THREE.Fog( 0xadb2ba, 30, 55 );

const dirLight = new THREE.DirectionalLight( 0xffffff, 4 );
dirLight.position.set( 11.4, 15, -5.3 );
dirLight.castShadow = true;
dirLight.shadow.mapSize.setScalar( 4096 );
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 60;
dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
scene.add( dirLight );

const hemiLight = new THREE.HemisphereLight( 0xc8d8e8, 0x7a8a5a, 1 );
scene.add( hemiLight );

const groundGeo = new THREE.PlaneGeometry( 60, 60 );
const groundMat = new THREE.MeshStandardMaterial( { color: 0x5a8a3a } );
const ground = new THREE.Mesh( groundGeo, groundMat );
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.51;
ground.receiveShadow = true;
scene.add( ground );

window.addEventListener( 'resize', () => {

	renderer.setSize( window.innerWidth, window.innerHeight );

} );

const loader = new GLTFLoader();
const modelNames = [
	'vehicle-truck-yellow', 'vehicle-truck-green', 'vehicle-truck-purple', 'vehicle-truck-red',
	'track-straight', 'track-corner', 'track-bump', 'track-finish',
	'decoration-empty', 'decoration-forest', 'decoration-tents',
];

const models = {};

async function loadModels() {

	const promises = modelNames.map( ( name ) =>
		new Promise( ( resolve, reject ) => {

			loader.load( `models/${ name }.glb`, ( gltf ) => {

				gltf.scene.traverse( ( child ) => {

					if ( child.isMesh ) {

						child.material.side = THREE.FrontSide;

					}

				} );

				// Godot imports vehicle models at root_scale=0.5
				if ( name.startsWith( 'vehicle-' ) ) {

					gltf.scene.scale.setScalar( 0.5 );

				}

				models[ name ] = gltf.scene;
				resolve();

			}, undefined, reject );

		} )
	);

	await Promise.all( promises );

}

async function init() {

	registerAll();
	await loadModels();

	window.__scene = scene;
	window.__models = models;
	window.__vehicle = null;
	window.__controls = null;

	buildTrack( scene, models );

	const raycastMeshes = [ ground ];

	const worldSettings = createWorldSettings();
	worldSettings.gravity = [ 0, - 9.81, 0 ];

	const BPL_MOVING = addBroadphaseLayer( worldSettings );
	const BPL_STATIC = addBroadphaseLayer( worldSettings );
	const OL_MOVING = addObjectLayer( worldSettings, BPL_MOVING );
	const OL_STATIC = addObjectLayer( worldSettings, BPL_STATIC );

	enableCollision( worldSettings, OL_MOVING, OL_STATIC );
	enableCollision( worldSettings, OL_MOVING, OL_MOVING );

	const world = createWorld( worldSettings );
	world._OL_MOVING = OL_MOVING;
	world._OL_STATIC = OL_STATIC;

	const debugGroup = new THREE.Group();
	debugGroup.visible = false;
	scene.add( debugGroup );

	const debugMat = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );

	buildWallColliders( world, debugGroup );

	const roadHalfExtents = [ 30, 0.01, 30 ];
	rigidBody.create( world, {
		shape: box.create( { halfExtents: roadHalfExtents } ),
		motionType: MotionType.STATIC,
		objectLayer: OL_STATIC,
		position: [ 0, - 0.125, 0 ],
		friction: 5.0,
		restitution: 0.0,
	} );

	const roadDebug = new THREE.Mesh(
		new THREE.BoxGeometry( 60, 0.02, 60 ),
		debugMat
	);
	roadDebug.position.y = - 0.125;
	debugGroup.add( roadDebug );

	const sphereBody = createSphereBody( world );

	const sphereDebug = new THREE.Mesh(
		new THREE.SphereGeometry( 0.5, 16, 12 ),
		debugMat
	);
	debugGroup.add( sphereDebug );

	const vehicle = new Vehicle();
	vehicle.rigidBody = sphereBody;
	vehicle.physicsWorld = world;
	const vehicleGroup = vehicle.init( models[ 'vehicle-truck-yellow' ] );
	scene.add( vehicleGroup );

	dirLight.target = vehicleGroup;

	const cam = new Camera( renderer );
	cam.targetPosition.copy( vehicle.spherePos );

	const controls = new Controls();
	window.__vehicle = vehicle;
	window.__controls = controls;
	window.__cam = cam;
	window.__world = world;

	const particles = new SmokeTrails( scene );

	const audio = new GameAudio();
	audio.init( cam.camera );

	const gui = new GUI();
	gui.add( debugGroup, 'visible' ).name( 'Debug Physics' );

	const _forward = new THREE.Vector3();

	const contactListener = {
		onContactAdded( bodyA, bodyB ) {

			if ( bodyA !== sphereBody && bodyB !== sphereBody ) return;

			_forward.set( 0, 0, 1 ).applyQuaternion( vehicle.container.quaternion );
			_forward.y = 0;
			_forward.normalize();

			const impactVelocity = Math.abs( vehicle.modelVelocity.dot( _forward ) );
			audio.playImpact( impactVelocity );

		}
	};

	const timer = new THREE.Timer();

	function animate() {

		requestAnimationFrame( animate );

		timer.update();
		const dt = Math.min( timer.getDelta(), 1 / 30 );

		const input = controls.update();

		updateWorld( world, contactListener, dt );

		vehicle.update( dt, input, raycastMeshes );

		sphereDebug.position.copy( vehicle.spherePos );

		dirLight.position.set(
			vehicle.spherePos.x + 11.4,
			15,
			vehicle.spherePos.z - 5.3
		);

		cam.update( dt, vehicle.spherePos );
		particles.update( dt, vehicle );
		audio.update( dt, vehicle.linearSpeed, input.z, vehicle.driftIntensity );

		renderer.render( scene, cam.camera );

	}

	animate();

}

init();

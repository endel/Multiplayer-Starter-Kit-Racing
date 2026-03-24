import * as THREE from 'three';

export class Camera {

	constructor( renderer ) {

		this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 60 );

		// Matches Godot View: 45° azimuth, 35° elevation, distance 16
		this.offset = new THREE.Vector3( 9.27, 9.18, 9.27 );
		this.targetPosition = new THREE.Vector3();

		this.camera.position.copy( this.offset );
		this.camera.lookAt( 0, 0, 0 );

		window.addEventListener( 'resize', () => {

			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();

		} );

	}

	update( dt, target ) {

		this.targetPosition.lerp( target, dt * 4 );

		this.camera.position.copy( this.targetPosition ).add( this.offset );
		this.camera.lookAt( this.targetPosition );

	}

}

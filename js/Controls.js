export class Controls {

	constructor() {

		this.keys = {};
		this.x = 0;
		this.z = 0;

		window.addEventListener( 'keydown', ( e ) => this.keys[ e.code ] = true );
		window.addEventListener( 'keyup', ( e ) => this.keys[ e.code ] = false );

	}

	update() {

		let x = 0, z = 0;

		// Keyboard

		if ( this.keys[ 'KeyA' ] || this.keys[ 'ArrowLeft' ] ) x -= 1;
		if ( this.keys[ 'KeyD' ] || this.keys[ 'ArrowRight' ] ) x += 1;
		if ( this.keys[ 'KeyW' ] || this.keys[ 'ArrowUp' ] ) z += 1;
		if ( this.keys[ 'KeyS' ] || this.keys[ 'ArrowDown' ] ) z -= 1;

		// Gamepad

		const gamepads = navigator.getGamepads();

		for ( const gp of gamepads ) {

			if ( ! gp ) continue;

			const stickX = gp.axes[ 0 ];
			if ( Math.abs( stickX ) > 0.15 ) x = stickX;

			const rt = gp.buttons[ 7 ] ? gp.buttons[ 7 ].value : 0;
			const lt = gp.buttons[ 6 ] ? gp.buttons[ 6 ].value : 0;

			if ( rt > 0.1 || lt > 0.1 ) z = rt - lt;

			break;

		}

		this.x = x;
		this.z = z;

		return { x, z };

	}

}

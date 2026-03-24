import * as THREE from 'three';

export const ORIENT_DEG = { 0: 0, 10: 180, 16: 90, 22: 270 };

export const CELL = 9.99 * 0.75; // 7.4925
export const CELL_RAW = 9.99;
export const GRID_SCALE = 0.75;

export const TRACK_CELLS = [
	[ -3, -3, 'track-corner',   16 ],
	[ -2, -3, 'track-straight', 22 ],
	[ -1, -3, 'track-straight', 22 ],
	[  0, -3, 'track-corner',    0 ],
	[ -3, -2, 'track-straight',  0 ],
	[  0, -2, 'track-straight',  0 ],
	[ -3, -1, 'track-corner',   10 ],
	[ -2, -1, 'track-corner',    0 ],
	[  0, -1, 'track-straight',  0 ],
	[ -2,  0, 'track-straight', 10 ],
	[  0,  0, 'track-finish',    0 ],
	[ -2,  1, 'track-straight', 10 ],
	[  0,  1, 'track-straight',  0 ],
	[ -2,  2, 'track-corner',   10 ],
	[ -1,  2, 'track-straight', 16 ],
	[  0,  2, 'track-corner',   22 ],
];

const DECO_CELLS = [
	[ -4, -2, 'decoration-tents', 10 ],
	[ -1, -4, 'decoration-tents', 22 ],
	[ -1,  1, 'decoration-tents', 22 ],
	[ -8, -9, 'decoration-forest', 0 ], [ -7, -9, 'decoration-forest', 0 ],
	[ -6, -9, 'decoration-forest', 0 ], [ -5, -9, 'decoration-forest', 0 ],
	[ -4, -9, 'decoration-forest', 0 ], [ -3, -9, 'decoration-forest', 0 ],
	[ -2, -9, 'decoration-forest', 0 ], [ -1, -9, 'decoration-forest', 0 ],
	[  0, -9, 'decoration-forest', 0 ], [  1, -9, 'decoration-forest', 0 ],
	[  2, -9, 'decoration-forest', 0 ],
	[ -8, -8, 'decoration-forest', 0 ], [ -7, -8, 'decoration-forest', 0 ],
	[ -6, -8, 'decoration-forest', 0 ], [ -5, -8, 'decoration-forest', 0 ],
	[ -4, -8, 'decoration-forest', 0 ], [ -3, -8, 'decoration-forest', 0 ],
	[ -2, -8, 'decoration-forest', 0 ], [ -1, -8, 'decoration-forest', 0 ],
	[  0, -8, 'decoration-forest', 0 ], [  1, -8, 'decoration-forest', 0 ],
	[  2, -8, 'decoration-forest', 0 ],
	[ -8, -7, 'decoration-forest', 0 ], [ -7, -7, 'decoration-forest', 0 ],
	[ -6, -7, 'decoration-forest', 0 ], [ -5, -7, 'decoration-forest', 0 ],
	[ -4, -7, 'decoration-forest', 0 ], [ -3, -7, 'decoration-forest', 0 ],
	[ -2, -7, 'decoration-forest', 0 ], [ -1, -7, 'decoration-forest', 0 ],
	[  0, -7, 'decoration-forest', 0 ], [  1, -7, 'decoration-forest', 0 ],
	[  2, -7, 'decoration-forest', 0 ],
	[ -8, -6, 'decoration-forest', 0 ], [ -7, -6, 'decoration-forest', 0 ],
	[ -6, -6, 'decoration-forest', 0 ], [ -5, -6, 'decoration-forest', 0 ],
	[ -4, -6, 'decoration-forest', 0 ], [ -3, -6, 'decoration-empty', 0 ],
	[ -2, -6, 'decoration-empty', 0 ],  [ -1, -6, 'decoration-empty', 0 ],
	[  0, -6, 'decoration-empty', 0 ],  [  1, -6, 'decoration-forest', 0 ],
	[  2, -6, 'decoration-forest', 0 ],
	[ -8, -5, 'decoration-forest', 0 ], [ -7, -5, 'decoration-forest', 0 ],
	[ -6, -5, 'decoration-forest', 0 ], [ -5, -5, 'decoration-forest', 0 ],
	[ -4, -5, 'decoration-empty', 0 ],  [ -3, -5, 'decoration-empty', 0 ],
	[ -2, -5, 'decoration-empty', 0 ],  [ -1, -5, 'decoration-empty', 0 ],
	[  0, -5, 'decoration-empty', 0 ],  [  1, -5, 'decoration-forest', 0 ],
	[  2, -5, 'decoration-forest', 0 ],
	[ -8, -4, 'decoration-forest', 0 ], [ -7, -4, 'decoration-forest', 0 ],
	[ -6, -4, 'decoration-forest', 0 ], [ -5, -4, 'decoration-forest', 0 ],
	[ -4, -4, 'decoration-empty', 0 ],
	[  1, -4, 'decoration-forest', 0 ],
	[  2, -4, 'decoration-forest', 0 ],
	[ -8, -3, 'decoration-forest', 0 ], [ -7, -3, 'decoration-forest', 0 ],
	[ -6, -3, 'decoration-forest', 0 ], [ -5, -3, 'decoration-forest', 0 ],
	[ -4, -3, 'decoration-empty', 0 ],
	[  1, -3, 'decoration-forest', 0 ],
	[  2, -3, 'decoration-forest', 0 ],
	[ -8, -2, 'decoration-forest', 0 ], [ -7, -2, 'decoration-forest', 0 ],
	[ -6, -2, 'decoration-forest', 0 ], [ -5, -2, 'decoration-forest', 0 ],
	[  1, -2, 'decoration-forest', 0 ],
	[  2, -2, 'decoration-forest', 0 ],
	[ -8, -1, 'decoration-forest', 0 ], [ -7, -1, 'decoration-forest', 0 ],
	[ -6, -1, 'decoration-forest', 0 ], [ -5, -1, 'decoration-forest', 0 ],
	[ -4, -1, 'decoration-empty', 0 ],  [ -1, -1, 'decoration-empty', 0 ],
	[  1, -1, 'decoration-forest', 0 ],
	[  2, -1, 'decoration-forest', 0 ],
	[ -8,  0, 'decoration-forest', 0 ], [ -7,  0, 'decoration-forest', 0 ],
	[ -6,  0, 'decoration-forest', 0 ], [ -5,  0, 'decoration-forest', 0 ],
	[ -4,  0, 'decoration-empty', 0 ],  [ -3,  0, 'decoration-empty', 0 ],
	[ -1,  0, 'decoration-empty', 0 ],
	[  1,  0, 'decoration-forest', 0 ],
	[  2,  0, 'decoration-forest', 0 ],
	[ -8,  1, 'decoration-forest', 0 ], [ -7,  1, 'decoration-forest', 0 ],
	[ -6,  1, 'decoration-forest', 0 ], [ -5,  1, 'decoration-forest', 0 ],
	[ -4,  1, 'decoration-empty', 0 ],  [ -3,  1, 'decoration-empty', 0 ],
	[  1,  1, 'decoration-forest', 0 ],
	[  2,  1, 'decoration-forest', 0 ],
	[ -8,  2, 'decoration-forest', 0 ], [ -7,  2, 'decoration-forest', 0 ],
	[ -6,  2, 'decoration-forest', 0 ], [ -5,  2, 'decoration-forest', 0 ],
	[ -4,  2, 'decoration-empty', 0 ],  [ -3,  2, 'decoration-empty', 0 ],
	[  1,  2, 'decoration-forest', 0 ],
	[  2,  2, 'decoration-forest', 0 ],
	[ -8,  3, 'decoration-forest', 0 ], [ -7,  3, 'decoration-forest', 0 ],
	[ -6,  3, 'decoration-forest', 0 ], [ -5,  3, 'decoration-forest', 0 ],
	[ -4,  3, 'decoration-forest', 0 ], [ -3,  3, 'decoration-forest', 0 ],
	[ -2,  3, 'decoration-forest', 0 ], [ -1,  3, 'decoration-forest', 0 ],
	[  0,  3, 'decoration-forest', 0 ], [  1,  3, 'decoration-forest', 0 ],
	[  2,  3, 'decoration-forest', 0 ],
	[ -8,  4, 'decoration-forest', 0 ], [ -7,  4, 'decoration-forest', 0 ],
	[ -6,  4, 'decoration-forest', 0 ], [ -5,  4, 'decoration-forest', 0 ],
	[ -4,  4, 'decoration-forest', 0 ], [ -3,  4, 'decoration-forest', 0 ],
	[ -2,  4, 'decoration-forest', 0 ], [ -1,  4, 'decoration-forest', 0 ],
	[  0,  4, 'decoration-forest', 0 ], [  1,  4, 'decoration-forest', 0 ],
	[  2,  4, 'decoration-forest', 0 ],
];

const NPC_TRUCKS = [
	[ 'vehicle-truck-green',  -3.51, -0.01,  12.70,  98.0 ],
	[ 'vehicle-truck-purple', -23.78, -0.14, -13.56,   0.0 ],
	[ 'vehicle-truck-red',    -1.36, -0.15, -23.80, 155.9 ],
];

export function buildTrack( scene, models ) {

	const trackGroup = new THREE.Group();
	trackGroup.position.y = -0.5;

	const trackPieceGroup = new THREE.Group();
	const decoGroup = new THREE.Group();

	for ( const [ gx, gz, key, orient ] of TRACK_CELLS ) {

		const piece = placePiece( models, key, gx, gz, orient );
		if ( piece ) trackPieceGroup.add( piece );

	}

	for ( const [ gx, gz, key, orient ] of DECO_CELLS ) {

		const piece = placePiece( models, key, gx, gz, orient );
		if ( piece ) decoGroup.add( piece );

	}

	trackGroup.add( trackPieceGroup );
	trackGroup.add( decoGroup );

	trackGroup.scale.setScalar( 0.75 );
	scene.add( trackGroup );

	trackGroup.updateMatrixWorld( true );

	trackGroup.traverse( ( child ) => {

		if ( child.isMesh ) {

			child.castShadow = true;
			child.receiveShadow = true;

		}

	} );

	for ( const [ key, x, y, z, rotDeg ] of NPC_TRUCKS ) {

		const src = models[ key ];
		if ( ! src ) continue;

		const npc = src.clone();
		npc.position.set( x, y, z );
		npc.rotation.y = THREE.MathUtils.degToRad( rotDeg + 180 );
		npc.traverse( ( c ) => {

			if ( c.isMesh ) {

				c.castShadow = true;
				c.receiveShadow = true;

			}

		} );
		scene.add( npc );

	}

	return;

}

function placePiece( models, key, gx, gz, orient ) {

	const src = models[ key ];
	if ( ! src ) return null;

	const piece = src.clone();
	piece.position.set( ( gx + 0.5 ) * CELL_RAW, 0.5, ( gz + 0.5 ) * CELL_RAW );

	const deg = ORIENT_DEG[ orient ] || 0;
	piece.rotation.y = THREE.MathUtils.degToRad( deg );

	return piece;

}

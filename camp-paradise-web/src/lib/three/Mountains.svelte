<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	// A single low-poly mountain ridge built from a plane whose vertices are
	// displaced with layered sine noise. Rendered flat-shaded for a faceted look.
	interface Props {
		z?: number;
		color?: string;
		height?: number;
		seed?: number;
		opacity?: number;
	}
	let { z = 0, color = '#0f3d2e', height = 4, seed = 1, opacity = 1 }: Props = $props();

	const width = 60;
	const depth = 12;
	const segW = 48;
	const segD = 8;

	function buildGeometry() {
		const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
		geo.rotateX(-Math.PI / 2);
		const pos = geo.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const zz = pos.getZ(i);
			// ridge rises toward the back (negative z after rotation)
			const ridge = Math.sin(x * 0.12 + seed) * 0.5 + Math.sin(x * 0.31 + seed * 2.3) * 0.3;
			const back = (zz + depth / 2) / depth; // 0 front -> 1 back
			const y = (ridge + 0.6) * height * back + Math.sin(x * 0.7 + seed * 5) * 0.15;
			pos.setY(i, Math.max(0, y));
		}
		geo.computeVertexNormals();
		return geo;
	}

	const geometry = buildGeometry();
</script>

<T.Mesh position={[0, -height * 0.4, z]} {geometry} receiveShadow>
	<T.MeshStandardMaterial
		{color}
		flatShading
		roughness={0.95}
		metalness={0}
		transparent={opacity < 1}
		{opacity}
	/>
</T.Mesh>

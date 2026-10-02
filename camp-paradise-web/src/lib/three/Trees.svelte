<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	// A cluster of low-poly pine trees rendered with a single InstancedMesh for
	// performance. Each pine is a cone (foliage) — trunks are omitted at this
	// scale since they are barely visible against the dark ridges.
	interface Props {
		count?: number;
		z?: number;
		color?: string;
		spread?: number;
		seed?: number;
	}
	let { count = 40, z = -2, color = '#0a2c21', spread = 40, seed = 7 }: Props = $props();

	const geometry = new THREE.ConeGeometry(0.6, 2.4, 5);
	const material = new THREE.MeshStandardMaterial({
		color,
		flatShading: true,
		roughness: 1,
		metalness: 0
	});

	function rand(n: number) {
		const x = Math.sin(n * 12.9898 + seed) * 43758.5453;
		return x - Math.floor(x);
	}

	function buildMatrix() {
		const mesh = new THREE.InstancedMesh(geometry, material, count);
		const dummy = new THREE.Object3D();
		for (let i = 0; i < count; i++) {
			const x = (rand(i) - 0.5) * spread;
			const zz = z - rand(i + 100) * 4;
			const s = 0.6 + rand(i + 200) * 1.1;
			dummy.position.set(x, s * 1.2 - 1.6, zz);
			dummy.scale.set(s, s, s);
			dummy.rotation.y = rand(i + 300) * Math.PI;
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		}
		mesh.instanceMatrix.needsUpdate = true;
		return mesh;
	}

	const instanced = buildMatrix();
</script>

<T is={instanced} />

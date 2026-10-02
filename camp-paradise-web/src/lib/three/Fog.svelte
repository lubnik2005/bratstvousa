<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	// Drifting fog/dust particles — a THREE.Points cloud that slowly rises and
	// wraps around, giving the scene atmosphere and depth.
	interface Props {
		count?: number;
		color?: string;
		area?: number;
	}
	let { count = 220, color = '#c8fad6', area = 50 }: Props = $props();

	const positions = new Float32Array(count * 3);
	const speeds = new Float32Array(count);
	for (let i = 0; i < count; i++) {
		positions[i * 3] = (Math.random() - 0.5) * area;
		positions[i * 3 + 1] = Math.random() * 12 - 2;
		positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
		speeds[i] = 0.15 + Math.random() * 0.4;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const material = new THREE.PointsMaterial({
		color,
		size: 0.14,
		transparent: true,
		opacity: 0.5,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	const points = new THREE.Points(geometry, material);

	useTask((delta) => {
		const pos = geometry.attributes.position as THREE.BufferAttribute;
		for (let i = 0; i < count; i++) {
			let y = pos.getY(i) + speeds[i] * delta;
			if (y > 10) y = -2;
			pos.setY(i, y);
		}
		pos.needsUpdate = true;
	});
</script>

<T is={points} />

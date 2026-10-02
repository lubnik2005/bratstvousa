<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import Mountains from './Mountains.svelte';
	import Trees from './Trees.svelte';
	import Fog from './Fog.svelte';

	// Parallax targets driven by the parent (mouse + scroll progress 0..1).
	interface Props {
		pointer?: { x: number; y: number };
		scroll?: number;
	}
	let { pointer = { x: 0, y: 0 }, scroll = 0 }: Props = $props();

	const { camera } = useThrelte();
	let camX = 0;
	let camY = 2;

	useTask(() => {
		// ease camera toward pointer + scroll dolly
		const targetX = pointer.x * 2.2;
		const targetY = 2 + pointer.y * 0.8 - scroll * 1.5;
		camX += (targetX - camX) * 0.05;
		camY += (targetY - camY) * 0.05;
		const cam = camera.current as THREE.PerspectiveCamera;
		cam.position.x = camX;
		cam.position.y = camY;
		cam.position.z = 16 - scroll * 4;
		cam.lookAt(0, 1.2, -6);
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 2, 16]} fov={42} />

<T.AmbientLight intensity={0.55} color="#cde7dd" />
<T.DirectionalLight position={[6, 10, 4]} intensity={1.1} color="#f2f7d9" />
<T.DirectionalLight position={[-8, 4, -6]} intensity={0.4} color="#5be49b" />

<!-- far to near ridges, atmospheric color banding -->
<Mountains z={-14} color="#123a2c" height={6} seed={3} opacity={0.85} />
<Mountains z={-9} color="#0f3d2e" height={5} seed={1.6} />
<Mountains z={-5} color="#0b3324" height={4} seed={4.2} />
<Trees count={46} z={-3} color="#0a2c21" spread={44} seed={9} />
<Fog count={200} color="#c8fad6" area={52} />

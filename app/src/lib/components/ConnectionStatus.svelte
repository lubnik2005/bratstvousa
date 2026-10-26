<script lang="ts">
	import { onMount } from 'svelte';
	let offline = false;
	onMount(() => {
		const sync = (): void => {
			offline = !navigator.onLine;
		};
		sync();
		window.addEventListener('online', sync);
		window.addEventListener('offline', sync);
		return () => {
			window.removeEventListener('online', sync);
			window.removeEventListener('offline', sync);
		};
	});
</script>

{#if offline}<div class="connection-status" role="status">
		Вы не в сети · Сохранённые данные могут устареть. Для регистрации нужно подключение.
	</div>{/if}

<style>
	.connection-status {
		padding: 10px 18px;
		background: #ede3cc;
		color: #574c37;
		font-size: 12px;
		text-align: center;
	}
</style>

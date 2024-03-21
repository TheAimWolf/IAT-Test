<script>
	import '../app.pcss';
	import { DarkMode } from 'flowbite-svelte';
</script>

<div class="dark:bg-slate-800 overflow-hidden">
	<DarkMode />
	<slot />
</div>


<script lang="ts">
	import { Button } from 'flowbite-svelte'
	import { goto } from '$app/navigation';
    export let result:string;

	const returnToHome = function() {
		goto('/', {replaceState: true});
	}
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex h-full w-full justify-center">
		<div class="h-full w-full rounded-lg border-2 bg-slate-500">
			<div class="flex flex-col">
				<div class="flex justify-between">
					<h1 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Deine Ergebnisse
					</h1>
				</div>
			</div>
			<div class="flex h-4/5 w-full flex-col items-center justify-center place-content-center overflow-hidden">
				<div class="flex h-4/5 w-8/12 flex-col items-center justify-center">
					<h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{result}
					</h1>
					<div class="mt-2">
						<Button on:click={returnToHome}>Zurück zur Hauptseite</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

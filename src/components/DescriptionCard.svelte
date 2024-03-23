<script lang="ts">
	import { Label, Input, Button, Helper } from 'flowbite-svelte';
	let userAge: any;
	let error: boolean = false;

	const takeTest = () => {
		let tryUserAge = Number(userAge);
		if (typeof tryUserAge === 'number' && userAge > 0 && userAge <= 110) {
			curUserAge = tryUserAge;
			curState = 'test';
		} else {
			error = true;
		}
	};
	export let curTestInfo: any, curState: string, curUserAge: number;
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="flex h-full w-full justify-center">
		<div class="h-full w-full rounded-lg border-2 bg-slate-500">
			{#if curTestInfo}
				<div class="flex flex-col">
					<div class="flex justify-between">
						<h1 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{curTestInfo.label}
						</h1>
					</div>
				</div>
				<div class="flex h-4/5 w-full flex-col items-center justify-center">
					<div class="flex h-4/5 w-8/12 flex-col items-center justify-center">
						<h1 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							<p>{curTestInfo.description}</p>
						</h1>
						<div class="mb-6">
							<div class="mb-6">
								<Label for="age" color="gray" class="mb-2 block">Dein Alter</Label>
								<Input id="age" color="base" placeholder="21" bind:value={userAge} />
								{#if error}
									<Helper class="mt-2" color="red"
										><span class="font-medium">Fehler</span> Bitte gebe eine gültiges Alter ein</Helper
									>
								{/if}
							</div>
						</div>
						<div>
							<Button on:click={takeTest}>Test starten</Button>
						</div>
					</div>
				</div>
			{:else}
				<h1 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Loading...
				</h1>
			{/if}
		</div>
	</div>
</div>

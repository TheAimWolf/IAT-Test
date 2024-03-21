<script lang='ts'>
    export let leftWords:Array<string> = [], rightWords:Array<string> = [], middleWord:string|null, picture:string|null;
</script>

<div class="w-full h-full flex flex-col items-center">
    <div class="flex justify-center w-full h-full">
        <div class="bg-slate-500 rounded-lg border-2 w-full h-full">
            <div class="flex flex-col">
                <div class="flex justify-between">
                    <div>
                        {#each leftWords as leftWord} 
                            <h5 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {leftWord}
                            </h5>
                        {/each}
                    </div>
                    <div>
                        {#each rightWords as rightWord} 
                        <h5 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {rightWord}
                        </h5>
                        {/each}
                    </div>
                </div>
                
            </div>
            <div class="flex h-4/5 w-full flex-col items-center justify-center overflow-hidden">
                <div class="flex h-4/5 w-8/12 flex-col items-center justify-center">
                    <h1 class="m-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {#if middleWord != undefined || middleWord != null}
                            {middleWord}
                        {:else}
                            <img class="max-w-64" src={picture} alt="Bild konnte nicht gefunden werden :(">
                        {/if}
                    </h1>
                </div>
            </div>
        </div>
    </div>
</div>
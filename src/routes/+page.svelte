<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChevronDownSolid } from 'flowbite-svelte-icons';
    let dropdownOpen = false;
    let tests: Array<{ name: string, label: string }> = [
        { name: 'skin', label: 'Hautfarbe' },
        //{ name: 'food', label: 'Essen' }
    ];
    let selectedTest: { name: string, label: string } = tests[0];

    function takeTest() {
        window.location.href = 'take-test?testName=' + selectedTest.name;
    }

    function changeTest(test: { name: string, label: string }) {
        selectedTest = test
    }
</script>

    <div class="flex h-screen items-center justify-center">
        
        <div class="m-1">
            <Button size="xl" on:click={() => dropdownOpen = !dropdownOpen}>{selectedTest.label}<ChevronDownSolid class="w-3 h-3 ms-2 text-white dark:text-white" /></Button>
            <Dropdown bind:open={dropdownOpen}>
                {#each tests as test}
                <DropdownItem size="xl" on:click={() => {changeTest(test); dropdownOpen = false}}>{test.label}</DropdownItem>
                {/each}
            </Dropdown>
        </div>
        <div class="m-1">
            <Button size="xl" on:click={takeTest}>Test starten</Button>
        </div>
    </div>

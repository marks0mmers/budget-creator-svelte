<script lang="ts">
    import { budgetStore } from "../../store/budget.store";
    import SourcesList from "./SourcesList.svelte";

    const { selectedBudget } = budgetStore;
</script>

<main class="budget-dashboard">
    {#if $selectedBudget}
        <SourcesList
            budgetId="{$selectedBudget.id}"
            incomeSources="{$selectedBudget.incomeSources}"
        />
    {/if}
</main>

<style lang="scss">
    .budget-dashboard {
        height: calc(100% - 100px);
        background: rgb(250, 250, 250);
        padding: 20px;
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr 3fr;
        grid-template-areas: "income-sources . ";
    }
</style>

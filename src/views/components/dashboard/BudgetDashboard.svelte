<script lang="ts">
    import { budgetStore } from "../../../store/budget.store";
    import Categories from "./categories/Categories.svelte";
    import SourcesList from "./SourcesList.svelte";
    import ItemsList from "./ItemsList.svelte";
    import DashboardControls from "./DashboardControls.svelte";

    const { selectedBudget } = budgetStore;

    let title: string;
    $: title = $selectedBudget?.title ?? "Budget Creator";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main class="budget-dashboard">
    {#if $selectedBudget}
        <SourcesList
            budgetId="{$selectedBudget.id}"
            incomeSources="{$selectedBudget.incomeSources}"
            expenseSources="{$selectedBudget.expenseSources}"
        />
        <DashboardControls />
        <Categories />
        <ItemsList />
    {/if}
</main>

<style lang="scss">
    .budget-dashboard {
        height: calc(100% - 100px);
        background: rgb(250, 250, 250);
        padding: 20px;
        display: grid;
        row-gap: 10px;
        column-gap: 10px;
        grid-template-rows: auto auto 1fr;
        grid-template-columns: 1fr 3fr;
        grid-template-areas:
            "income-sources controls"
            "income-sources categories"
            "income-sources items";
    }
</style>

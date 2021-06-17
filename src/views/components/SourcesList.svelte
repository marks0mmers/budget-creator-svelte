<script lang="ts">
    import type {IncomeSource} from "../../models/income-source";
    import CircleButton from "../shared/CircleButton.svelte";
    import IncomeSourceView from "./IncomeSourceView.svelte";
    import IncomeSourceForm from "./forms/IncomeSourceForm.svelte";

    export let budgetId = 0
    export let incomeSources = new Map<number, IncomeSource>()

    let mouseInIncomeLabel = false;
    let formShowing = false;

    $: incomeSourceValues = [...incomeSources.values()].sort((a, b) => a.name.localeCompare(b.name));

    $: totals = incomeSourceValues
        .reduce((total, i) => total + i.amount, 0)
        .toFixed(2)
</script>

<section class="income-sources">
    <h3
        class="income-sources-label"
        on:mouseenter={() => mouseInIncomeLabel = true}
        on:mouseleave={() => mouseInIncomeLabel = false}
    >
        Income Sources
        <CircleButton
            id="add-income-source"
            icon="add"
            visible={mouseInIncomeLabel}
            on:click={() => formShowing = true}
        />
    </h3>
    <div id="income-sources-container">
        {#each incomeSourceValues as incomeSource, index}
            <IncomeSourceView
                {index}
                {budgetId}
                {incomeSource}
            />
        {/each}
        {#if formShowing}
            <IncomeSourceForm
                {budgetId}
                on:hideForm={() => formShowing = false}
            />
        {/if}
    </div>
    <footer class="total">
        <span>Total</span>
        <span>{totals}</span>
    </footer>
</section>

<style lang="scss">
  .income-sources {
    background: white;
    grid-area: income-sources;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: grid;
    grid-template-rows: auto 1fr auto;

    .income-sources-label {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr auto;
      font-weight: normal;
      border-bottom: 1px solid lightgray;
    }

    .total {
      padding: 10px;
      display: grid;
      grid-template-columns: 1fr auto 40px;
      grid-column-gap: 5px;
      border-top: 1px solid lightgray;
    }
  }
</style>

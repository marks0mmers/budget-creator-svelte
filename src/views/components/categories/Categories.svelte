<script lang="ts">
    import type { ExpenseCategory } from "../../../models/expense-category";
    import CategoryView from "./CategoryView.svelte";

    export let expenseCategories = new Map<string, ExpenseCategory>();

    // let isAdding = false;

    let expenseCategoryValues: ExpenseCategory[];
    $: expenseCategoryValues = [...expenseCategories.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
</script>

<div class="categories-container">
    <h3 class="categories-title">Categories:</h3>
    {#each expenseCategoryValues as expenseCategory}
        <CategoryView text="{expenseCategory.name}" />
    {/each}
    <CategoryView text="New" />
</div>

<style lang="scss">
    .categories-container {
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 10px;

        grid-area: categories;
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 1fr;
        grid-auto-columns: auto;

        .categories-title {
            font-weight: normal;
        }
    }
</style>

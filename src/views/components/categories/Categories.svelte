<script lang="ts">
    import CategoryView from "./CategoryView.svelte";
    import { onMount } from "svelte";
    import { expenseCategoryStore } from "../../../store/expense-category.store";
    import type { ExpenseSubCategory } from "../../../models/expense-sub-category";
    import { derived } from "svelte/store";
    import { slide } from "svelte/transition";

    const { expenseCategories, selectedCategory } = expenseCategoryStore;
    const expenseCategoryValues = derived(expenseCategories, categories =>
        [...categories.values()].sort((a, b) => a.name.localeCompare(b.name)),
    );

    let expenseSubCategoryValues: ExpenseSubCategory[];
    $: expenseSubCategoryValues = $selectedCategory?.subCategories
        ? [...$selectedCategory.subCategories.values()].sort((a, b) => a.name.localeCompare(b.name))
        : [];

    onMount(async () => {
        await expenseCategoryStore.getExpenseCategories();
    });
</script>

<div class="categories-container">
    <div class="categories-row">
        <h3 class="categories-title">Categories:</h3>
        {#each $expenseCategoryValues as expenseCategory}
            <CategoryView category="{expenseCategory}" />
        {/each}
        <CategoryView />
    </div>
    {#if $selectedCategory}
        <div class="sub-categories-row" transition:slide>
            <h4 class="categories-title">Sub-Categories:</h4>
            {#each expenseSubCategoryValues as expenseSubCategory}
                <CategoryView mode="sub-category" category="{expenseSubCategory}" />
            {/each}
            <CategoryView mode="sub-category" />
        </div>
    {/if}
</div>

<style lang="scss">
    .categories-container {
        grid-area: categories;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 10px;

        .categories-row,
        .sub-categories-row {
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: 1fr;
            grid-auto-columns: auto;

            .categories-title {
                font-weight: normal;
            }
        }

        .sub-categories-row {
            margin-top: 10px;
        }
    }
</style>

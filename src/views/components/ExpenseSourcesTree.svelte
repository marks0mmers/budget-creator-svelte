<script lang="ts">
    import type { ExpenseSourceTree } from "../models/expense-source-tree";
    import { expenseCategoryStore } from "../../store/expense-category.store";
    import ExpenseSourceView from "./ExpenseSourceView.svelte";

    const { expenseCategories } = expenseCategoryStore;

    export let budgetId: number;
    export let expenseSourceTree: ExpenseSourceTree;
</script>

<div id="expense-sources-container">
    {#each [...$expenseCategories.values()] as expenseCategory}
        <div class="expense-category-label">
            <i
                class="expand-collapse material-icons"
                on:click="{() =>
                    (expenseSourceTree = expenseSourceTree.toggleCollapsed(expenseCategory.id))}"
            >
                {expenseSourceTree.isCollapsed(expenseCategory.id)
                    ? "chevron_right"
                    : "expand_more"}
            </i>
            {expenseCategory.name}
        </div>
        {#if !expenseSourceTree.isCollapsed(expenseCategory.id)}
            {#each [...expenseCategory.subCategories.values()] as expenseSubCategory}
                <div class="expense-sub-category-label">
                    <i
                        class="expand-collapse material-icons"
                        on:click="{() =>
                            (expenseSourceTree = expenseSourceTree.toggleCollapsed(
                                expenseCategory.id,
                                expenseSubCategory.id,
                            ))}"
                    >
                        {expenseSourceTree.isCollapsed(expenseCategory.id, expenseSubCategory.id)
                            ? "chevron_right"
                            : "expand_more"}
                    </i>
                    {expenseSubCategory.name}
                </div>
                {#if !expenseSourceTree.isCollapsed(expenseCategory.id, expenseSubCategory.id)}
                    {#each expenseSourceTree.getSources(expenseCategory.id, expenseSubCategory.id) ?? [] as expenseSource, idx}
                        <ExpenseSourceView
                            index="{idx}"
                            budgetId="{budgetId}"
                            expenseSource="{expenseSource}"
                        />
                    {/each}
                {/if}
            {/each}
            {#if !expenseSourceTree.getSources(expenseCategory.id)}
                {#each expenseSourceTree.getSources(expenseCategory.id) ?? [] as expenseSource, idx}
                    <ExpenseSourceView
                        index="{idx}"
                        budgetId="{budgetId}"
                        expenseSource="{expenseSource}"
                    />
                {/each}
            {/if}
        {/if}
    {/each}
</div>

<style lang="scss">
    .expense-category-label,
    .expense-sub-category-label {
        background: #fff4e1;
        border-bottom: 1px solid #fce7ce;
    }

    .expense-category-label {
        padding-left: 20px;
    }

    .expense-sub-category-label {
        padding-left: 40px;
    }

    .expand-collapse {
        cursor: pointer;
        margin: auto 0;
        font-size: 14px;
    }
</style>

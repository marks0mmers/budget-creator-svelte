<script lang="ts">
    import { clickOutside } from "../../../../actions/click-outside";
    import type { ExpenseCategory } from "../../../../models/expense-category";
    import type { ExpenseSubCategory } from "../../../../models/expense-sub-category";
    import { expenseCategoryStore } from "../../../../store/expense-category.store";
    import HeaderButton from "../../../shared/header/HeaderButton.svelte";
    import HeaderDivider from "../../../shared/header/HeaderDivider.svelte";
    import { expenseSubCategoryStore } from "../../../../store/expense-sub-category.store";

    export let category: ExpenseCategory | ExpenseSubCategory | undefined = undefined;
    export let mode: "category" | "sub-category" = "category";

    const { selectedCategoryId } = expenseCategoryStore;
    const { selectedSubCategoryId } = expenseSubCategoryStore;

    let isEditing = false;
    let name = category?.name ?? "";
    let inputRef: HTMLInputElement;

    $: if (inputRef) {
        inputRef.focus();
    }

    let isSelected: boolean;
    $: isSelected = !!(mode === "category"
        ? $selectedCategoryId && $selectedCategoryId === category?.id
        : $selectedSubCategoryId && $selectedSubCategoryId === category?.id);

    const handleSubmit = async () => {
        isEditing = false;
        if (name !== "") {
            if (category) {
                switch (mode) {
                    case "category":
                        await expenseCategoryStore.updateExpenseCategory(category.id, { name });
                        break;
                    case "sub-category":
                        if ($selectedCategoryId) {
                            await expenseSubCategoryStore.updateExpenseSubCategory(
                                $selectedCategoryId,
                                category.id,
                                { name },
                            );
                        }
                        break;
                }
            } else {
                switch (mode) {
                    case "category":
                        await expenseCategoryStore.createExpenseCategory({ name });
                        break;
                    case "sub-category":
                        if ($selectedCategoryId) {
                            await expenseSubCategoryStore.createExpenseSubCategory(
                                $selectedCategoryId,
                                { name },
                            );
                        }
                        break;
                }
            }
        }
    };

    const deleteCategory = async () => {
        if (category) {
            switch (mode) {
                case "category":
                    await expenseCategoryStore.deleteExpenseCategory(category.id);
                    break;
                case "sub-category":
                    if ($selectedCategoryId) {
                        await expenseSubCategoryStore.deleteExpenseSubCategory(
                            $selectedCategoryId,
                            category.id,
                        );
                    }
                    break;
            }
        }
    };

    function handleClick(e: MouseEvent) {
        if (e.ctrlKey && isSelected) {
            switch (mode) {
                case "category":
                    selectedCategoryId.set(undefined);
                    break;
                case "sub-category":
                    selectedSubCategoryId.set(undefined);
                    break;
            }
        } else if (category) {
            switch (mode) {
                case "category":
                    selectedCategoryId.set(category.id);
                    selectedSubCategoryId.set(undefined);
                    break;
                case "sub-category":
                    selectedSubCategoryId.set(category.id);
                    break;
            }
        } else {
            isEditing = true;
        }
    }
</script>

{#if isSelected}
    <HeaderDivider />
    <HeaderButton
        id="delete-category-button"
        text="{mode === 'category' ? 'Delete Category' : 'Delete Sub-Category'}"
        icon="delete"
        on:click="{deleteCategory}"
    />
{/if}

<button
    class="category-view"
    class:selected="{isSelected}"
    use:clickOutside="{{
        enabled: isEditing,
        cb: () => {
            handleSubmit();
        },
    }}"
    on:click="{handleClick}"
    on:dblclick="{() => (isEditing = true)}"
>
    {#if !isEditing}
        {category ? category.name : "New"}
    {:else}
        <form on:submit|preventDefault="{handleSubmit}">
            <input
                style="width: {name.length * 0.8}ch"
                class="category-input"
                name="categoryName"
                maxlength="50"
                bind:this="{inputRef}"
                bind:value="{name}"
            />
        </form>
    {/if}
</button>

<style lang="scss">
    .selected {
        background-color: rgba(36, 139, 236, 0.2) !important;
    }

    .category-view {
        background: transparent;
        display: flex;
        height: 22px;
        line-height: 20px;
        border: 2px solid rgba(36, 139, 236);
        border-radius: 11px;
        margin-left: 10px;
        padding: 0 20px;
        color: rgb(36, 139, 236);

        &:hover {
            background-color: rgba(36, 139, 236, 0.1);
        }
        //
        //&:active {
        //    background-color: rgba(36, 139, 236, 0.2);
        //}

        .category-input {
            min-width: 60px;
        }
    }
</style>

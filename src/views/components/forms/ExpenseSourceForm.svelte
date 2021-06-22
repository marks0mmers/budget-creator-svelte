<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { derived, writable } from "svelte/store";
    import type { UpsertExpenseSourceContract } from "../../../models/expense-source";
    import { number, object, string } from "yup";
    import { buildErrors } from "../../../util/form-utils";
    import Label from "../../shared/input/Label.svelte";
    import Required from "../../shared/input/Required.svelte";
    import Input from "../../shared/input/Input.svelte";
    import Error from "../../shared/input/Error.svelte";
    import Button from "../../shared/Button.svelte";
    import Number from "../../shared/input/Number.svelte";
    import Select from "../../shared/input/Select.svelte";
    import { expenseCategoryStore } from "../../../store/expense-category.store";
    import type { ExpenseSubCategory } from "../../../models/expense-sub-category";
    import type { ExpenseSource } from "../../../models/expense-source";
    import { expenseSourceStore } from "../../../store/expense-source.store";
    import { budgetStore } from "../../../store/budget.store";

    const { selectedBudgetId } = budgetStore;
    const { expenseCategories } = expenseCategoryStore;
    const expenseCategoryValues = derived(expenseCategories, (categories) => [
        ...categories.values(),
    ]);

    const dispatch = createEventDispatcher();

    export let initialValues: ExpenseSource | undefined = undefined;

    let submitted = false;
    let errors = new Map<string, string>();

    const expenseSourceForm = writable<UpsertExpenseSourceContract>({
        name: initialValues?.name ?? "",
        amount: initialValues?.amount ?? 0,
        categoryId: initialValues?.category?.id ?? 0,
        subCategoryId: initialValues?.subCategory?.id ?? undefined,
    });

    expenseSourceForm.subscribe(() => {
        submitted = false;
        errors = new Map<string, string>();
    });

    const expenseSourceSchema = object().shape({
        name: string().required("Name is required"),
        amount: number().required("Amount is required").min(1, "Amount must be positive"),
        categoryId: number().required("Category is required"),
    });

    $: if (submitted) {
        expenseSourceSchema.validate($expenseSourceForm, { abortEarly: false }).catch((err) => {
            errors = buildErrors(errors, err);
        });
    }

    let subCategories: Map<number, ExpenseSubCategory>;
    $: subCategories =
        ($expenseSourceForm.categoryId &&
            $expenseCategories.get($expenseSourceForm.categoryId)?.subCategories) ||
        new Map<number, ExpenseSubCategory>();

    let subCategoryValues: ExpenseSubCategory[];
    $: subCategoryValues = [...subCategories.values()].sort((a, b) => a.name.localeCompare(b.name));

    async function expenseSourceFormSubmit() {
        submitted = true;
        const isValid = await expenseSourceSchema.isValid($expenseSourceForm);
        if (isValid && $selectedBudgetId) {
            dispatch("exitModal");
            if (initialValues) {
                await expenseSourceStore.updateExpenseSource(
                    $selectedBudgetId,
                    initialValues.id,
                    $expenseSourceForm,
                );
            } else {
                await expenseSourceStore.createExpenseSource($selectedBudgetId, $expenseSourceForm);
            }
        }
    }
</script>

<form class="expense-source-form" on:submit|preventDefault="{expenseSourceFormSubmit}">
    <Label forValue="name" gridArea="name">
        Name
        <Required />
        <Input id="name" bind:value="{$expenseSourceForm.name}" />
        <Error>{errors.has("name") ? errors.get("name") : ""}</Error>
    </Label>
    <Label forValue="amount" gridArea="amount">
        Amount
        <Required />
        <Number id="amount" bind:value="{$expenseSourceForm.amount}" />
        <Error>{errors.has("amount") ? errors.get("amount") : ""}</Error>
    </Label>
    <Label forValue="categoryId" gridArea="category">
        Category
        <Required />
        <Select id="categoryId" bind:value="{$expenseSourceForm.categoryId}">
            <option>Select a Category</option>
            {#each $expenseCategoryValues as expenseCategory}
                <option value="{expenseCategory.id}">{expenseCategory.name}</option>
            {/each}
        </Select>
        <Error>{errors.has("categoryId") ? errors.get("categoryId") : ""}</Error>
    </Label>
    <Label forValue="subCategoryId" gridArea="sub-category">
        Sub-Category
        <Select id="subCategoryId" bind:value="{$expenseSourceForm.subCategoryId}">
            <option></option>
            {#each subCategoryValues as expenseSubCategory}
                <option value="{expenseSubCategory.id}">{expenseSubCategory.name}</option>
            {/each}
        </Select>
        <Error>{errors.has("subCategoryId") ? errors.get("subCategoryId") : ""}</Error>
    </Label>
    <Button
        id="expense-source-form-submit"
        type="submit"
        text="Submit"
        height="{40}"
        gridArea="submit"
    />
</form>

<style lang="scss">
    .expense-source-form {
        width: 600px;
        display: grid;
        grid-row-gap: 10px;
        grid-template-columns: repeat(4, 1fr);
        grid-template-areas:
            "name name name amount"
            "category category sub-category sub-category"
            "submit submit submit submit";
    }
</style>

<script lang="ts">
    import moment from "moment";
    import { createEventDispatcher } from "svelte";
    import type { UpsertExpenseItemContract } from "../../../models/expense-item";
    import { expenseSourceStore } from "../../../store/expense-source.store";
    import { number, object, string } from "yup";
    import { useForm } from "./use-form";
    import { expenseItemStore } from "../../../store/expense-item.store";
    import Label from "../../shared/input/Label.svelte";
    import Required from "../../shared/input/Required.svelte";
    import Input from "../../shared/input/Input.svelte";
    import Error from "../../shared/input/Error.svelte";
    import Number from "../../shared/input/Number.svelte";
    import Date from "../../shared/input/Date.svelte";
    import Button from "../../shared/Button.svelte";

    const dispatch = createEventDispatcher();

    export let initialValues: UpsertExpenseItemContract | undefined = undefined;

    const { selectedExpenseSourceId } = expenseSourceStore;

    const expenseItemSchema = object({
        name: string().required("Name is required"),
        amount: number().required("Amount is required").min(1, "Amount must be positive"),
        dateTransacted: object().required("Date Transacted is required"),
    });

    const {
        errors,
        form: expenseItemForm,
        onSubmit,
    } = useForm(
        {
            name: initialValues?.name ?? "",
            amount: initialValues?.amount ?? 0,
            dateTransacted: moment(initialValues?.dateTransacted),
        },
        expenseItemSchema,
    );

    const expenseItemSubmit = async () => {
        if ($selectedExpenseSourceId) {
            await expenseItemStore.createExpenseItems({
                name: $expenseItemForm.name,
                amount: $expenseItemForm.amount,
                dateTransacted: $expenseItemForm.dateTransacted.format("YYYY-MM-DD"),
                expenseSourceId: $selectedExpenseSourceId,
            });
        }
        dispatch("exitModal");
    };
</script>

<form class="expense-item-form" on:submit|preventDefault="{onSubmit(expenseItemSubmit)}">
    <Label forValue="name">
        Name
        <Required />
        <Input id="name" bind:value="{$expenseItemForm.name}" />
        <Error>{$errors.has("name") ? $errors.get("name") : ""}</Error>
    </Label>
    <Label forValue="amount">
        Amount
        <Required />
        <Number id="amount" bind:value="{$expenseItemForm.amount}" />
        <Error>{$errors.has("amount") ? $errors.get("amount") : ""}</Error>
    </Label>
    <Label forValue="dateTransacted">
        Date Transacted
        <Required />
        <Date id="dateTransacted" bind:value="{$expenseItemForm.dateTransacted}" />
        <Error>{$errors.has("dateTransacted") ? $errors.get("dateTransacted") : ""}</Error>
    </Label>
    <Button id="expense-item-form-submit" type="submit" text="Submit" height="{40}" />
</form>

<style lang="scss">
    .expense-item-form {
        display: grid;
        row-gap: 10px;
    }
</style>

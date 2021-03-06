<script lang="ts">
    import moment from "moment";
    import type { UpsertIncomeItemContract } from "../../../models/income-item";
    import { number, object, string } from "yup";
    import { useForm } from "./use-form";
    import Label from "../../shared/input/Label.svelte";
    import Required from "../../shared/input/Required.svelte";
    import Input from "../../shared/input/Input.svelte";
    import Error from "../../shared/input/Error.svelte";
    import Number from "../../shared/input/Number.svelte";
    import Date from "../../shared/input/Date.svelte";
    import { createEventDispatcher } from "svelte";
    import Button from "../../shared/Button.svelte";
    import { incomeItemStore } from "../../../store/income-item.store";
    import { incomeSourceStore } from "../../../store/income-source.store";

    const dispatch = createEventDispatcher();

    export let incomeSourceId: number | undefined = undefined;
    export let initialValues: UpsertIncomeItemContract | undefined = undefined;

    const { selectedIncomeSourceId } = incomeSourceStore;

    const incomeItemSchema = object({
        name: string().required("Name is required"),
        amount: number().required("Amount is required").min(0.01, "Amount must be positive"),
        dateTransacted: object().required("Date Transacted is required"),
    });

    const {
        errors,
        form: incomeItemForm,
        onSubmit,
    } = useForm(
        {
            name: initialValues?.name ?? "",
            amount: initialValues?.amount ?? 0,
            dateTransacted: moment(initialValues?.dateTransacted),
        },
        incomeItemSchema,
    );

    const incomeItemSubmit = async () => {
        if (incomeSourceId && initialValues) {
            await incomeItemStore.updateIncomeItem(incomeSourceId, {
                name: $incomeItemForm.name,
                amount: $incomeItemForm.amount,
                dateTransacted: $incomeItemForm.dateTransacted.format("YYYY-MM-DD"),
                incomeSourceId: initialValues.incomeSourceId,
            });
        } else if ($selectedIncomeSourceId) {
            await incomeItemStore.createIncomeItem({
                name: $incomeItemForm.name,
                amount: $incomeItemForm.amount,
                dateTransacted: $incomeItemForm.dateTransacted.format("YYYY-MM-DD"),
                incomeSourceId: $selectedIncomeSourceId,
            });
        }
        dispatch("exitModal");
    };
</script>

<form class="income-item-form" on:submit|preventDefault="{onSubmit(incomeItemSubmit)}">
    <Label forValue="name">
        Name
        <Required />
        <Input id="name" bind:value="{$incomeItemForm.name}" />
        <Error>{$errors.has("name") ? $errors.get("name") : ""}</Error>
    </Label>
    <Label forValue="amount">
        Amount
        <Required />
        <Number id="amount" bind:value="{$incomeItemForm.amount}" />
        <Error>{$errors.has("amount") ? $errors.get("amount") : ""}</Error>
    </Label>
    <Label forValue="dateTransacted">
        Date Transacted
        <Required />
        <Date id="dateTransacted" bind:value="{$incomeItemForm.dateTransacted}" />
        <Error>{$errors.has("dateTransacted") ? $errors.get("dateTransacted") : ""}</Error>
    </Label>
    <Button id="income-item-form-submit" type="submit" text="Submit" height="{40}" />
</form>

<style lang="scss">
    .income-item-form {
        display: grid;
        row-gap: 10px;
    }
</style>

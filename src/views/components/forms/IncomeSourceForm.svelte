<script lang="ts">
    import type { UpsertIncomeSourceContract } from "../../../models/income-source";
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";
    import { number, object, string } from "yup";
    import { buildErrors } from "../../../util/form-utils";
    import { fail } from "../../../util/toast-utils";
    import CircleButton from "../../shared/CircleButton.svelte";
    import Label from "../../shared/input/Label.svelte";
    import Required from "../../shared/input/Required.svelte";
    import Input from "../../shared/input/Input.svelte";
    import Number from "../../shared/input/Number.svelte";
    import Button from "../../shared/Button.svelte";
    import { incomeSourceStore } from "../../../store/income-source.store";

    export let budgetId: number;
    export let incomeSourceId = 0;
    export let initialValues: UpsertIncomeSourceContract = undefined;

    const dispatch = createEventDispatcher();

    let submitted = false;

    const incomeSourceForm = writable<UpsertIncomeSourceContract>(
        initialValues || {
            name: "",
            amount: 0,
        }
    );

    incomeSourceForm.subscribe(() => {
        submitted = false;
    });

    const incomeSourceSchema = object().shape({
        name: string().required("Name is required"),
        amount: number()
            .required("Amount is required")
            .min(1, "Amount must be positive"),
    });

    $: if (submitted) {
        incomeSourceSchema
            .validate($incomeSourceForm, { abortEarly: false })
            .catch((err) => {
                const errors = buildErrors(new Map<string, string>(), err);
                errors.forEach((error) => fail(error));
            });
    }

    async function incomeSourceSubmit() {
        const isValid = await incomeSourceSchema.isValid($incomeSourceForm);
        if (isValid) {
            if (incomeSourceId) {
                await incomeSourceStore.updateIncomeSource(
                    budgetId,
                    incomeSourceId,
                    $incomeSourceForm
                );
            } else {
                await incomeSourceStore.addIncomeSource(
                    budgetId,
                    $incomeSourceForm
                );
            }
            hideForm();
        }
    }

    function hideForm() {
        dispatch("hideForm");
    }
</script>

<form
    class="income-source-form"
    on:submit|preventDefault="{incomeSourceSubmit}"
>
    <CircleButton
        id="cancel-edit"
        icon="clear"
        type="button"
        marginTopBottom="{10}"
        visible
        on:click="{hideForm}"
    />
    <Label forValue="name">
        Name
        <Required />
        <Input id="name" bind:value="{$incomeSourceForm.name}" />
    </Label>
    <Label forValue="amount">
        Amount
        <Required />
        <Number id="amount" bind:value="{$incomeSourceForm.amount}" />
    </Label>
    <Button
        id="income-source-form-submit"
        type="submit"
        icon="save"
        height="{40}"
    />
</form>

<style lang="scss">
    .income-source-form {
        padding: 5px;
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: auto 3fr 1fr 40px;
    }
</style>

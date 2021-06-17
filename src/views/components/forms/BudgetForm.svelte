<script lang="ts">
    import Label from "../../shared/input/Label.svelte";
    import Required from "../../shared/input/Required.svelte";
    import Input from "../../shared/input/Input.svelte";
    import {writable} from "svelte/store";
    import type {CreateBudgetContract} from "../../../models/budget";
    import {object, string} from "yup";
    import {buildErrors} from "../../../util/form-utils";
    import Error from "../../shared/input/Error.svelte";
    import Button from "../../shared/Button.svelte";
    import {createEventDispatcher} from "svelte";
    import {budgetStore} from "../../../store/budget.store";

    const dispatch = createEventDispatcher();

    let submitted = false;
    let errors = new Map<string, string>();

    const budgetForm = writable<CreateBudgetContract>({
        title: "",
    });

    budgetForm.subscribe(() => {
        submitted = false;
        errors = new Map<string, string>();
    })

    const budgetSchema = object().shape({
        title: string()
            .required("Title is required")
    });

    $: if (submitted) {
        budgetSchema.validate($budgetForm, {abortEarly: false}).catch(err => {
            errors = buildErrors(errors, err);
        });
    }

    async function budgetFormSubmit() {
        submitted = true;

        const isValid = await budgetSchema.isValid($budgetForm);
        if (isValid) {
            dispatch("exitModal");
            await budgetStore.createBudget($budgetForm);
        }
    }
</script>

<form class="budget-form" on:submit|preventDefault={budgetFormSubmit}>
    <Label forValue="title">
        Title
        <Required/>
        <Input
            id="title"
            bind:value={$budgetForm.title}
        />
        <Error>{errors.has("title") ? errors.get("title") : ""}</Error>
    </Label>
    <Button
        id="budget-form-submit"
        type="submit"
        text="Submit"
        height={40}
    />
</form>

<style lang="scss">
  .budget-form {
    label:last-of-type {
        margin-bottom: 20px;
    }
  }
</style>

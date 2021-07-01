<script lang="ts">
    import Label from "../../shared/input/Label.svelte";
    import Required from "../../shared/input/Required.svelte";
    import Input from "../../shared/input/Input.svelte";
    import { object, string } from "yup";
    import Error from "../../shared/input/Error.svelte";
    import Button from "../../shared/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import { budgetStore } from "../../../store/budget.store";
    import { useForm } from "./use-form";

    const dispatch = createEventDispatcher();

    const budgetSchema = object().shape({
        title: string().required("Title is required"),
    });

    const { errors, form: budgetForm, onSubmit } = useForm({ title: "" }, budgetSchema);

    const budgetFormSubmit = async () => {
        dispatch("exitModal");
        await budgetStore.createBudget($budgetForm);
    };
</script>

<form class="budget-form" on:submit|preventDefault="{onSubmit(budgetFormSubmit)}">
    <Label forValue="title" marginBottom="20px">
        Title
        <Required />
        <Input id="title" bind:value="{$budgetForm.title}" />
        <Error>{$errors.has("title") ? $errors.get("title") : ""}</Error>
    </Label>
    <Button id="budget-form-submit" type="submit" text="Submit" height="{40}" />
</form>

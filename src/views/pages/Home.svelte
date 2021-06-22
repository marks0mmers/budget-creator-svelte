<script lang="ts">
    import HeaderButton from "../shared/header/HeaderButton.svelte";
    import { budgetStore } from "../../store/budget.store";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import BudgetForm from "../components/forms/BudgetForm.svelte";
    import BudgetDashboard from "../components/BudgetDashboard.svelte";

    const { selectedBudgetId } = budgetStore;

    let budgetFormShowing = false;

    function addBudgetClick() {
        budgetFormShowing = true;
    }

    function closeBudgetModal() {
        budgetFormShowing = false;
    }

    async function deleteBudget() {
        if ($selectedBudgetId) {
            await budgetStore.deleteBudget($selectedBudgetId);
        }
    }
</script>

<HeaderButton id="add-budget-button" text="Add Budget" icon="add" on:click="{addBudgetClick}" />
<HeaderButton
    id="delete-budget-button"
    text="Delete Budget"
    icon="delete"
    on:click="{deleteBudget}"
/>

<BudgetDashboard />

{#if budgetFormShowing}
    <Modal on:exitModal="{closeBudgetModal}">
        <ModalHeader title="Budget Form" on:exitModal="{closeBudgetModal}" />
        <BudgetForm on:exitModal="{closeBudgetModal}" />
    </Modal>
{/if}

<script lang="ts">
    import HeaderButton from "../shared/header/HeaderButton.svelte";
    import {onMount} from "svelte";
    import {budgetStore} from "../../store/budget.store";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import {modalStore} from "../../store/modal.store";
    import BudgetForm from "../components/forms/BudgetForm.svelte";
    import BudgetDashboard from "../components/BudgetDashboard.svelte";

    const {selectedBudgetId} = budgetStore;

    function addBudgetClick() {
        modalStore.open("add-budget-modal");
    }

    function closeBudgetModal() {
        modalStore.close("add-budget-modal");
    }

    async function deleteBudget() {
        await budgetStore.deleteBudget($selectedBudgetId);
    }

    onMount(async () => {
        await budgetStore.getBudgets();
    })
</script>

<HeaderButton
    id="add-budget-button"
    text="Add Budget"
    icon="add"
    on:click={addBudgetClick}
/>
<HeaderButton
    id="delete-budget-button"
    text="Delete Budget"
    icon="delete"
    on:click={deleteBudget}
/>

<BudgetDashboard />

<Modal id="add-budget-modal">
    <ModalHeader title="Budget Form" on:exitModal={closeBudgetModal}/>
    <BudgetForm on:exitModal={closeBudgetModal}/>
</Modal>

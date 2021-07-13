<script lang="ts">
    import HeaderButton from "../shared/header/HeaderButton.svelte";
    import { budgetStore } from "../../store/budget.store";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import BudgetForm from "../components/forms/BudgetForm.svelte";
    import BudgetDashboard from "../components/dashboard/BudgetDashboard.svelte";
    import { onMount } from "svelte";
    import { userStore } from "../../store/user.store";
    import { useNavigate } from "svelte-navigator";

    const navigate = useNavigate();

    const { currentUser } = userStore;
    const { selectedBudgetId } = budgetStore;

    let budgetFormShowing = false;

    const addBudgetClick = () => {
        budgetFormShowing = true;
    };

    const closeBudgetModal = () => {
        budgetFormShowing = false;
    };

    const deleteBudget = async () => {
        if ($selectedBudgetId) {
            await budgetStore.deleteBudget($selectedBudgetId);
        }
    };

    onMount(async () => {
        await userStore.getCurrentUser();
        if (!$currentUser) {
            navigate("/login");
        }
    });
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

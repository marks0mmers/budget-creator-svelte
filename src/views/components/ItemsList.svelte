<script lang="ts">
    import AgGridSvelte from "../shared/AgGridSvelte.svelte";
    import { incomeSourceStore } from "../../store/income-source.store";
    import HeaderDivider from "../shared/header/HeaderDivider.svelte";
    import HeaderButton from "../shared/header/HeaderButton.svelte";
    import Modal from "../modal/Modal.svelte";
    import ModalHeader from "../modal/ModalHeader.svelte";
    import IncomeItemForm from "./forms/IncomeItemForm.svelte";

    let incomeItemModalShowing = false;

    const addIncomeItemClick = () => {
        incomeItemModalShowing = true;
    };

    const closeIncomeItemModal = () => {
        incomeItemModalShowing = false;
    };

    const { selectedIncomeSourceId } = incomeSourceStore;
</script>

{#if $selectedIncomeSourceId}
    <HeaderDivider />
    <HeaderButton
        id="add-income-item"
        text="Add Income Item"
        icon="add"
        on:click="{addIncomeItemClick}"
    />
{/if}
<div class="items-list">
    <AgGridSvelte
        gridArea="items-grid"
        data="{[]}"
        columnDefs="{[
            {
                field: 'name',
                headerName: 'Name',
            },
            {
                field: 'amount',
                headerName: 'Amount ($)',
            },
        ]}"
    />
</div>
{#if incomeItemModalShowing}
    <Modal on:exitModal="{closeIncomeItemModal}">
        <ModalHeader title="Income Item Form" on:exitModal="{closeIncomeItemModal}" />
        <IncomeItemForm on:exitModal="{closeIncomeItemModal}" />
    </Modal>
{/if}

<style lang="scss">
    .items-list {
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        height: 100%;
        grid-area: items;

        display: grid;
        grid-template-rows: 40px 1fr;
        grid-template-areas:
            "."
            "items-grid";
    }
</style>

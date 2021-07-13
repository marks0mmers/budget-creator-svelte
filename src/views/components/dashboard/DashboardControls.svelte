<script lang="ts">
    import Button from "../../shared/Button.svelte";
    import { itemFiltersStore } from "../../../store/item-filters.store";

    const { dateFilter } = itemFiltersStore;
</script>

<div class="controls-container">
    <Button
        id="prev-month"
        colorType="transparent"
        icon="chevron_left"
        height="{20}"
        noIconMargin
        on:click="{() => itemFiltersStore.subtractMonthToFilter()}"
    />
    <span class="date-label">{$dateFilter.format("MMMM YYYY")}</span>
    <Button
        id="prev-month"
        colorType="transparent"
        icon="chevron_right"
        height="{20}"
        noIconMargin
        on:click="{() => itemFiltersStore.addMonthToFilter()}"
    />
</div>

<style lang="scss">
    .controls-container {
        grid-area: controls;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 10px;

        display: grid;
        grid-template-columns: 20px 150px 20px;

        .date-label {
            font-weight: bold;
            text-align: center;
        }
    }
</style>

<script lang="ts">
    import {
        ColDef,
        Grid,
        GridApi,
        GridReadyEvent,
        RowSelectedEvent,
        SelectionChangedEvent,
    } from "ag-grid-community";
    import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
    import "ag-grid-community/dist/styles/ag-grid.css";
    import "ag-grid-community/dist/styles/ag-theme-alpine.css";
    import { CustomTotalRowRenderer } from "../models/custom-total-row-renderer";

    const dispatch = createEventDispatcher<{
        rowSelected: RowSelectedEvent;
        selectionChanged: SelectionChangedEvent;
        gridReady: GridReadyEvent;
    }>();

    export let gridArea: string;
    export let data: unknown[];
    export let pinnedBottomRowData: unknown[] = [];
    export let columnDefs: ColDef[];
    export let rowHeight = 40;
    export let defaultColDef: ColDef = {
        flex: 1,
        minWidth: 150,
        floatingFilter: true,
        filter: true,
        sortable: true,
    };

    let ref: HTMLDivElement;
    let grid: Grid;
    let api: GridApi;

    const onGridReady = (e: GridReadyEvent) => {
        api = e.api;
        dispatch("gridReady", e);
    };

    const updateData = (data: unknown[], pinnedBottomRowData: unknown[]) => {
        if (grid && api) {
            api.setRowData(data);
            api.setPinnedBottomRowData(pinnedBottomRowData);
            api.setColumnDefs(columnDefs);
        }
    };

    onMount(() => {
        grid = new Grid(ref, {
            defaultColDef,
            rowHeight,
            headerHeight: 40,
            floatingFiltersHeight: 40,
            columnDefs,
            pinnedBottomRowData,
            rowSelection: "single",
            onSelectionChanged: (e: SelectionChangedEvent) => {
                dispatch("selectionChanged", e);
                tick();
            },
            onRowSelected: (e: RowSelectedEvent) => {
                dispatch("rowSelected", e);
                tick();
            },
            components: {
                CustomTotalRowRenderer,
            },
            rowData: data,
            onGridReady,
        });
    });

    onDestroy(() => {
        if (grid) {
            grid.destroy();
        }
    });

    $: updateData(data, pinnedBottomRowData);

    let styles: { [key: string]: string };
    $: styles = {
        gridArea,
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
        .join(";");
</script>

<div class="container" style="{cssVarStyles}">
    <div bind:this="{ref}" style="height: 100%; width: 100%;" class="ag-theme-alpine"></div>
</div>

<style lang="scss">
    .container {
        width: 100%;
        grid-area: var(--gridArea);
    }
</style>

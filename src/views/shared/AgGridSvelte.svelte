<script lang="ts">
    import { ColDef, Grid, GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
    import { onDestroy, onMount } from "svelte";
    import "ag-grid-community/dist/styles/ag-grid.css";
    import "ag-grid-community/dist/styles/ag-theme-balham.css";

    export let gridArea: string;
    export let data: unknown[];
    export let columnDefs: ColDef[];
    export let options: GridOptions = {
        defaultColDef: {
            flex: 1,
            minWidth: 150,
            floatingFilter: true,
            filter: true,
            sortable: true,
        },
    };

    let ref: HTMLDivElement;
    let grid: Grid;
    let api: GridApi;

    const onGridReady = (e: GridReadyEvent) => {
        api = e.api;
    };

    const updateData = (data: unknown[]) => {
        if (grid && api) {
            api.setRowData(data);
            api.setColumnDefs(columnDefs);
        }
    };

    onMount(() => {
        grid = new Grid(ref, {
            ...options,
            columnDefs,
            rowData: data,
            onGridReady,
        });
    });

    onDestroy(() => {
        if (grid) {
            grid.destroy();
        }
    });

    $: updateData(data);

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
    <div bind:this="{ref}" style="height: 100%; width: 100%;" class="ag-theme-balham"></div>
</div>

<style lang="scss">
    .container {
        width: 100%;
        grid-area: var(--gridArea);
    }
</style>

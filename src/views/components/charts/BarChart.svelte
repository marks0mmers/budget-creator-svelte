<script lang="ts">
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import {
        Chart,
        ChartData,
        ChartType,
        ColorType,
        BarOptions,
        AxisOptions,
        LineOptions,
        TooltipOptions,
    } from "frappe-charts";

    export let data: ChartData;
    export let title = "";
    export let type: ChartType = "line";
    export let height = 300;
    export let animate = true;
    export let axisOptions: AxisOptions = {};
    export let barOptions: BarOptions = {};
    export let lineOptions: LineOptions = {};
    export let tooltipOptions: TooltipOptions = {};
    export let colors: ColorType[] = [];
    export let valuesOverPoints = 0;
    export let isNavigable = false;
    export let maxSlices = 3;

    let chartRef: HTMLDivElement;
    let chart: Chart | null = null;

    onMount(() => {
        chart = new Chart(chartRef, {
            data,
            title,
            type,
            height,
            animate,
            colors,
            axisOptions,
            barOptions,
            lineOptions,
            tooltipOptions,
            valuesOverPoints,
            isNavigable,
            maxSlices,
        });
    });

    afterUpdate(() => {
        chart = new Chart(chartRef, {
            data,
            title,
            type,
            height,
            animate,
            colors,
            axisOptions,
            barOptions,
            lineOptions,
            tooltipOptions,
            valuesOverPoints,
            isNavigable,
            maxSlices,
        });
    });

    onDestroy(() => {
        chart = null;
    });
</script>

<div bind:this="{chartRef}" class="chart"></div>

<style lang="scss">
</style>

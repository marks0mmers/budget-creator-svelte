<script lang="ts">
    import { derived } from "svelte/store";
    import { http } from "../../../util/fetch-utils";
    import { budgetStore } from "../../../store/budget.store";
    import { itemFiltersStore } from "../../../store/item-filters.store";
    import BarChart from "../charts/BarChart.svelte";
    import type { ChartData } from "frappe-charts";

    const { selectedBudget } = budgetStore;
    const { dateFilter } = itemFiltersStore;

    let percentCompleteData: { key: string; value: number; color: string }[] = [];
    let percentCompleteChartData: ChartData;
    $: percentCompleteChartData = {
        labels: percentCompleteData.map(d => d.key),
        datasets: [{ values: percentCompleteData.map(d => d.value) }],
    };

    derived([selectedBudget, dateFilter], r => r).subscribe(async ([budget, date]) => {
        if (budget) {
            const res = await http(
                `/api/analytics/${budget.id}/percentComplete?date=${date.format("YYYY-MM-DD")}`,
            );
            const resData = (await res.json()) as {
                [key: string]: { percent: number; color: string };
            };
            percentCompleteData = Object.entries(resData).map(([key, value]) => ({
                key,
                value: value.percent,
                color: value.color,
            }));
        }
    });
</script>

<div class="charts">
    <BarChart
        data="{percentCompleteChartData}"
        type="bar"
        colors="{percentCompleteData.map(d => d.color)}"
    />
</div>

<style lang="scss">
    .charts {
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        height: 100%;
        grid-area: main;
    }
</style>

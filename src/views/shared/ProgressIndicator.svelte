<script lang="ts">
    export let percentComplete: number;
    export let leftColor = "green";
    export let rightColor = "red";

    let styles: { [key: string]: string };
    $: styles = {
        percentComplete: `${percentComplete * 100}%`,
        leftColor,
        rightColor,
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
        .join(";");
</script>

<div class="progress-indicator" style="{cssVarStyles}">
    <div class="left"></div>
    <div class="right"></div>
</div>

<style lang="scss">
    .progress-indicator {
        display: flex;

        .left {
            background-color: var(--leftColor);
            width: var(--percentComplete);
        }
        .right {
            background-color: var(--rightColor);
            width: calc(100% - var(--percentComplete));
        }
    }
</style>

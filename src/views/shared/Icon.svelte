<script lang="ts">
    export let iconName: string;
    export let size = 20;
    export let margin = 0;
    export let color = "black";

    $: styles = {
        margin: margin ? `${margin}px` : "auto",
        fontSize: `${size}px`,
        color: color,
    };

    $: cssVarStyles = Object.keys(styles)
        .map((key: keyof typeof styles) => `--${key}:${styles[key]}`)
        .join(";");
</script>

<i id="icon" class="material-icons icon" style="{cssVarStyles}">{iconName}</i>

<style lang="scss">
    .icon {
        margin: var(--margin);
        font-size: var(--fontSize);
        color: var(--color);
    }
</style>

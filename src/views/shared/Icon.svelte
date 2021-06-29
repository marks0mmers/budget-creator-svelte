<script lang="ts">
    export let iconName: string;
    export let size = 20;
    export let margin = 0;
    export let color = "black";

    let styles: { [key: string]: string };
    $: styles = {
        margin: margin ? `${margin}px` : "auto",
        fontSize: `${size}px`,
        color: color,
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
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

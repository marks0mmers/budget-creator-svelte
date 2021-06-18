<script lang="ts">
    import Icon from "./Icon.svelte";

    export let id: string | undefined;
    export let tooltip = "";
    export let type: "button" | "submit" | "reset" = "button";
    export let icon: string;
    export let marginTopBottom = 0;
    export let marginLeftRight = 0;
    export let gridArea = "";
    export let visible: boolean | undefined;

    let styles: { [key: string]: string };
    $: styles = {
        opacity: `${visible ? 1 : 0}`,
        transition: `${visible ? "opacity 0.2s" : "opacity 0.2s 0.2s"}`,
        margin: `${marginTopBottom ?? 0}px ${marginLeftRight ?? 0}px`,
        gridArea,
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map((key) => `--${key}:${styles[key]}`)
        .join(";");
</script>

<button
    id="{id}"
    title="{tooltip}"
    type="{type}"
    on:click
    style="{cssVarStyles}"
>
    <Icon iconName="{icon}" size="{16}" color="white" />
</button>

<style lang="scss">
    button {
        background: grey;
        width: 20px;
        height: 20px;
        border: none;
        outline: none;
        font-family: "Roboto", sans-serif;
        padding: 2px 2px;
        font-weight: 500;
        border-radius: 10px;
        opacity: var(--opacity);
        transition: var(--transition);
        margin: var(--margin);
        grid-area: var(--gridArea);

        &:hover {
            filter: brightness(115%);
        }

        &:active {
            filter: brightness(85%);
        }
    }
</style>

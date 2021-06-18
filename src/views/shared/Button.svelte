<script lang="ts">
    import Icon from "./Icon.svelte";
    interface ColorTypeMetadata {
        background: string;
        fontColor: string;
        borderColor?: string;
    }

    const ColorTypes: { [key: string]: ColorTypeMetadata } = {
        primary: {
            background: "#be5342",
            fontColor: "white",
        },
        secondary: {
            background: "rgb(185, 23, 23)",
            fontColor: "white"
        },
        transparent: {
            background: "transparent",
            fontColor: "lightgrey"
        }
    }

    export let id: string;
    export let text = "";
    export let tooltip = "";
    export let type: "button" | "submit" | "reset" = "button";
    export let icon = "";
    export let width = 0;
    export let height = 40;
    export let marginTopBottom = 0;
    export let marginLeftRight = 0;
    export let gridArea = "";
    export let colorType: "primary" | "secondary" | "transparent" = "primary";

    let styles: {};
    $: styles = {
        background: ColorTypes[colorType].background,
        color: ColorTypes[colorType].fontColor,
        width: width ? width + "px" : "100%",
        height: `${height ?? 40}px`,
        margin: `${marginTopBottom ?? 0}px ${marginLeftRight ?? 0}px`,
        gridArea,
    }

    let cssVarStyles: string
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
        .join(';');

</script>

<button
    id={id}
    title={tooltip}
    {type}
    on:click
    style="{cssVarStyles}"
>
    {#if icon}
        <Icon iconName={icon} margin={5} />
    {/if}
    {text}
</button>

<style lang="scss">
  button {
    border: none;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    font-weight: 500;
    border-radius: 6px;
    background: var(--background);
    color: var(--color);
    width: var(--width);
    height: var(--height);
    margin: var(--margin);
    grid-area: var(--gridArea);

    &:hover {
      filter: brightness(115%);
    }
  }
</style>

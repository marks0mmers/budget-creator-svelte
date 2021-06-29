<script lang="ts">
    export let id: string;
    export let required = false;
    export let value = "";
    export let width = 0;
    export let height = 20;
    export let isInvalid = false;
    export let gridArea = "";
    export let marginRight = 0;
    export let marginTop = 0;
    export let marginLeft = 0;
    export let marginBottom = 0;
    export let paddingRight = 0;
    export let paddingTop = 0;
    export let paddingLeft = 0;
    export let paddingBottom = 0;

    let styles: { [key: string]: string };
    $: styles = {
        width: width ? `${width}px` : "100%",
        height: `${height}px`,
        fontSize: `${height * 0.75}px`,
        border: `solid ${isInvalid ? "red" : "#eeeeee"} 1px`,
        gridArea,
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        marginLeft: `${marginLeft}px`,
        marginBottom: `${marginBottom}px`,
        paddingRight: `${paddingRight}px`,
        paddingTop: `${paddingTop}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingBottom: `${paddingBottom}px`,
    };

    let cssVarStyles: string;
    $: cssVarStyles = Object.keys(styles)
        .map(key => `--${key}:${styles[key]}`)
        .join(";");
</script>

<input id="{id}" type="password" required="{required}" bind:value style="{cssVarStyles}" />

<style lang="scss">
    input {
        height: var(--height);
        font-size: var(--fontSize);
        width: var(--width);
        border-radius: 3px;
        border: var(--border);
        grid-area: var(--gridArea);
        margin: var(--marginTop) var(--marginRight) var(--marginBottom) var(--marginLeft);
        padding: var(--paddingTop) var(--paddingRight) var(--paddingBottom) var(--paddingLeft);

        &::placeholder {
            font-size: 12px;
            margin: auto;
        }
    }
</style>

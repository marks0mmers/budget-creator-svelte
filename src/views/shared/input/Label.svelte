<script lang="ts">
    export let forValue: string;
    export let gridArea = "";
    export let marginBottom = "0px";
</script>

<label
    class="label"
    for="{forValue}"
    style="margin-bottom: {marginBottom}; grid-area: {gridArea}"
>
    <slot />
</label>

<style lang="scss">
    .label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
    }
</style>

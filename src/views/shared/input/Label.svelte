<script lang="ts">
    export let forValue: string;
    export let marginBottom = "0px";
</script>

<label class="label" for="{forValue}" style="margin-bottom: {marginBottom}">
    <slot />
</label>

<style lang="scss">
    .label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
    }
</style>

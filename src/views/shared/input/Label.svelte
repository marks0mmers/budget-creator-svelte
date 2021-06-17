<script lang="ts">
    export let forValue: string;
</script>

<label class="label" for={forValue}>
    <slot/>
</label>

<style lang="scss">
  .label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }
</style>

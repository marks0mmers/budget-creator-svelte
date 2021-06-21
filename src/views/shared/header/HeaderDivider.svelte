<script lang="ts">
    import { portal } from "svelte-portal/src/Portal.svelte";
</script>

<hr class="header-divider" use:portal="{'#header-buttons'}" />

<style lang="scss">
    .header-divider {
        min-width: 1px;
        background-color: white;
        border: none;
        margin-left: 10px;
    }
</style>

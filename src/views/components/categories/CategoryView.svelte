<script lang="ts">
    export let text: string;
</script>

<button class="category-view">
    {text}
</button>

<style lang="scss">
    .category-view {
        background-color: rgba(36, 139, 236, 0.1);
        height: 22px;
        border: 2px solid rgba(36, 139, 236);
        border-radius: 11px;
        padding: 0 20px;
        color: rgb(36, 139, 236);

        &:hover {
            background-color: rgba(36, 139, 236, 0.15);
        }

        &:active {
            background-color: rgba(36, 139, 236, 0.2);
        }
    }
</style>

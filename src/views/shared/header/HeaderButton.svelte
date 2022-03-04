<script lang="ts">
    import Icon from "../Icon.svelte";
    import {portal} from "../../../util/portal"

    export let id: string;
    export let text: string;
    export let icon: string;
</script>

<button id="{id}" on:click use:portal="{'#header-buttons'}">
    <Icon iconName="{icon}" margin="{5}" color="white" />
    {text}
</button>

<style lang="scss">
    button {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(0, 0, 0, 0);
        color: white;
        height: 40px;
        min-width: 40px;
        margin-left: 10px;
        border: none;
        font-family: "Roboto", sans-serif;
        font-size: 10px;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        &:active {
            background: rgba(255, 255, 255, 0.2);
        }

        &:focus {
            outline: 0;
        }
    }
</style>

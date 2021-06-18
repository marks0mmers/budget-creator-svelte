<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Button from "../shared/Button.svelte";

    export let title = "";

    const dispatch = createEventDispatcher();

    function exitModal() {
        dispatch("exitModal");
    }
</script>

<div id="modal-header-container">
    <div class="header">
        <h2>{title}</h2>
        <Button
            id="close-modal"
            icon="clear"
            colorType="transparent"
            width="{50}"
            height="{50}"
            on:click="{exitModal}"
        />
    </div>
    <hr class="divider" />
</div>

<style lang="scss">
    .header {
        display: flex;
        justify-content: space-between;

        h2 {
            display: flex;
            align-items: center;
        }
    }

    .divider {
        min-height: 1px;
        background-color: black;
        border: none;
        margin: 10px 0;
    }
</style>

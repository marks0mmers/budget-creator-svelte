<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let ref: HTMLDivElement;

    const modalBox = document.getElementById("modal-box");

    onMount(() => {
        if (ref) {
            modalBox?.appendChild(ref);
            ref.addEventListener("click", (el: any) => {
                if (el.target.className.includes("modal")) {
                    dispatch("exitModal");
                }
            });
        }
    });
</script>

<div id="host" bind:this="{ref}">
    <div class="modal">
        <div class="body">
            <slot />
        </div>
    </div>
    <div class="background"></div>
</div>

<style lang="scss">
    #host {
        .modal {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            z-index: 1000;

            overflow: auto;

            display: grid;
            grid-template-rows: 1fr auto 1fr;
            grid-template-columns: 1fr auto 1fr;
            grid-template-areas:
                ". . ."
                ". content ."
                ". . .";

            .body {
                min-width: 400px;
                grid-area: content;
                background: #fff;
                padding: 10px;
                border-radius: 10px;
            }
        }

        .background {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            background-color: #000;
            opacity: 0.75;

            z-index: 900;
        }
    }
</style>

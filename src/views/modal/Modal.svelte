<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { modalStore } from "../../store/modal.store";

    export let id = "";

    let ref: HTMLDivElement;

    const modalBox = document.getElementById("modal-box");

    function open() {
        ref.style.display = "block";
        modalBox.classList.add("modal-open");
    }

    function close() {
        ref.style.display = "none";
        modalBox.classList.remove("modal-open");
    }

    onMount(() => {
        if (ref) {
            modalBox.appendChild(ref);
            ref.addEventListener("click", (el: any) => {
                if (el.target.className === "modal") {
                    close();
                }
            });
        }
        modalStore.add({
            id,
            open,
            close,
        });
    });

    onDestroy(() => {
        modalStore.remove(id);
    });
</script>

<div id="host" bind:this="{ref}">
    <div class="modal">
        <div class="modal-body">
            <slot />
        </div>
    </div>
    <div class="modal-background"></div>
</div>

<style lang="scss">
    #host {
        display: none;

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

            .modal-body {
                min-width: 400px;
                grid-area: content;
                background: #fff;
                padding: 10px;
                border-radius: 10px;
            }
        }

        .modal-background {
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

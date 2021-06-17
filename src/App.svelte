<script lang="ts">
    import {Router, Route} from "svelte-navigator";
    import { SvelteToast } from "@zerodevx/svelte-toast"
    import Home from "./views/pages/Home.svelte";
    import {userStore} from "./store/user.store";
    import {loadingStore} from "./store/loading.store";
    import {onMount} from "svelte";
    import Header from "./views/shared/header/Header.svelte";
    import Login from "./views/pages/Login.svelte";
    import LoadingMask from "./views/shared/loading-mask/LoadingMask.svelte";

    const {shouldShow: shouldShowLoadingMask} = loadingStore;

    onMount(async () => {
        await userStore.getCurrentUser();
    });
</script>

{#if $shouldShowLoadingMask}
    <LoadingMask />
{/if}
<Router>
    <Header />
    <Route path="/login">
        <Login />
    </Route>
    <Route path="" primary={false}>
        <Home />
    </Route>
</Router>
<SvelteToast/>
<div id="modal-box"></div>


<style lang="scss">
    //#modal-box.modal-open {
    //  overflow: hidden;
    //}
  :root {
    --toastContainerTop: auto;
    --toastContainerRight: auto;
    --toastContainerBottom: 2rem;
    --toastContainerLeft: 2rem;
  }
</style>

<script lang="ts">
    import Button from "../Button.svelte";
    import { budgetStore } from "../../../store/budget.store";
    import { userStore } from "../../../store/user.store";
    import { useLocation, useNavigate } from "svelte-navigator";

    const navigate = useNavigate();
    const location = useLocation();

    const { budgets, selectedBudgetId } = budgetStore;
    const { currentUser } = userStore;

    function logIn() {
        navigate("/login");
    }

    function logOut() {}
</script>

{#if $location.pathname !== "/login"}
    <header class="header">
        <h1 class="header-title">Budget Creator</h1>
        <select name="selected-budget" bind:value="{$selectedBudgetId}">
            <option value="{undefined}">Select a Budget</option>
            {#each [...$budgets] as [key, budget]}
                <option value="{key}">{budget.title}</option>
            {/each}
        </select>
        <div id="header-buttons" class="buttons-container"></div>
        <span class="username">{$currentUser?.fullName || "Please Log In"}</span
        >
        <Button
            id="login-logout-container"
            text="{$currentUser ? 'Log Out' : 'Log In'}"
            height="{40}"
            width="{100}"
            gridArea="button"
            colorType="secondary"
            on:click="{() => ($currentUser ? logOut() : logIn())}"
        />
    </header>
{/if}

<style lang="scss">
    .header {
        grid-area: header;
        height: 60px;
        display: grid;
        grid-template-columns: auto auto 1fr 150px auto;
        grid-column-gap: 20px;
        grid-template-areas: "title budget-selector . user button";
        align-items: center;
        padding: 0 20px;
        background: rgb(185, 23, 23);

        .header-title {
            grid-area: title;
            color: white;
            font-weight: 1;
            padding-right: 15px;
            border-right: 1px solid white;
        }

        .buttons-container {
            display: flex;
            flex-direction: row-reverse;
        }

        .username {
            grid-area: user;
            color: white;
            text-align: center;
            border-right: 1px solid white;
            border-left: 1px solid white;
        }
    }
</style>

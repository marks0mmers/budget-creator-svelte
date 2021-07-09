<script lang="ts">
    import { useNavigate } from "svelte-navigator";
    import { object, string } from "yup";

    import Label from "../shared/input/Label.svelte";
    import Required from "../shared/input/Required.svelte";
    import Input from "../shared/input/Input.svelte";
    import Button from "../shared/Button.svelte";
    import { userStore } from "../../store/user.store";
    import Error from "../shared/input/Error.svelte";
    import Password from "../shared/input/Password.svelte";
    import { useForm } from "../components/forms/use-form";

    const navigate = useNavigate();

    const loginSchema = object({
        username: string().required("Username is required"),
        password: string().required("Password is required"),
    });

    const {
        errors,
        form: loginForm,
        onSubmit,
    } = useForm(
        {
            username: "",
            password: "",
        },
        loginSchema,
    );

    const loginSubmit = async () => {
        await userStore.login($loginForm);
        navigate("/");
    };
</script>

<svelte:head>
    <title>Login to Budget Creator</title>
</svelte:head>

<div id="fill-header"></div>
<main class="login-page">
    <section class="login-container">
        <h1 class="title">Login to Budget Creator</h1>
        <form class="login-form" on:submit|preventDefault="{onSubmit(loginSubmit)}">
            <Label forValue="username" marginBottom="10px">
                Username
                <Required />
                <Input id="username" bind:value="{$loginForm.username}" />
                <Error>{$errors.has("username") ? $errors.get("username") : ""}</Error>
            </Label>
            <Label forValue="password" marginBottom="10px">
                Password
                <Required />
                <Password id="password" bind:value="{$loginForm.password}" />
                <Error>{$errors.has("password") ? $errors.get("password") : ""}</Error>
            </Label>
            <Button id="login-form-submit" type="submit" text="Submit" height="{40}" />
        </form>
    </section>
</main>

<style lang="scss">
    .login-page {
        height: 100%;

        display: grid;
        grid-template-rows: 1fr auto 2fr;
        grid-template-columns: 1fr auto 1fr;
        grid-template-areas:
            ". . ."
            ". container ."
            ". . .";

        background: lightgray;

        .login-container {
            grid-area: container;

            width: 420px;
            background: rgb(185, 23, 23);
            border-radius: 40px 40px 10px 10px;

            .title {
                height: 50px;
                width: 100%;
                color: white;
                text-align: center;
                line-height: 60px;
            }

            .login-form {
                width: 360px;
                margin: 10px;
                background: white;
                padding: 20px;
            }
        }
    }
</style>

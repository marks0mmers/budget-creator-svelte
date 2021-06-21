import { LoginContract, User, UserContract } from "../models/user";
import { writable } from "svelte/store";
import { http } from "../util/fetch-utils";

const currentUser = writable<User | undefined>(undefined);

const getCurrentUser = async () => {
    const res = await http("/api/users/current");
    const user: UserContract = await res.json();
    currentUser.set(User.fromContract(user));
};

const login = async (contract: LoginContract) => {
    const res = await http("/api/users/login", "POST", contract);
    const user: UserContract & { token?: string } = await res.json();
    window.localStorage.setItem("jwtToken", user.token ?? "");
    currentUser.set(User.fromContract(user));
};

export const userStore = {
    currentUser,
    getCurrentUser,
    login,
};

import { LoginContract, User, UserContract } from "../models/user";
import { writable } from "svelte/store";
import { http } from "../util/fetch-utils";

const currentUser = writable<User | undefined>(undefined);

const setCurrentUser = (user?: User) => currentUser.set(user);

const getCurrentUser = async () => {
    const res = await http("/api/users/current");
    const user: UserContract = await res.json();
    setCurrentUser(User.fromContract(user));
};

const login = async (contract: LoginContract) => {
    const res = await http("/api/users/login", "POST", contract);
    const user: UserContract & { token?: string } = await res.json();
    window.localStorage.setItem("jwtToken", user.token ?? "");
    setCurrentUser(User.fromContract(user));
};

export const userStore = {
    currentUser,
    setCurrentUser,
    getCurrentUser,
    login,
};

import { loadingStore } from "../store/loading.store";
import { fail } from "./toast-utils";

const fetchUtils = (
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
): RequestInit => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (localStorage.getItem("jwtToken")) {
        headers.set("Authorization", `Bearer ${localStorage.getItem("jwtToken")}`);
    }
    return {
        method,
        headers,
        body: JSON.stringify(body),
    };
};

export const http = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown,
) => {
    loadingStore.show();
    const res = await fetch(url, fetchUtils(method, body));
    if (res.status !== 200) {
        fail(res.statusText);
    }
    loadingStore.hide();
    return res;
};

import { toast } from "@zerodevx/svelte-toast";

export const fail = (message: string) => {
    toast.push(message, {
        duration: 4000, // duration of progress bar tween
        dismissable: true, // allow dismiss with close button
        initial: 1, // initial progress bar value
        progress: 0, // current progress
        reversed: false, // insert new toast to bottom of stack
        intro: { x: 256 }, // toast intro fly animation settings
        theme: {
            "--toastBackground": "#F56565",
            "--toastProgressBackground": "#C53030",
        },
    });
};

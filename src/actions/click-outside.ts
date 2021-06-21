export const clickOutside = (
    node: HTMLElement,
    { enabled: initialEnabled, cb }: { enabled: boolean; cb: () => void },
) => {
    const handleOutsideClick = ({ target }: { target: any }) => {
        if (!node.contains(target)) {
            cb();
        }
    };

    const update = ({ enabled }: { enabled: boolean }) => {
        if (enabled) {
            window.addEventListener("click", handleOutsideClick);
        } else {
            window.removeEventListener("click", handleOutsideClick);
        }
    };

    update({ enabled: initialEnabled });
    return {
        update,
        destroy: () => {
            window.removeEventListener("click", handleOutsideClick);
        },
    };
};

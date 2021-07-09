export class CustomTotalRowRenderer {
    private eGui = document.createElement("div");

    public init(params: any) {
        for (const property in params.style) {
            // @ts-ignore
            this.eGui.style[property] = params.style[property];
        }
        this.eGui.innerHTML = params.valueFormatted;
    }

    public getGui() {
        return this.eGui;
    }
}

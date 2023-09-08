const canvasElement = document.createElement("canvas");
const ctx = canvasElement.getContext("2d", { alpha: false });
class Screenface {
    static width = 0;
    static height = 0;
    static scale = 0;
    static ratio = 0;
    static interfaceWidth = 0;
    static interfaceHeight = 0;
    static resizeEvent() {
        this.scale = window.devicePixelRatio;
        this.width = window.innerWidth * this.scale;
        this.height = window.innerHeight * this.scale;
        this.size = Math.min(1920, Math.max(window.innerWidth, 1280));
        this.ratio = Math.max(this.width, 16 * this.height / 9) / this.size;
        this.uiwidth = this.width / this.ratio;
        this.uiheight = this.height / this.ratio;
        canvasElement.width = Math.ceil(this.width);
        canvasElement.height = Math.ceil(this.height);
        ctx.imageSmoothingEnabled = false;
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
    }

    static init() {
        window.addEventListener("resize", () => this.resizeEvent());
        this.resizeEvent();
    }
}

Screenface.init();

document.body.appendChild(canvasElement);
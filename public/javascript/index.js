(async function () {
    const TAU = Math.PI * 2;

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

    class AssetManager {
        static others = new Map();
        static images = new Map();
        static audios = new Map();
        static audioTypes = new Map([
            ["mp3", "audio/mpeg"],
            ["ogg", "audio/ogg"],
            ["wav", "audio/wav"]
        ]);

        static async loadExternalAsset(name, fileURL) {
            const extension = fileURL.split(".").slice(-1)[0];
            switch (extension) {
                case "png":
                case "jpg":
                case "jpeg": {
                    const imageElement = document.createElement("img");
                    imageElement.src = fileURL;
                    this.images.set(name, imageElement);
                    await new Promise(resolve => imageElement.onload = () => resolve());
                }; break;
                case "mp3":
                case "ogg":
                case "wav": {
                    const sourceElement = document.createElement("source");
                    sourceElement.src = fileURL;
                    sourceElement.type = this.audioTypes.get(extension);
                    const audioElement = document.createElement("audio");
                    audioElement.appendChild(sourceElement);
                    await new Promise(resolve => audioElement.oncanplaythrough = () => resolve());
                }; break;
                default: {
                    const response = await fetch(fileURL);
                    const data = await response.blob();
                    this.others.set(name, data);
                };
            }
        }
    }

    AssetManager.loadExternalAsset("menu/background", "./resources/background.png");

    function measureText(text, fontSize) {
        ctx.font = `${fontSize}px "Aller Bold"`;
        return ctx.measureText(text).width;
    }

    function drawText(text, x, y, fontSize, strokeText = 0) {
        ctx.font = `${fontSize + 1 | 0}px "Aller Bold"`;
        if (strokeText !== 0) {
            ctx.lineWidth = fontSize * strokeText;
            ctx.strokeText(text, x, y);
        }
        ctx.fillText(text, x, y);
    }

    class Renderer {
        static drawBackground() {
            const image = AssetManager.images.get("menu/background");
            const scaleX = canvasElement.width / image.width;
            const scaleY = canvasElement.height / image.height;
            const scale = Math.max(scaleX, scaleY);
            const offsetX = (canvasElement.width - image.width * scale) * 0.5;
            const offsetY = (canvasElement.height - image.height * scale) * 0.5;
            ctx.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.drawImage(image, offsetX, offsetY, image.width * scale, image.height * scale);
        }

        static drawStartMenu() {
            const size = 120;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#DC98A4";
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = size * 0.1;
            ctx.beginPath();
            ctx.arc(Screenface.uiwidth * 0.5, Screenface.uiheight * 0.5, size, 0, TAU);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#FFFFFF";
            drawText("browsu!", Screenface.uiwidth * 0.5, Screenface.uiheight * 0.5, size * 0.4);
        }

        static drawInterface() {
            ctx.scale(Screenface.ratio, Screenface.ratio);
            this.drawStartMenu();
        }

        static animationFrame() {
            requestAnimationFrame(() => this.animationFrame());
            this.drawBackground();
            this.drawInterface();
        }
    }

    requestAnimationFrame(() => Renderer.animationFrame());
    document.body.appendChild(canvasElement);
})();
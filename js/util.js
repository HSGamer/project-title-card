async function resolveImageLink(imageLink) {
    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Create image
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageLink;

    await new Promise((resolve) => {
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            resolve();
        };
    })

    // Convert canvas to base64
    return canvas.toDataURL("image/png");
}

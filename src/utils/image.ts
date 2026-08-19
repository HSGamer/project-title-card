export async function resolveImageLink(imageLink: string): Promise<string> {
  if (!imageLink) return "";
  if (imageLink.startsWith("data:")) return imageLink;

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return imageLink;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageLink;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => {
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      image.onerror = (err) => {
        reject(err);
      };
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.warn(
      "Failed to convert image to Data URL, using original URL:",
      error,
    );
    return imageLink;
  }
}

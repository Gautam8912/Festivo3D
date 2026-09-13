export async function readImage(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Please choose a JPG, PNG or WEBP image.");
  if (file.size > 20 * 1024 * 1024)
    throw new Error(
      "That photo is a little large. Please choose one under 20 MB.",
    );
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "We couldn’t read that photo. Please try a different JPG, PNG or WEBP image.",
    );
  }
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error("We couldn’t read that image. Please try another photo."),
      );
    image.src = canvas.toDataURL("image/png");
  });
}

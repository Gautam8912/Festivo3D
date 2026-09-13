export function posterBlob(canvas) {
  return new Promise((resolve, reject) => {
    if (!canvas)
      return reject(
        new Error("Your poster is still loading. Please try again."),
      );
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("Could not export. Try a smaller poster size.")),
      "image/png",
    );
  });
}
export function filename(data) {
  return `festivo3d-${data.template}-${
    data.business
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "my-business"
  }.png`;
}
export async function downloadPoster(canvas, data) {
  const blob = await posterBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename(data);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function sharePoster(canvas, data) {
  const file = new File([await posterBlob(canvas)], filename(data), {
    type: "image/png",
  });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: data.business,
      text: data.offer,
    });
    return true;
  }
  return false;
}

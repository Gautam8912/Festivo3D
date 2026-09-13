export function validPhone(value) {
  if (!value?.trim()) return true;
  const n = value.replace(/[\s()+-]/g, "");
  return /^\d{10,15}$/.test(n);
}
export function whatsappMessage(data) {
  return [
    "🎉 " + data.offer,
    data.business,
    "🔥 " + data.discount,
    data.tagline,
    data.phone ? "📞 " + data.phone : "",
    data.address,
    data.cta,
  ]
    .filter(Boolean)
    .join("\n\n");
}
export function whatsappUrl(data) {
  let number = (data.whatsapp || "").replace(/\D/g, "");
  if (number.length === 10) number = "91" + number;
  return `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(data))}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}
export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  const normalizedDate = date.includes("T") ? date : `${date}T00:00:00`;
  const targetDate = new Date(normalizedDate);
  const diffMs = currentDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let formattedDate = "";

  if (diffDays <= 0) {
    formattedDate = "Today";
  } else if (diffDays < 30) {
    formattedDate = `${diffDays}d ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    formattedDate = `${months}mo ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    formattedDate = `${years}y ago`;
  }

  const fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}

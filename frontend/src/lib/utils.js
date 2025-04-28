export function formatDate(day, month, year) {
  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");
  return `${year}-${formattedMonth}-${formattedDay}`;
}

export function validateDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === parseInt(day) &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === parseInt(year)
  );
}

export function formatDateTimeZone(dateString, timeZone) {
  
  if (typeof dateString !== 'string') {
    throw new Error('Invalid dateString: expected a string');
  }

  const dateWithUTC = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
  const date = new Date(dateWithUTC);

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
    timeZone: timeZone, 
  };
  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
  return formattedDate;
}

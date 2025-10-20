export const dateConverter = (isoDateString) => {
  const isoDateObject = new Date(isoDateString);
  const month = isoDateObject.getMonth() + 1;
  const day = isoDateObject.getDate();
  const year = isoDateObject.getFullYear();

  return `${month < 10 ? 0 : ''}${month}/${day < 10 ? 0 : ''}${day}/${year}` 
};

export const yearMonthDayConverter = (monthDayYearFormat) => {
  const dateArray = monthDayYearFormat.split("/");
  return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`;
}

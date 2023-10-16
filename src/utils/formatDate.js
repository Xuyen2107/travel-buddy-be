import { format, parse } from "date-fns";

export const formatDate = (date) => {
   const formattedDate = format(date, "dd/MM/yyyy h:mm:ss a");
   const parsedDate = parse(formattedDate, "dd/MM/yyyy h:mm:ss a", new Date());
   return parsedDate;
};

// return format(date, "dd/MM/yyyy&h:mm:ss a");

// return {
//    date: format(date, "dd/MM/yyyy"),
//    time: format(date, "h:mm:ss a"),
// };

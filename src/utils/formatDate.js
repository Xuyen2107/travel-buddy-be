import { format } from "date-fns";

export const formatDate = (date) => {
   return format(date, "dd/MM/yyyy h:mm:ss a");
};

// date: format(date, "dd/MM/yyyy"),
// time: format(date, "h:mm:ss a"),

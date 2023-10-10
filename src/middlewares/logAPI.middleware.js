import { formatDate } from "../utils/formatDate";

export const logAPI = (req, res, next) => {
   const currentDate = formatDate(new Date());
   console.log(`API is coming at ${currentDate}`);
   next();
};

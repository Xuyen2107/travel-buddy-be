import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { logAPI } from "../middlewares/logAPI.middleware.js";
import albumRouter from "./album.route.js";
import authRouter from "./auth.route.js";
import postRouter from "./post.route.js";
import userRoute from "./user.route.js";
import vacationRouter from "./vacation.route.js";
import passwordRoute from "./password.route.js";
import chatRoute from "./chat.route.js";
import messageRoute from "./message.route.js";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const appRoute = express.Router();

appRoute.use(logAPI);

appRoute.use("/auth", authRouter);
appRoute.use("/password", passwordRoute);
appRoute.use("/user", authMiddleware, userRoute);
appRoute.use("/vacation", authMiddleware, vacationRouter);
appRoute.use("/post", authMiddleware, postRouter);
appRoute.use("/album", authMiddleware, albumRouter);
appRoute.use("/chat", authMiddleware, chatRoute);
appRoute.use("/messages", authMiddleware, messageRoute);
// appRoute.use("/request", authMiddleware);
// appRoute.use("/dmm", (req, res) => {
//    const firebaseApp = initializeApp({
//       apiKey: "AIzaSyA1NyllgzSvk4GOomGQ1TlvFRMTRLDM05Q",
//       authDomain: "travel-buddy-dfe82.firebaseapp.com",
//       projectId: "travel-buddy-dfe82",
//       storageBucket: "travel-buddy-dfe82.appspot.com",
//       messagingSenderId: "327667709704",
//       appId: "1:327667709704:web:033352a6ffff6903a21ebd",
//       measurementId: "G-Q4K448EFC9",
//    });
//    const messaging = getMessaging(firebaseApp);
//    const registrationTokens = [
//       "doLkD2U1zuSZXMp71TN3sy:APA91bHao3AXh3XhI4rpxG10K_PTjCjaeykpBZonJ8VNn9_oMPwS34lfuaAYPsdHmNJhGmV4EKlTLKMFoZUAO3SoaqlqQfwNOVGvVkyWIDtaoY56f0vmP8AOI-NomBgq1dTBO8_adzpw",
//    ];

//    const message = {
//       data: { score: "850", time: "2:45" },
//       tokens: registrationTokens,
//    };

//    getMessaging(messaging)
//       .sendMulticast(message)
//       .then((response) => {
//          console.log(response.successCount + " messages were sent successfully");
//       });
// });

export default appRoute;

// import axios from "axios";

// const requestAxios = () => {
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

//    const sendMessage = async () => {
//       const url = "https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send";

//       const headers = {
//          "Content-Type": "application/json",
//          Authorization: "Bearer ya29.ElqKBGN2Ri_Uz...PbJ_uNasm",
//       };

//       const message = {
//          message: {
//             token: "<token of destination app>",
//             notification: {
//                title: "FCM Message",
//                body: "This is a message from FCM",
//             },
//             webpush: {
//                headers: {
//                   Urgency: "high",
//                },
//                notification: {
//                   body: "This is a message from FCM to web",
//                   requireInteraction: true, // Note: boolean value should not be in quotes
//                   badge: "/badge-icon.png",
//                },
//             },
//          },
//       };

//       try {
//          const response = await axios.post(url, message, { headers });
//          console.log("FCM message sent successfully:", response.data);
//       } catch (error) {
//          console.error("Error sending FCM message:", error.response ? error.response.data : error.message);
//       }
//    };

//    // Call the function to send the message
//    sendMessage();
// };

// export default requestAxios;

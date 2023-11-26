import { body } from "express-validator";
import UserModel from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { userMessages } from "../utils/userMessage.js";



const userValidation = (method) => {
   let validateUser = [];

   const fieldFullName = [body("fullName").notEmpty().withMessage(userMessages.fullName.notEmpty)];

   const fieldUsername = [
      body("userName")
         .notEmpty()
         .withMessage(userMessages.userName.notEmpty)
         .isLength({ min: 6, max: 20 })
         .withMessage(userMessages.userName.length)
         .custom((value) => value.trim() === value)
         .withMessage(userMessages.userName.noSpaces),
   ];

   const fieldEmail = [body("email").notEmpty().withMessage(userMessages.email.notEmpty).isEmail().withMessage(userMessages.email.invalid)];

   const fieldPhoneNumber = [
      body("phoneNumber")
         .notEmpty()
         .withMessage(userMessages.phoneNumber.notEmpty)
         .isMobilePhone("vi-VN", { strictMode: false })
         .withMessage(userMessages.phoneNumber.invalid),
   ];

   const fieldPassword = [
      body("password")
         .notEmpty()
         .withMessage(userMessages.password.notEmpty)
         .isLength({ min: 6, max: 20 })
         .withMessage(userMessages.password.length)
         .matches(/^[a-zA-Z0-9!@#$%^&*()_+=\\[\]{}|;:'",.<>/?`~]*$/)
         .withMessage(userMessages.password.format),
   ];

   if (method === "login") {
      return (validateUser = [
         ...fieldPassword,
         body("loginInfo")
            .notEmpty()
            .withMessage(userMessages.loginInfo.notEmpty)
            .custom(async (loginInfo) => {
               const existingUser = await UserModel.countDocuments({
                  $or: [{ email: loginInfo }, { phoneNumber: loginInfo }, { userName: loginInfo }],
               });

               if (!existingUser) {
                  throw new BadRequestError(userMessages.loginInfo.notRegistered);
               }
            }),
      ]);
   }

   if (method === "register") {
      const checkFieldExists = async (fieldName, value, errorMessage) => {
         const existingUser = await UserModel.countDocuments({ [fieldName]: value });
         if (existingUser) throw new BadRequestError(errorMessage);
      };

      fieldUsername.push(
         body("userName").custom(async (userName) => {
            await checkFieldExists("userName", userName, userMessages.userName.exists);
         }),
      );

      fieldEmail.push(
         body("email").custom(async (email) => {
            await checkFieldExists("email", email, userMessages.email.exists);
         }),
      );

      fieldPhoneNumber.push(
         body("phoneNumber").custom(async (phoneNumber) => {
            await checkFieldExists("phoneNumber", phoneNumber, userMessages.phoneNumber.exists);
         }),
      );

      return (validateUser = [...fieldFullName, ...fieldUsername, ...fieldEmail, ...fieldPhoneNumber, ...fieldPassword]);
   }

   if (method === "updatePassword") {
      return (validateUser = [
         ...fieldPassword,
         body("newPassword")
            .notEmpty()
            .withMessage(userMessages.password.notEmpty)
            .isLength({ min: 6, max: 20 })
            .withMessage(userMessages.password.length)
            .matches(/^[a-zA-Z0-9!@#$%^&*()_+=\\[\]{}|;:'",.<>/?`~]*$/)
            .withMessage(userMessages.password.format),
      ]);
   }

   if (method === "updateUser") {
      const existingField = async (field, value, userId, message) => {
         const existingUser = await UserModel.findOne({
            $and: [{ [field]: value }, { _id: { $ne: userId } }],
         });

         if (existingUser) {
            throw new Error(message);
         }
      };

      fieldUsername.push(
         body("userName").custom(async (value, { req }) => {
            await existingField("userName", value, req.user.userId, userMessages.userName.exists);
         }),
      );

      fieldEmail.push(
         body("email").custom(async (value, { req }) => {
            await existingField("email", value, req.user.userId, userMessages.email.exists);
         }),
      );

      fieldPhoneNumber.push(
         body("phoneNumber").custom(async (value, { req }) => {
            await existingField("phoneNumber", value, req.user.userId, userMessages.phoneNumber.exists);
         }),
      );

      return (validateUser = [
         ...fieldFullName,
         ...fieldUsername,
         ...fieldEmail,
         ...fieldPhoneNumber,
         body("age").notEmpty().withMessage(userMessages.age.notEmpty),
         body("dateOfBirth").notEmpty().withMessage(userMessages.dateOfBirth.notEmpty),
         body("gender").notEmpty().withMessage(userMessages.gender.notEmpty),
         body("describe").notEmpty().withMessage(userMessages.describe.notEmpty),
         body("city").notEmpty().withMessage(userMessages.city.notEmpty),
      ]);
   }

   if (method === "forgotPassword") {
      return (validateUser = [...fieldEmail, ...fieldPassword, body("otp").notEmpty().withMessage(userMessages.otp.notEntered)]);
   }

   return validateUser;
};

export default userValidation;

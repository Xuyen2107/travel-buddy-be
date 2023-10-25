class UserError extends Error {
   constructor(statusCode, message) {
      super(message);
      this.name = "UserError";
      this.statusCode = statusCode;
      this.message = message;
   }

   toJSON() {
      return {
         message: this.message,
      };
   }
}

export default UserError;

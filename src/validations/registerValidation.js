import * as Yup from "yup";

const registerSchema = Yup.object().shape({
   fullName: Yup.string().required("Không được để trống."),

   email: Yup.string().email().required("Không được để trông."),

   phoneNumber: Yup.string()
      .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ")
      .required("Không được để trống"),

   userName: Yup.string().required("Không được để trống"),

   password: Yup.string()
      .required("Không được để trống")
      .matches(
         /^[a-zA-Z0-9!@#$%^&*()_+=\\[\]{}|;:'",.<>/?`~]*$/,
         "Mật khẩu phải bao gồm chữ cái, số và ít nhất một ký tự đặc biệt"
      ),
});

export default registerSchema;

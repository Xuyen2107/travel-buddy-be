import * as Yup from "yup";

const registerSchema = Yup.object().shape({
   fullName: Yup.string().required("Vui lòng nhập tên của bạn."),

   email: Yup.string().email("Email không hợp lệ").required("Email không được để trông."),

   phoneNumber: Yup.string()
      .matches(/^0\d{9}$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại hông được để trống"),

   userName: Yup.string()
      .min(6, "Tối thiểu 6 kí tự")
      .max(20, "Tối đa 20 kí tự")
      .required("Username không được để trống"),

   password: Yup.string()
      .required("Vui lòng nhập mật khẩu của bạn")
      .min(6, "Mật khẩu tối thiểu 6 kí tự")
      .max(10, "Mật khẩu tối đa 10 kí tự")
      .matches(
         /^[a-zA-Z0-9!@#$%^&*()_+=\\[\]{}|;:'",.<>/?`~]*$/,
         "Mật khẩu gồm chữ in hoa, chữ thường, số và kí tự đặc biệt"
      ),
});

export default registerSchema;

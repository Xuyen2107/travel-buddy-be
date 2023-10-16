import * as Yup from "yup";

const loginSchema = Yup.object().shape({
   loginInfo: Yup.string().required("Thông tin đăng nhập không được để trống"),
   password: Yup.string().required("Mật khẩu không được để trống"),
});

export default loginSchema;

import * as Yup from "yup";

const loginSchema = Yup.object().shape({
   loginInfo: Yup.string().required("Không được để trống"),
   password: Yup.string().required("Không được để trống"),
});

export default loginSchema;

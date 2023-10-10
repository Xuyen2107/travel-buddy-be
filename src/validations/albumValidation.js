import * as Yup from "yup";

const albumSchema = Yup.object().shape({
   nameAlbum: Yup.string().required("Không được để trống"),
   vacationName: Yup.string().required("Không được để trống"),
   avatarAlbum: Yup.string(),
   fullName: Yup.string().required("Không được để trống"),
   status: Yup.string().required("Vui lòng chọn trạng thái"),
   albums: Yup.string().required("Vui lòng chọn ảnh"),
});
export default albumSchema;

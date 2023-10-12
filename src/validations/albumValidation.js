import * as Yup from "yup";

const albumSchema = Yup.object().shape({
   author: Yup.string().required("Tên tác giả không được để trống"),
   nameAlbum: Yup.string().required("Tên album hông được để trống"),
   avatarAlbum: Yup.string(),
   vacationName: Yup.string().required("Tên kì nghỉ Không được để trống"),
   isPublic: Yup.string().required("Vui lòng chọn trạng thái"),
   images: Yup.array().required("Vui lòng chọn ảnh của bạn"),
});

export default albumSchema;

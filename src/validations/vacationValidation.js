import * as Yup from "yup";

const vacationSchema = Yup.object().shape({
   author: Yup.string().required("Tên tác giả không được để trống"),
   title: Yup.string().required("Tên tiêu đề không được để trống"),
   avatarVacation: Yup.string().required("Ảnh đại diện kỳ nghỉ không được để trống"),
   description: Yup.string().required("Vui lòng nhập mô tả của bạn"),
   listUser: Yup.array(),
   isPublic: Yup.string().required("Vui lòng chọn trạng thái"),
   startDay: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
   endDay: Yup.string().required("Vui lòng chọn ngày kết thúc"),
   milestones: Yup.array().required("Vui lòng điền các cột mốc hành trình"),
});

export default vacationSchema;

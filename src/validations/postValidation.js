import * as Yup from "yup";

const postSchema = Yup.object().shape.apply({
   author: Yup.string().required("Vui lòng nhập tên tác giả"),
   vacation: Yup.string().required("Vui lòng nhập tên kỳ nghỉ"),
   content: Yup.string().required("Vui lòng nhập nội dung bài viết"),
   images: Yup.string().required("Vui lòng chọn ảnh của bạn"),
});

export default postSchema;

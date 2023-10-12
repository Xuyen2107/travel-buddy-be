import * as Yup from "yup";

const commentSchema = Yup.object().shape({
   author: Yup.string().required("Tên tác giả không được để trống"),
   idPost: Yup.string().required("Id post không được để trống"),
   text: Yup.string().required("Vui lòng nhập nội dung bình luận"),
});

export default commentSchema;

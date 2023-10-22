import * as Yup from "yup";

const vacationSchema = Yup.object().shape({
    // promoter: Yup.string().required("Không được để trống"),
    title: Yup.string().required("Không được để trống"),
    description: Yup.string().required("Không được để trống"),
    //  numberOfParticipants: Yup.array().required("Vui lòng điền người tham gia"),
    // status: Yup.string().required("Vui lòng chọn trạng thái"),
    // startDay: Yup.string().required("Vui lòng chọn ngày bắt đầu"),
    // endDay: Yup.string().required("Vui lòng chọn ngày kết thúc"),
    // milestones: Yup.array().required("Vui lòng điền các cột mốc hành trình"),
});

export default vacationSchema;

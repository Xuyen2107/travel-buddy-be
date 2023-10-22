import VacationModel from "../models/vacationModels.js";

class VacationController {
    async index(req, res) {
        try {
            // Lấy danh sách tất cả các kỳ nghỉ từ cơ sở dữ liệu
            const vacations = await VacationModel.find();

            // Trả về danh sách kỳ nghỉ dưới dạng JSON
            res.status(200).json(vacations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi trong quá trình lấy danh sách kỳ nghỉ" });
        }
    }

    async create(req, res) {
        const file = req.files;
        console.log("🚀 ~ file: vacation.controller.js:19 ~ VacationController ~ create ~ file:", file);
        const { promoter, title, images, description, numberUser, listUser, isPublic, startDay, endDay, milestones } =
            req.body;

        try {
            const newVacation = new VacationModel({
                promoter,
                title,
                images,
                description,
                numberUser,
                listUser,
                isPublic,
                startDay,
                endDay,
                milestones,
            });

            await newVacation.save();

            res.status(201).json(newVacation);
        } catch (err) {
            console.error(error);
            res.status(500).json({ error: "Lỗi trong quá trình tạo kỳ nghỉ" });
        }
    }

    async update(req, res) {
        const vacationId = req.params.id;
        const { promoter, title, images, description, numberUser, listUser, isPublic, startDay, endDay, milestones } =
            req.body;

        try {
            // Cập nhật thông tin kỳ nghỉ trong cơ sở dữ liệu
            const updatedVacation = await VacationModel.findByIdAndUpdate(
                vacationId,
                {
                    promoter,
                    title,
                    images,
                    description,
                    numberUser,
                    listUser,
                    isPublic,
                    startDay,
                    endDay,
                    milestones,
                },
                { new: true } // Trả về bản ghi sau khi đã cập nhật
            );

            res.status(200).json(updatedVacation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi trong quá trình cập nhật kỳ nghỉ" });
        }
    }

    async remove(req, res) {
        const vacationId = req.params.id;

        try {
            // Xóa kỳ nghỉ từ cơ sở dữ liệu
            await VacationModel.findByIdAndDelete(vacationId);

            res.status(200).json({ message: "Kỳ nghỉ đã được xóa" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi trong quá trình xóa kỳ nghỉ" });
        }
    }

    async removeAll(req, res) {
        try {
            // Thực hiện xóa tất cả các bản ghi trong cơ sở dữ liệu
            await VacationModel.deleteMany({}); // YourModel thay thế bằng tên model thích hợp

            return res.status(200).json({ message: "Tất cả bản ghi đã bị xóa." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Lỗi trong quá trình xóa bản ghi." });
        }
    }
}

const vactionController = new VacationController();

export default vactionController;

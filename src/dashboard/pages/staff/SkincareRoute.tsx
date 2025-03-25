import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Chip,
    Button,
    Autocomplete,
} from "@mui/material";
import axios from "axios";
import { portserver } from "../../../utils/portserver";
import { jwtDecode } from "jwt-decode";

// Danh sách loại da
const skinTypes = ["Da dầu", "Da thường", "Da khô", "Da hỗn hợp"];

const SkincareRoute: React.FC = () => {
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;


    const [formData, setFormData] = useState({
        userId: 2,
        skinType: "",
        concerns: "",
        morningRoutine: [] as string[],
        eveningRoutine: [] as string[],
        recommendedProducts: [] as string[],
    });
    const [products, setProducts] = useState<string[]>([]);

    // Lấy danh sách sản phẩm từ API
    useEffect(() => {
        getAllProducts();
    }, []);

    const getAllProducts = async () => {
        try {
            const res = await axios.get(`${portserver}/skincare-product`);
            const productNames = res.data.map((product: { productName: string }) => product.productName);
            setProducts(productNames)
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    // Cập nhật giá trị input
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    // Xử lý thêm bước vào Morning/Evening Routine
    const handleRoutineChange = (event: React.KeyboardEvent<HTMLInputElement>, routineType: "morningRoutine" | "eveningRoutine") => {
        if (event.key === "Enter") {
            event.preventDefault();
            const value = (event.target as HTMLInputElement).value.trim();
            if (value) {
                setFormData(prev => ({
                    ...prev,
                    [routineType]: [...prev[routineType], value],
                }));
                (event.target as HTMLInputElement).value = "";
            }
        }
    };

    const handleRemoveStep = (routineType, index) => {
        setFormData((prevData) => ({
            ...prevData,
            [routineType]: prevData[routineType].filter((_, i) => i !== index) // Xóa phần tử tại vị trí index
        }));
    };


    // Xử lý gửi dữ liệu lên backend
    const handleSubmit = async () => {
        if (!formData.skinType || !formData.concerns) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            const response = await axios.post(`${portserver}/skincare-route`, formData);
            console.log("Response:", response.data);
            alert("Routine added successfully!");
        } catch (error) {
            console.error("Error submitting routine:", error);
            alert("Error submitting routine");
        }
    };

    return (
        <Box sx={{ maxWidth: 500, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Add Skincare Routine
            </Typography>

            <TextField
                label="UserId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {/* Chọn loại da */}
            <TextField
                select
                label="Skin Type"
                name="skinType"
                value={formData.skinType}
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                {skinTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>

            {/* Nhập vấn đề da gặp phải */}
            <TextField
                label="Concerns"
                name="concerns"
                value={formData.concerns}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />

            {/* Thêm bước vào Morning Routine */}
            <TextField
                label="Morning Routine (Press Enter to Add)"
                fullWidth
                margin="normal"
                onKeyDown={(event) => handleRoutineChange(event, "morningRoutine")}
            />
            {formData.morningRoutine.map((step, index) => (
                <Chip
                    key={index}
                    label={step}
                    sx={{ m: 0.5 }}
                    onDelete={() => handleRemoveStep("morningRoutine", index)} // Nút xóa
                />
            ))}

            <TextField
                label="Evening Routine (Press Enter to Add)"
                fullWidth
                margin="normal"
                onKeyDown={(event) => handleRoutineChange(event, "eveningRoutine")}
            />
            {formData.eveningRoutine.map((step, index) => (
                <Chip
                    key={index}
                    label={step}
                    sx={{ m: 0.5 }}
                    onDelete={() => handleRemoveStep("eveningRoutine", index)} // Nút xóa
                />
            ))}


            {/* Chọn sản phẩm gợi ý */}
            <Autocomplete
                multiple
                options={products}
                getOptionLabel={(option) => option}
                value={formData.recommendedProducts}
                onChange={(event, newValue) => setFormData({ ...formData, recommendedProducts: newValue })}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            key={index}
                            label={option}
                            {...getTagProps({ index })}
                            sx={{ maxWidth: "100%" }} // Đảm bảo chip không bị cắt
                        />
                    ))
                }
                renderInput={(params) => <TextField {...params} label="Recommended Products" margin="normal" />}
                sx={{
                    maxHeight: "150px", // Giới hạn chiều cao
                    overflowY: "auto", // Thêm thanh cuộn khi danh sách quá dài
                }}
            />



            {/* Nút gửi form */}
            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    );
};

export default SkincareRoute;

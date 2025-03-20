import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { portserver } from "../../../utils/portserver";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface Brand {
  brandId: number;
  brandName: string;
}

interface Category {
  categoryId: number;
  name: string;
  isActive: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}


export default function AddProductDialog({
  open,
  onClose,
  onProductAdded,
}: AddProductDialogProps) {
  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    price: "",
    categoryId: 1,
    brandId: 1,
    urlImage: "",
    quantity: "",
    productionDate: null as Date | null,
    expirationDate: null as Date | null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([
    { brandId: 1, brandName: "Default Brand" },
  ]);
  const [categories, setCategories] = useState<Category[]>([
    { categoryId: 1, name: "Default Category", isActive: true },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (open) {
      fetchBrands();
      fetchCategories();
    }
  }, [open]);

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${portserver}/brand`);
      setBrands(response.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setBrands([{ brandId: 1, brandName: "Default Brand" }]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${portserver}/category`);
      console.log("Categories fetched:", response.data);
      setCategories(response.data); // Set categories đúng đắn
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([
        { categoryId: 1, name: "Default Category", isActive: true },
      ]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return "";

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      //************image upload API endpoint*********

      return URL.createObjectURL(selectedFile);
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handleSubmit = async () => {
    if (!productData.productName.trim()) {
      setError("Product name is required");
      return;
    }

    if (
      !productData.price ||
      isNaN(Number(productData.price)) ||
      Number(productData.price) <= 0
    ) {
      setError("Valid price is required");
      return;
    }

    if (
      !productData.quantity ||
      isNaN(Number(productData.quantity)) ||
      Number(productData.quantity) < 0
    ) {
      setError("Valid quantity is required");
      return;
    }

    if (!productData.productionDate) {
      setError("Production date is required");
      return;
    }

    if (!productData.expirationDate) {
      setError("Expiration date is required");
      return;
    }

    if (productData.productionDate >= productData.expirationDate) {
      setError("Production date must be before expiration date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let urlImage = "";
      if (selectedFile) {
        urlImage = await uploadImage();
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const payload = {
        productName: productData.productName,
        categoryId: productData.categoryId,
        brandId: productData.brandId,
        description: productData.description || "",
        price: parseFloat(productData.price), 
        urlImage: urlImage || "",
        productionDate: productData.productionDate?.toISOString().split("T")[0],
        expirationDate: productData.expirationDate?.toISOString().split("T")[0], 
        quantity: parseInt(productData.quantity), 
      };

      console.log("Sending payload to API:", payload);

      await axios.post(`${portserver}/skincare-product/add-product`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess("Product added successfully!");
      setLoading(false);

      setTimeout(() => {
        onProductAdded();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProductData({
      productName: "",
      description: "",
      price: "",
      categoryId: 1,
      brandId: 1,
      urlImage: "",
      quantity: "",
      productionDate: null,
      expirationDate: null,
    });
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setTabValue(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "600px",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Add New Product
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Basic Info" />
            <Tab label="Image" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2}>
              <TextField
                name="productName"
                label="Product Name"
                fullWidth
                required
                value={productData.productName}
                onChange={handleChange}
              />

              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={productData.description}
                onChange={handleChange}
              />

              <TextField
                name="brandId"
                select
                fullWidth
                required
                label="Brand"
                value={productData.brandId}
                onChange={handleChange}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="categoryId"
                select
                fullWidth
                required
                label="Category"
                value={productData.categoryId}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryId}
                    disabled={!category.isActive}
                  >
                    {category.name}
                    {!category.isActive && " (Inactive)"}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                required
                value={productData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">VND</InputAdornment>
                  ),
                }}
              />

              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                required
                value={productData.quantity}
                onChange={handleChange}
              />

              <DatePicker
                label="Production Date *"
                value={productData.productionDate}
                onChange={(newValue) => {
                  setProductData({
                    ...productData,
                    productionDate: newValue,
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />

              <DatePicker
                label="Expiration Date *"
                value={productData.expirationDate}
                onChange={(newValue) => {
                  setProductData({
                    ...productData,
                    expirationDate: newValue,
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Stack>
          </LocalizationProvider>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            {imagePreview ? (
              <Box sx={{ mb: 2 }}>
                <img
                  src={imagePreview}
                  alt="Product preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 250,
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ mb: 2, textAlign: "center", py: 3 }}>
                <Typography color="text.secondary">
                  No image selected
                </Typography>
              </Box>
            )}

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              {imagePreview ? "Change Image" : "Upload Image"}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imagePreview && (
              <Button
                variant="text"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => {
                  setSelectedFile(null);
                  setImagePreview(null);
                }}
              >
                Remove Image
              </Button>
            )}
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

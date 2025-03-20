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
//import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

interface Category {
  categoryId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface Brand {
  brandId: number;
  brandName: string;
  country: string;
  logo: string;
  createdAt: string;
  isActive: boolean;
}

interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  stock: number;
  urlImage: string;
  category: Category;
  brand: Brand;
  brandName: string;
  categoryName: string;
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

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  productId: number | null;
}

export default function EditProductDialog({
  open,
  onClose,
  onProductUpdated,
  productId,
}: EditProductDialogProps) {
  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    price: "",
    categoryId: "",
    brandId: "",
    urlImage: "",
    quantity: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (open && productId) {
      fetchProductDetails(productId);
      fetchBrands();
      fetchCategories();
    }
  }, [open, productId]);

  const fetchProductDetails = async (id: number) => {
    try {
      setLoadingProduct(true);
      setError(null);

      const response = await axios.get(`${portserver}/skincare-product/${id}`);
      const productData = response.data;

      console.log("Fetched product for edit:", productData);
      setProduct(productData);

      setProductData({
        productName: productData.productName || "",
        description: productData.description || "",
        price: productData.price?.toString() || "",
        categoryId: productData.category?.categoryId?.toString() || "",
        brandId: productData.brand?.brandId?.toString() || "",
        urlImage: productData.urlImage || "",
        quantity: productData.stock?.toString() || "0",
      });

      if (productData.urlImage) {
        setImagePreview(productData.urlImage);
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError("Failed to load product details. Please try again.");
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${portserver}/brand`);
      setBrands(response.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load brands data.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${portserver}/category`);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories data.");
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
    if (!selectedFile) return productData.urlImage;

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      // image API
      return productData.urlImage || URL.createObjectURL(selectedFile);
    } catch (error) {
      console.error("Error uploading image:", error);
      return productData.urlImage;
    }
  };

  const handleSubmit = async () => {
    if (!product || !productId) return;

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

    if (!productData.categoryId) {
      setError("Category is required");
      return;
    }

    if (!productData.brandId) {
      setError("Brand is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let urlImage = productData.urlImage;
      if (selectedFile) {
        urlImage = await uploadImage();
      }

      const payload = {
        productName: productData.productName,
        categoryId: parseInt(productData.categoryId),
        brandId: parseInt(productData.brandId),
        description: productData.description || "",
        price: parseFloat(productData.price),
        urlImage: urlImage || "",
        isActive: product.isActive, 
        quantity: parseInt(productData.quantity)||"",
      };

      console.log("Updating product with payload:", payload);

      await axios.put(`${portserver}/skincare-product/update/${productId}`, payload);

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        onProductUpdated();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProductData({
      productName: "",
      description: "",
      price: "",
      categoryId: "",
      brandId: "",
      urlImage: "",
      quantity: "",
    });
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setTabValue(0);
    setProduct(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={loading || loadingProduct ? undefined : handleClose}
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
          Edit Product
        </Typography>
        {product && (
          <Typography variant="subtitle2" color="text.secondary">
            ID: {product.productId}
          </Typography>
        )}
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

        {loadingProduct ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                    disabled={loading}
                  />

                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    value={productData.description}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <TextField
                    name="brandId"
                    select
                    fullWidth
                    required
                    label="Brand"
                    value={productData.brandId}
                    onChange={handleChange}
                    disabled={loading || brands.length === 0}
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
                    disabled={loading || categories.length === 0}
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
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">VND</InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    name="quantity"
                    label="Current Stock"
                    value={productData.quantity}
                    fullWidth
                    required
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Units</InputAdornment>
                      ),
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
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 250,
                        objectFit: "contain",
                      }}
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Error+Loading+Image";
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
                  disabled={loading}
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
                    disabled={loading}
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                      setProductData({
                        ...productData,
                        urlImage: "",
                      });
                    }}
                  >
                    Remove Image
                  </Button>
                )}
              </Box>
            </TabPanel>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading || loadingProduct}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || loadingProduct}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

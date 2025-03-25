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
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { format } from "date-fns";
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

interface ProductDetail {
  id: number;
  productionDate: string;
  expirationDate: string;
  quantity: number;
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
  productDetails?: ProductDetail[];
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

  const [stockFormData, setStockFormData] = useState({
    quantity: "",
    productionDate: null as Date | null,
    expirationDate: null as Date | null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [addingStock, setAddingStock] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stockSuccess, setStockSuccess] = useState<string | null>(null);
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

  const handleStockChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setStockFormData({
        ...stockFormData,
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

  const handleAddStock = async () => {
    if (!product || !productId) return;

    if (
      !stockFormData.quantity ||
      isNaN(Number(stockFormData.quantity)) ||
      Number(stockFormData.quantity) <= 0
    ) {
      setStockError("Valid quantity is required");
      return;
    }

    if (!stockFormData.productionDate) {
      setStockError("Production date is required");
      return;
    }

    if (!stockFormData.expirationDate) {
      setStockError("Expiration date is required");
      return;
    }

    if (stockFormData.productionDate >= stockFormData.expirationDate) {
      setStockError("Production date must be before expiration date");
      return;
    }

    setAddingStock(true);
    setStockError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setStockError("Authentication token not found. Please login again.");
        setAddingStock(false);
        return;
      }

      const payload = {
        productName: productData.productName,
        categoryId: parseInt(productData.categoryId),
        brandId: parseInt(productData.brandId),
        price: parseFloat(productData.price),
        productionDate: stockFormData.productionDate
          ?.toISOString()
          .split("T")[0],
        expirationDate: stockFormData.expirationDate
          ?.toISOString()
          .split("T")[0],
        quantity: parseInt(stockFormData.quantity),
      };

      console.log("Adding new stock with payload:", payload);

      await axios.post(`${portserver}/skincare-product/add-product`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setStockSuccess("Stock added successfully!");

      // Reset form
      setStockFormData({
        quantity: "",
        productionDate: null,
        expirationDate: null,
      });

      // Refresh product details to show updated stock
      fetchProductDetails(productId);
    } catch (err) {
      console.error("Error adding stock:", err);
      setStockError("Failed to add stock. Please try again.");
    } finally {
      setAddingStock(false);
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
      };

      console.log("Updating product with payload:", payload);

      await axios.put(
        `${portserver}/skincare-product/update/${productId}`,
        payload
      );

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
    setStockFormData({
      quantity: "",
      productionDate: null,
      expirationDate: null,
    });
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setStockError(null);
    setStockSuccess(null);
    setTabValue(0);
    setProduct(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy");
    } catch {
      return "N/A";
    }
  };

  const calculateTotalQuantity = (details?: ProductDetail[]) => {
    if (!details || details.length === 0) return 0;
    return details.reduce((sum, detail) => sum + detail.quantity, 0);
  };

  return (
    <Dialog
      open={open}
      onClose={
        loading || loadingProduct || addingStock ? undefined : handleClose
      }
      maxWidth="md"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "650px",
          maxHeight: "90vh",
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
                <Tab label="Stocking" />
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
                    InputProps={{
                      readOnly: true,
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

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="medium"
                >
                  Add New Stock
                </Typography>

                {stockError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {stockError}
                  </Alert>
                )}

                {stockSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {stockSuccess}
                  </Alert>
                )}

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={2} sx={{ mb: 2 }}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      fullWidth
                      required
                      value={stockFormData.quantity}
                      onChange={handleStockChange}
                      disabled={addingStock}
                      inputProps={{ min: 1 }}
                    />

                    <DatePicker
                      label="Production Date *"
                      value={stockFormData.productionDate}
                      onChange={(newValue) => {
                        setStockFormData({
                          ...stockFormData,
                          productionDate: newValue,
                        });
                      }}
                      disabled={addingStock}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />

                    <DatePicker
                      label="Expiration Date *"
                      value={stockFormData.expirationDate}
                      onChange={(newValue) => {
                        setStockFormData({
                          ...stockFormData,
                          expirationDate: newValue,
                        });
                      }}
                      disabled={addingStock}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                        },
                      }}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        addingStock ? (
                          <CircularProgress size={20} />
                        ) : (
                          <AddIcon />
                        )
                      }
                      onClick={handleAddStock}
                      disabled={addingStock}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      {addingStock ? "Adding..." : "Add Stock"}
                    </Button>
                  </Stack>
                </LocalizationProvider>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  fontWeight="medium"
                >
                  Current Inventory
                </Typography>

                {product?.productDetails &&
                product.productDetails.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "action.hover" }}>
                          <TableCell>ID</TableCell>
                          <TableCell>Production Date</TableCell>
                          <TableCell>Expiration Date</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.productDetails.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell>{detail.id}</TableCell>
                            <TableCell>
                              {formatDate(detail.productionDate)}
                            </TableCell>
                            <TableCell>
                              {formatDate(detail.expirationDate)}
                            </TableCell>
                            <TableCell align="right">
                              {detail.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <strong>Total:</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              {calculateTotalQuantity(product.productDetails)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No inventory details available
                  </Typography>
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
          disabled={loading || loadingProduct || addingStock}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || loadingProduct || addingStock || tabValue === 2}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

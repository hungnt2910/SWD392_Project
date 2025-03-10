import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from "@mui/material/Chip";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import axios from "axios";
import { portserver } from "../../../utils/portserver";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface Brand {
  id: number;
  brandId: number;
  brandName: string;
  country: string;
  logo?: string;
  isActive: boolean;
}

interface Category {
  id: number;
  categoryId: number;
  categoryName: string;
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
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
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
    stock: "",
    brandId: "",
    categoryIds: [] as string[],
    isActive: true,
    imageUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Fetch brands and categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchBrands();
      fetchCategories();
    }
  }, [open]);
  
  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${portserver}/brand`);
      // Add id property for DataGrid
      const brandsWithId = response.data.map((brand: any, index: number) => ({
        ...brand,
        id: brand.brandId || index,
      }));
      setBrands(brandsWithId);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setBrands([]);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${portserver}/category`);
      const categoriesWithId = response.data.map((category: any, index: number) => ({
        ...category,
        id: category.categoryId || index,
      }));
      setCategories(categoriesWithId);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setProductData({
        ...productData,
        [name]: value,
      });
    }
  };
  
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData({
      ...productData,
      isActive: e.target.checked,
    });
  };
  
  const handleBrandSelection = (brandId: number) => {
    setProductData({
      ...productData,
      brandId: String(brandId),
    });
  };
  
  const handleCategorySelection = (categoryId: number) => {
    const currentCategoryIds = [...productData.categoryIds];
    const categoryIdString = String(categoryId);
    
    // Toggle selection
    if (currentCategoryIds.includes(categoryIdString)) {
      setProductData({
        ...productData,
        categoryIds: currentCategoryIds.filter(id => id !== categoryIdString),
      });
    } else {
      setProductData({
        ...productData,
        categoryIds: [...currentCategoryIds, categoryIdString],
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
      formData.append('image', selectedFile);
      
      // image handle
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
    
    if (!productData.brandId) {
      setError("Brand is required");
      return;
    }
    
    if (productData.categoryIds.length === 0) {
      setError("At least one category is required");
      return;
    }
    
    if (!productData.price || isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      setError("Valid price is required");
      return;
    }
    
    if (!productData.stock || isNaN(Number(productData.stock)) || Number(productData.stock) < 0) {
      setError("Valid stock quantity is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let imageUrl = "";
      if (selectedFile) {
        imageUrl = await uploadImage();
      }
      
      const payload = {
        productName: productData.productName,
        description: productData.description,
        price: Number(productData.price),
        stock: Number(productData.stock),
        brandId: Number(productData.brandId),
        categoryIds: productData.categoryIds.map(id => Number(id)),
        isActive: productData.isActive,
        imageUrl: imageUrl || undefined
      };
      
      await axios.post(`${portserver}/skincare-product`, payload);
      
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
      stock: "",
      brandId: "",
      categoryIds: [],
      isActive: true,
      imageUrl: "",
    });
    setSelectedFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setTabValue(0);
    onClose();
  };
  
  const brandColumns: GridColDef[] = [
    {
      field: 'brandName',
      headerName: 'Brand Name',
      flex: 2,
    },
    {
      field: 'country',
      headerName: 'Country',
      flex: 1,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, boolean>) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
  ];
  
  const categoryColumns: GridColDef[] = [
    {
      field: 'categoryName',
      headerName: 'Category Name',
      flex: 3,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, boolean>) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
  ];
  
  // Determine selected rows for brand
  const selectedBrandId = productData.brandId ? Number(productData.brandId) : null;
  
  // Determine selected rows for categories
  const selectedCategoryIds = productData.categoryIds.map(id => Number(id));
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
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
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="product tabs">
            <Tab label="Basic Info" />
            <Tab label="Brand & Categories" />
            <Tab label="Image" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={2}>
            <TextField
              name="productName"
              label="Product Name"
              fullWidth
              required
              value={productData.productName}
              onChange={handleChange}
              variant="outlined"
            />
            
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={productData.description}
              onChange={handleChange}
              variant="outlined"
            />
            
            <Stack direction="row" spacing={2}>
              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                required
                value={productData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                variant="outlined"
              />
              
              <TextField
                name="stock"
                label="Stock Quantity"
                type="number"
                fullWidth
                required
                value={productData.stock}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            
            <Box sx={{ mt: 1 }}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={productData.isActive}
                    onChange={handleSwitchChange}
                    color="success"
                  />
                } 
                label="Product is active" 
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Active products are visible to customers and can be purchased.
              </Typography>
            </Box>
          </Stack>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Select Brand
              </Typography>
              <Typography variant="caption" color="text.secondary" paragraph>
                Click on a row to select a brand.
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <DataGrid
                  rows={brands}
                  columns={brandColumns}
                  hideFooterPagination={brands.length <= 10}
                  disableRowSelectionOnClick={false}
                  onRowClick={(params) => handleBrandSelection(params.row.brandId)}
                  getRowClassName={(params) => 
                    selectedBrandId === params.row.brandId ? 'Mui-selected' : ''
                  }
                  sx={{
                    '& .Mui-selected': {
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Select Categories
              </Typography>
              <Typography variant="caption" color="text.secondary" paragraph>
                Click on rows to select multiple categories.
              </Typography>
              <Box sx={{ height: 300, width: '100%' }}>
                <DataGrid
                  rows={categories}
                  columns={categoryColumns}
                  hideFooterPagination={categories.length <= 10}
                  disableRowSelectionOnClick={false}
                  onRowClick={(params) => handleCategorySelection(params.row.categoryId)}
                  getRowClassName={(params) => 
                    selectedCategoryIds.includes(params.row.categoryId) ? 'Mui-selected' : ''
                  }
                  sx={{
                    '& .Mui-selected': {
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Categories:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedCategoryIds.length > 0 ? (
                    selectedCategoryIds.map(id => {
                      const category = categories.find(cat => cat.categoryId === id);
                      return category ? (
                        <Chip 
                          key={id} 
                          label={category.categoryName} 
                          color="primary" 
                          variant="outlined" 
                          size="small"
                          onDelete={() => handleCategorySelection(id)}
                        />
                      ) : null;
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary">No categories selected</Typography>
                  )}
                </Stack>
              </Box>
            </Box>
          </Stack>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              p: 3,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            {imagePreview ? (
              <Box sx={{ mb: 2 }}>
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                />
              </Box>
            ) : (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
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
              {imagePreview ? 'Change Image' : 'Upload Image'}
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
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
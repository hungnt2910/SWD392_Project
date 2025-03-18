import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { portserver } from "../../../utils/portserver";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import IconButtonBase from "@mui/material/IconButton";
import ProductDetailDialog from "./ProductDetailDialog";
import AddProductDialog from "./AddProductDialog";
import EditProductDialog from "./EditProductDialog"; 

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

interface Brand {
  brandId: number;
  brandName: string;
  country: string;
  logo: string;
  createdAt: string;
  isActive: boolean;
}
interface Category {
  categoryId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}
export default function ManageGoods() {
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false); 
  const [editProductId, setEditProductId] = useState<number | null>(null); 
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);

  const handleBrandChange = (event: SelectChangeEvent) => {
    setSelectedBrand(event.target.value);
  };
  const handleAddProduct = () => {
    setAddDialogOpen(true);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleViewProduct = async (id: number) => {
    console.log("View product clicked:", id);
    const response = await axios.get(`${portserver}/skincare-product/${id}`);
    const product = response.data;
    console.log("Found product:", product);
    setSelectedProduct(product || null);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      fetchProducts();
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const response = await axios.get(`${portserver}/brand`);
        setBrands(response.data);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${portserver}/skincare-product`;

      if (selectedBrand) {
        url = `${portserver}/skincare-product/brand/${selectedBrand}`;
      } else if (searchTerm) {
        url = `${portserver}/skincare-product/search/byname?productname=${encodeURIComponent(
          searchTerm
        )}`;
      }

      const response = await axios.get(url);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand]); 

  const toggleProductStatus = async (id: number) => {
    try {
      const product = products.find((product) => product.productId === id);
      if (!product) return;

      const newStatus = !product.isActive;

      await axios.put(`${portserver}/skincare-product/${id}`, {
        isActive: newStatus,
      });

      setProducts(
        products.map((product) => {
          if (product.productId === id) {
            return {
              ...product,
              isActive: newStatus,
            };
          }
          return product;
        })
      );
    } catch (err) {
      console.error("Error updating product status:", err);
      setError("Failed to update product status. Please try again.");
    }
  };

  const handleEditProduct = (id: number) => {
    setEditProductId(id);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditProductId(null);
  };

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return "0 ₫";

    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return "0 ₫";
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const columns: GridColDef[] = [
    {
      field: "productId",
      headerName: "ID",
      flex: 0.5,
      minWidth: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "productName",
      headerName: "Product Name",
      flex: 2,
      minWidth: 220,
      editable: false,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.8,
      minWidth: 100,
      editable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => formatPrice(params.value),
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 0.5,
      minWidth: 80,
      editable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color:
                params.value <= 10
                  ? "error.main"
                  : params.value <= 30
                  ? "warning.main"
                  : "success.main",
              fontWeight: "bold",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 120,
      editable: false,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      editable: false,
      headerAlign: "center",
      align: "center",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderCell: (params: GridRenderCellParams<any, boolean>) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Tooltip title="View Details">
              <IconButton
                color="info"
                onClick={() => handleViewProduct(params.row.productId)}
                size="small"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Product">
              <IconButton
                color="primary"
                onClick={() => handleEditProduct(params.row.productId)}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {params.row.isActive ? (
              <Tooltip title="Deactivate Product">
                <IconButton
                  color="error"
                  onClick={() => toggleProductStatus(params.row.productId)}
                  size="small"
                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Activate Product">
                <IconButton
                  color="success"
                  onClick={() => toggleProductStatus(params.row.productId)}
                  size="small"
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      ),
    },
  ];

  if (loading && products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Product Management
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", flexGrow: 1, minWidth: 250 }}>
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButtonBase size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButtonBase>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
            Search
          </Button>
        </Box>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="brand-select-label">Filter by Brand</InputLabel>
          <Select
            labelId="brand-select-label"
            id="brand-select"
            value={selectedBrand}
            label="Filter by Brand"
            onChange={handleBrandChange}
            disabled={loadingBrands}
          >
            <MenuItem value="">
              <em>All Brands</em>
            </MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand.brandId} value={brand.brandName}>
                {brand.brandName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {products.length} products found
          {selectedBrand && ` in "${selectedBrand}"`}
          {searchTerm && ` matching "${searchTerm}"`}
        </Typography>
      </Box>

      {loading && products.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: "productId", sort: "asc" }],
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          boxShadow: 1,
          borderRadius: 1,
          overflow: "hidden",
        }}
      />

      <ProductDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        product={selectedProduct}
      />
      <AddProductDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onProductAdded={fetchProducts}
      />

      {/* Add EditProductDialog */}
      <EditProductDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        onProductUpdated={fetchProducts}
        productId={editProductId}
      />
    </Box>
  );
}

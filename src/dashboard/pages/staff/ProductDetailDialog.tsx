import * as React from "react";
import { forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Grid, Typography, Chip, Divider } from "@mui/material";

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

const Transition = forwardRef<unknown, TransitionProps>(function Transition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onClose,
  product,
}) => {
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dialogContent = React.useMemo(
    () => (
      <>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="div" fontWeight="bold">
              Product Details
            </Typography>
            <Chip
              label={product.isActive ? "Active" : "Inactive"}
              color={product.isActive ? "success" : "error"}
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    maxWidth: "100%",
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                  alt={product.productName}
                  src={
                    product.urlImage ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdxxr8aAPzWgBNpoZgXmQTY6VTGG1jXcPAIA&s"
                  }
                  onError={(
                    e: React.SyntheticEvent<HTMLImageElement, Event>
                  ) => {
                    e.currentTarget.src =
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdxxr8aAPzWgBNpoZgXmQTY6VTGG1jXcPAIA&s";
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Name
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {product.productName}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Brand
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {product.brandName ||
                      (product.brand ? product.brand.brandName : "N/A")}
                  </Typography>

                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {product.categoryName ||
                      (product.category ? product.category.name : "N/A")}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product ID
                </Typography>
                <Typography variant="body1">{product.productId}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stock
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color:
                      product.stock <= 10
                        ? "error.main"
                        : product.stock <= 30
                        ? "warning.main"
                        : "success.main",
                    fontWeight: "bold",
                  }}
                >
                  {product.stock} units
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Price
                </Typography>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {formatPrice(product.price)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(product.createdAt)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                >
                  {product.description || "No description available"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="inherit" variant="outlined">
            Close
          </Button>
          <Button variant="contained" color="primary" onClick={onClose}>
            Edit Product
          </Button>
        </DialogActions>
      </>
    ),
    [product, onClose]
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted={false}
      onClose={onClose}
      aria-describedby="product-detail-dialog"
      maxWidth="md"
      fullWidth
      transitionDuration={{
        enter: 500,
        exit: 300,
      }}
    >
      {dialogContent}
    </Dialog>
  );
};

export default ProductDetailDialog;

// Sửa đổi phần đầu file để đảm bảo import đúng
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

// Define the Product interface (same as in ManageGoods)
interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  stock: number;
}

// Viết lại Transition - đảm bảo sử dụng forwardRef đúng cách
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

  // Format price to display as currency
  const formatPrice = (price: number) => {
    if (!price && price !== 0) return "$0.00";

    try {
      return "$" + Number(price).toFixed(2);
    } catch {
      return "$0.00";
    }
  };

  // Format date - using native JavaScript Date formatting
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  // Sử dụng React.useMemo để đảm bảo Dialog không bị re-render không cần thiết
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
              {/* Product ID */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product ID
                </Typography>
                <Typography variant="body1">{product.productId}</Typography>
              </Grid>

              {/* Stock */}
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

              {/* Product Name */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Name
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  {product.productName}
                </Typography>
              </Grid>

              {/* Price */}
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

              {/* Created Date */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(product.createdAt)}
                </Typography>
              </Grid>

              {/* Description */}
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
                  {product.description}
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
      keepMounted={false} // Thay đổi này quan trọng
      onClose={onClose}
      aria-describedby="product-detail-dialog"
      maxWidth="md"
      fullWidth
      transitionDuration={{
        enter: 500, // Tăng thời gian để hiệu ứng rõ ràng hơn
        exit: 300,
      }}
    >
      {dialogContent}
    </Dialog>
  );
};

export default ProductDetailDialog;
    
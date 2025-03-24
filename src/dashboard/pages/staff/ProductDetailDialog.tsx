import * as React from "react";
import { forwardRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TransitionProps } from "@mui/material/transitions";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { portserver } from "../../../utils/portserver";

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

interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  reviewDate: string;
  userId: string;
  username: string;
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
  const [tabValue, setTabValue] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (open && product && tabValue === 1) {
      fetchReviews();
    }
  }, [open, product, tabValue]);

  const fetchReviews = async () => {
    if (!product) return;

    setLoadingReviews(true);
    setReviewError(null);

    try {
      const response = await axios.get(
        `${portserver}/reviews/getReviewsByProductId/${product.productId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewError("Failed to load reviews. Please try again.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const calculateTotalQuantity = (details?: ProductDetail[]) => {
    if (!details || details.length === 0) return 0;
    return details.reduce((sum, detail) => sum + detail.quantity, 0);
  };

  // Tính điểm đánh giá trung bình
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const avgRating = calculateAverageRating();

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

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Details" />
          <Tab label="Reviews" />
        </Tabs>
      </Box>

      <DialogContent>
        <TabPanel value={tabValue} index={0}>
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
                      (product.productDetails
                        ? calculateTotalQuantity(product.productDetails)
                        : product.stock) <= 10
                        ? "error.main"
                        : (product.productDetails
                            ? calculateTotalQuantity(product.productDetails)
                            : product.stock) <= 30
                        ? "warning.main"
                        : "success.main",
                    fontWeight: "bold",
                  }}
                >
                  {product.productDetails
                    ? calculateTotalQuantity(product.productDetails)
                    : product.stock}{" "}
                  units
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

              {product.productDetails && product.productDetails.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 1 }}
                  >
                    Inventory Details
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
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
                </Grid>
              )}
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loadingReviews ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : reviewError ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {reviewError}
            </Alert>
          ) : (
            <Box sx={{ p: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <Box sx={{ mr: 3 }}>
                  <Typography variant="h3" color="primary" align="center">
                    {avgRating.toFixed(1)}
                  </Typography>
                  <Rating
                    value={avgRating}
                    precision={0.1}
                    readOnly
                    size="large"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {reviews.length} Review{reviews.length !== 1 ? "s" : ""}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {reviews.length > 0
                      ? `Latest review: ${formatDate(reviews[0].reviewDate)}`
                      : "No reviews yet"}
                  </Typography>
                </Box>
              </Box>

              {reviews.length > 0 ? (
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {reviews.map((review) => (
                    <React.Fragment key={review.reviewId}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          py: 2,
                          px: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                component="span"
                                fontWeight="medium"
                              >
                                {review.username || "Anonymous"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(review.reviewDate)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                              <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                              >
                                {review.comment || "No comment provided."}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    No reviews available for this product
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog;

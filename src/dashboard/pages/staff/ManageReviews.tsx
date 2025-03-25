import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Chip,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import WarningIcon from "@mui/icons-material/Warning";
import axios from "axios";
import { format } from "date-fns";
import { portserver } from "../../../utils/portserver";

interface Review {
  reviewId: number;
  productId: number;
  productName: string;
  userId: string;
  username: string;
  orderId: number;
  rating: number;
  comment: string;
  reviewDate: string;
}

interface GroupedReviews {
  [productId: string]: {
    productName: string;
    reviews: Review[];
    averageRating: number;
  };
}

const ManageReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [groupedReviews, setGroupedReviews] = useState<GroupedReviews>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${portserver}/reviews/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(response.data);
      groupReviewsByProduct(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const groupReviewsByProduct = (reviews: Review[]) => {
    const grouped: GroupedReviews = {};

    reviews.forEach((review) => {
      const productId = review.productId.toString();

      if (!grouped[productId]) {
        grouped[productId] = {
          productName: review.productName,
          reviews: [],
          averageRating: 0,
        };
      }

      grouped[productId].reviews.push(review);
    });

    Object.keys(grouped).forEach((productId) => {
      const { reviews } = grouped[productId];
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      grouped[productId].averageRating = totalRating / reviews.length;
    });

    setGroupedReviews(grouped);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy 'at' hh:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Manage Product Reviews
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Reviews are grouped by product. Click on a product to view all its
        reviews.
      </Typography>

      {Object.keys(groupedReviews).length > 0 ? (
        Object.keys(groupedReviews).map((productId) => {
          const { productName, reviews, averageRating } =
            groupedReviews[productId];
          const reviewCount = reviews.length;
          const hasLowRating = averageRating <= 2;

          return (
            <Accordion
              key={productId}
              expanded={expanded === productId}
              onChange={handleAccordionChange(productId)}
              sx={{
                mb: 2,
                boxShadow: 1,
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${productId}-content`}
                id={`panel-${productId}-header`}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: expanded === productId ? "4px 4px 0 0" : 4,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    pr: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {hasLowRating && (
                      <Tooltip title="Low rated product">
                        <WarningIcon
                          color="error"
                          fontSize="small"
                          sx={{ mr: 1 }}
                        />
                      </Tooltip>
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {productName}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <Rating
                          value={averageRating}
                          precision={0.1}
                          readOnly
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({averageRating.toFixed(1)})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Chip
                    label={`${reviewCount} ${
                      reviewCount === 1 ? "review" : "reviews"
                    }`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
                  {reviews.map((review, index) => (
                    <React.Fragment key={review.reviewId}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          py: 1.5,
                          px: 3,
                          borderLeft: 5,
                          borderColor: (theme) => {
                            if (review.rating >= 4)
                              return theme.palette.success.main;
                            if (review.rating >= 3)
                              return theme.palette.info.main;
                            if (review.rating >= 2)
                              return theme.palette.warning.main;
                            return theme.palette.error.main;
                          },
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
                                mb: 0.5,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                component="span"
                                fontWeight="medium"
                              >
                                {review.username || "Anonymous"}
                              </Typography>
                              <Box>
                                <Chip
                                  label={`Order #${review.orderId}`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                  sx={{ mr: 1 }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  component="span"
                                >
                                  {formatDate(review.reviewDate)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                              <Typography
                                variant="body1"
                                color="text.primary"
                                sx={{
                                  mt: 0.5,
                                  whiteSpace: "pre-wrap",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {review.comment || "No comment provided."}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < reviews.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="subtitle1" color="text.secondary">
            No reviews available
          </Typography>
        </Paper>
      )}

      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Card sx={{ minWidth: 275, flexGrow: 1 }}>
          <CardHeader title="Review Statistics" />
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Total Reviews
                </Typography>
                <Typography variant="h4" color="primary">
                  {reviews.length}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Products Reviewed
                </Typography>
                <Typography variant="h4" color="primary">
                  {Object.keys(groupedReviews).length}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography color="text.secondary" variant="body2">
                  Low Rated Products
                </Typography>
                <Typography variant="h4" color="error">
                  {
                    Object.values(groupedReviews).filter(
                      (group) => group.averageRating <= 2
                    ).length
                  }
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ManageReviews;

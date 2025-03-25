"use client"

import type React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  Paper,
} from "@mui/material"
import { Close } from "@mui/icons-material"

interface BlogDetailsModalProps {
  blog: {
    postId: number
    title: string
    description: string
    imageUrl: string
    postDate: string
    userId: number
    product?: {
      productId: number
    }
  } | null
  open: boolean
  onClose: () => void
}

const BlogDetailsModal = ({ blog, open, onClose }: BlogDetailsModalProps) => {
  if (!blog) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          pb: 2,
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          Blog Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                overflow: "hidden",
                borderRadius: 2,
                border: "1px solid #eee",
              }}
            >
              <Box
                component="img"
                src={blog.imageUrl}
                alt={blog.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  minHeight: "300px",
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }}
              />
            </Paper>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" gutterBottom>
                <div dangerouslySetInnerHTML={{ __html: blog.title }} />
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Post ID:</strong> {blog.postId}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Product ID:</strong> {blog.product?.productId ?? "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>User ID:</strong> {blog.userId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Posted on:</strong> {new Date(blog.postDate).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                Description
              </Typography>
              <Box
                sx={{
                  overflow: "auto",
                  flex: 1,
                  "& img": { maxWidth: "100%" },
                  "& table": { width: "100%", borderCollapse: "collapse" },
                  "& td, & th": { border: "1px solid #ddd", padding: "8px" },
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: blog.description }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BlogDetailsModal


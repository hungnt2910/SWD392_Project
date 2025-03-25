import { useState, useEffect } from "react";
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment, BlockQuote, Bold, ClassicEditor, Code
  , Essentials, FindAndReplace, FontBackgroundColor,
  FontColor, FontFamily, FontSize, HorizontalLine, Indent, IndentBlock, Italic, Paragraph,
  SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency,
  SpecialCharactersEssentials, SpecialCharactersLatin,
  SpecialCharactersMathematical, SpecialCharactersText, Strikethrough,
  Subscript, Superscript, Table, TableCaption, TableCellProperties,
  TableColumnResize, TableProperties, TableToolbar, Underline, Highlight
  , List, ListProperties, TodoList
} from "ckeditor5";

import { FormatPainter, MultiLevelList } from 'ckeditor5-premium-features';
import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { portserver } from "../../../utils/portserver";
import {jwtDecode} from "jwt-decode";
import BlogDetailsModal from "./BlogDetails"
import { Visibility } from "@mui/icons-material"

// interface Blog {
//   postId: number;
//   title: string;
//   description: string;
//   imageUrl: string;
//   postDate: string;
//   // user_id: number;
//   product_id: number;
//   userId: number; // Add userId property
// }

interface Blog {
  postId: number
  title: string
  description: string
  imageUrl: string
  postDate: string
  product_id?: number
  user_id?: number
  user?: {
    id: string
    username: string
  }
  product?: {
    productId: number
    productName?: string
  }
}

interface Product {
  productId: number
  productName: string
  description: string
  price: number
  isActive: number
  createdAt: string
  stock: number
  urlImage: string
  category_id: number
  brand_id: number
}

interface DecodedToken {
  userId: string;
}

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [product_id, setProductId] = useState<number | "">("");
  const [postDate, setPostDate] = useState<string>("");
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [user_id, setUserId] = useState<number | null>(null); // Add userId state

  // New state for blog details modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const navigate = useNavigate();

  // Decode userId from token
  const getUserId = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return parseInt(decoded.userId, 10) || null; // Convert to integer
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserId();
    setUserId(userId);
    fetchBlogs();
    fetchProducts()

  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${portserver}/blogs`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });

      setBlogs(response.data.map((blog: any) => ({ ...blog, postId: Number(blog.postId), userId: blog.user?.id })));
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${portserver}/skincare-product`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setProducts(response.data)
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }

  const handleCreateOrUpdateBlog = async () => {
    if (!title || !description || !image_url) {
      toast.error("All fields are required");
      return;
    }

    if (!user_id) {
      toast.error("User not authenticated");
      return;
    }

    const currentDate = new Date().toISOString()
    console.log("Generated postDate:", currentDate); // 🛠 Kiểm tra postDate trước khi gửi API

    const blogData = {
      title,
      description,
      image_url,
      postDate: currentDate,
      user_id,
      product_id,
    }

    try {
      if (editingBlogId) {
        await axios.put(`${portserver}/blogs/${editingBlogId}`, blogData, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(`${portserver}/blogs`, blogData, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
      }
      toast.success("Blog saved successfully");
      fetchBlogs();
      resetForm();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to save blog");
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setTitle(blog.title);
    setDescription(blog.description);
    setImageUrl(blog.imageUrl);
    setPostDate(blog.postDate);
    const productId = blog.product?.productId;
    setProductId(productId || "");
    setEditingBlogId(blog.postId); // postId is now a number
  };

  // New function to view blog details
  const handleViewBlogDetails = (blog: Blog) => {
    setSelectedBlog(blog)
    setDetailsModalOpen(true)
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setPostDate("");
    setProductId("");
    setEditingBlogId(null);
  };

  const handleDeleteBlog = async (postId: number) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${portserver}/blogs/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("Failed to delete blog");
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
  const columns: GridColDef<Blog>[] = [
    { field: "postId", headerName: "Post ID", flex: 0.5, minWidth: 60, headerAlign: "center", align: "center" },
    { field: "title", headerName: "Title", flex: 1, minWidth: 150, headerAlign: "center", align: "center" },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 300,
      editable: false,
      renderCell: (params) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {params.value ? params.value.replace(/<[^>]*>/g, "") : ""}
        </div>
      ),
    },
    {
      field: "imageUrl",
      headerName: "Image",
      flex: 0.8,
      minWidth: 120,
      editable: false,
      renderCell: (params) => {
        // Check if imageUrl exists and is not empty
        if (!params.value) {
          return (
            <Box
              sx={{
                width: "60px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              No Image
            </Box>
          )
        }

        return (
          <Box
            component="img"
            src={params.value}
            alt="Blog thumbnail"
            sx={{
              width: "60px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
            }}
          />
        )
      },
    },
    {
      field: "postDate",
      headerName: "Post Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => formatDate(params.value),

      editable: false,
    },
    { field: "userId", headerName: "User ID", flex: 0.5, minWidth: 60, headerAlign: "center", align: "center" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      minWidth: 220,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Visibility />}
            onClick={() => handleViewBlogDetails(params.row)}
          >
            View
          </Button>

          <Button variant="contained" color="primary" size="small" onClick={() => handleEditBlog(params.row)}>
            Edit
          </Button>

          <Button variant="contained" color="error" size="small" onClick={() => handleDeleteBlog(params.row.postId)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ]

  const editorConfiguration = {
    licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDM2MzgzOTksImp0aSI6ImYyN2NkNDM3LWRlMmEtNDQ2MC05ZmNjLWRhYzg3MjIwOGFjNSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjdiNTcyM2U1In0.m4GqPRhn1qDuW2eTypPjD2TIgGFIUdLQX7jDJSGbmiP2_8urop8nuTj2QCncPAK22YZ6SJ6SktJsh8SgBrS3oQ",

    plugins: [
      Essentials, Paragraph, Bold, Italic, Alignment, BlockQuote,
      FontBackgroundColor, FontColor, FontFamily, FontSize, Code,
      HorizontalLine, Indent, Underline, Strikethrough, Subscript, Superscript, SpecialCharacters, SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials, SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText, FormatPainter,
      Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar, Highlight
      , FindAndReplace, List, ListProperties, TodoList, MultiLevelList, IndentBlock
    ],
    toolbar: [
      "undo", "redo", "|", "bold", "italic", "underline", "strikethrough", "subscript", "superscript", "|",
      "fontFamily", "fontSize", "fontColor", "fontBackgroundColor", "|",
      "alignment", "blockQuote", "code", "|",
      "highlight", "horizontalLine", "|", "specialCharacters", "|",
      "insertTable", "tableColumn", "tableRow", "mergeTableCells", "|", "formatPainter",
      "FindAndReplace", 'bulletedList', 'numberedList', 'multiLevelList', 'todoList', 'outdent',
      'indent'
    ],
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"],
    },
  };

  const selectedProduct = product_id ? products.find((product) => product.productId === Number(product_id)) : null

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <ToastContainer />
      <Typography variant="h6" sx={{ mb: 2 }}>{editingBlogId ? "Update Blog" : "Create Blog"}</Typography>
      <Box component="form" sx={{ mb: 2 }}>
        <Autocomplete
          options={products}
          getOptionLabel={(option) => `${option.productName} (ID: ${option.productId})`}
          value={selectedProduct}
          isOptionEqualToValue={(option, value) => option.productId === value.productId}
          onChange={(_, newValue) => {
            setProductId(newValue ? newValue.productId : "")
          }}
          renderInput={(params) => {
            // Get the selected product name for the label when editing
            let labelText = "Select Product"
            if (selectedProduct) {
              labelText = selectedProduct.productName
            }

            return <TextField {...params} label={labelText} fullWidth sx={{ mt: 2, mb: 2 }} />
          }}
        />
        <Typography variant="subtitle1">Title</Typography>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={title}
          onChange={(_: any, editor) => setTitle(editor.getData())}
        />

        <Typography variant="subtitle1">Description</Typography>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          data={description}
          onChange={(_: any, editor) => setDescription(editor.getData())}
        />
        <TextField label="Image URL" value={image_url} onChange={(e) => setImageUrl(e.target.value)} fullWidth sx={{ mt: 2, mb: 2 }} />
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="secondary"  onClick={() => window.location.reload()} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleCreateOrUpdateBlog}>
            {editingBlogId ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mt: 4 }}>Blogs</Typography>
      <DataGrid
        rows={blogs.map((blog) => ({ ...blog, id: blog.postId }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        disableColumnMenu
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
      />
       <BlogDetailsModal blog={selectedBlog} open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)} />
    </Box>
  );
};

export default ManageBlogs;
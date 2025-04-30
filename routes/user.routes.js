const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const router = express.Router();
const User = require("../models/User.Model");
//varify token $ Admin ?? by ankit singh // $$
const { verifyToken, isAdmin } = require("../middleware/auth");  // Import middleware
const Admin = require("../models/Admin");

 require("dotenv").config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload buffer to Cloudinary
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ✅ Create User + Upload Photos
//  // ✅ Create User + Upload Photos
// router.post(
//   "/create",
//   upload.fields([
//     { name: "photo", maxCount: 1 },
//     { name: "certificate", maxCount: 1 },
//     { name: "idCard", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { name, email, rollNumber, adharNumber, fee, course, months, timing , phone } = req.body;

//       // Check if roll number already exists
//       const existingRollNumber = await User.findOne({ rollNumber });
//       if (existingRollNumber) {
//         return res.status(400).json({
//           success: false,
//           message: "Roll Number already exists. Please use a different Roll Number.",
//         });
//       }

//       // Check if email already exists
//       const existingEmail = await User.findOne({ email });
//       if (existingEmail) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already exists. Please use a different Email.",
//         });
//       }

//       // Upload files to Cloudinary if they exist
//       let photoUrl = "";
//       let certificateUrl = "";
//       let idCardUrl = "";

//       if (req.files.photo && req.files.photo[0]) {
//         const result = await streamUpload(req.files.photo[0].buffer);
//         photoUrl = result.secure_url;
//       }

//       if (req.files.certificate && req.files.certificate[0]) {
//         const result = await streamUpload(req.files.certificate[0].buffer);
//         certificateUrl = result.secure_url;
//       }

//       if (req.files.idCard && req.files.idCard[0]) {
//         const result = await streamUpload(req.files.idCard[0].buffer);
//         idCardUrl = result.secure_url;
//       }

//       // Create new user if no duplicates found
//       const newUser = new User({
//         name,
//         email,
//         rollNumber,
//         adharNumber,
//         fee,
//         timing,
//         months,
//         course,
//         phone,
//         photo: photoUrl,
//         certificate: certificateUrl,
//         idCard: idCardUrl,
//       });

//       await newUser.save();

//       res.status(201).json({
//         success: true,
//         user: newUser,
//       });
//     } catch (err) {
//       console.error("Error creating user:", err);
//       res.status(500).json({
//         success: false,
//         error: err.message,
//       });
//     }
//   }
// );
 // ✅ Create User + Upload Photos
router.post(
  "/create",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, rollNumber, adharNumber, fee, course, months, timing, phone } = req.body;

      // Check if roll number already exists
      const existingRollNumber = await User.findOne({ rollNumber });
      if (existingRollNumber) {
        return res.status(400).json({
          success: false,
          message: "Roll Number already exists. Please use a different Roll Number.",
        });
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists. Please use a different Email.",
        });
      }

      // ✅ Check if Aadhar Number already exists
      const existingAadhar = await User.findOne({ adharNumber });
      if (existingAadhar) {
        return res.status(400).json({
          success: false,
          message: "Aadhar Number already exists. Please use a different Aadhar Number.",
        });
      }

      // Upload files to Cloudinary if they exist
      let photoUrl = "";
      let certificateUrl = "";
      let idCardUrl = "";

      if (req.files.photo && req.files.photo[0]) {
        const result = await streamUpload(req.files.photo[0].buffer);
        photoUrl = result.secure_url;
      }

      if (req.files.certificate && req.files.certificate[0]) {
        const result = await streamUpload(req.files.certificate[0].buffer);
        certificateUrl = result.secure_url;
      }

      if (req.files.idCard && req.files.idCard[0]) {
        const result = await streamUpload(req.files.idCard[0].buffer);
        idCardUrl = result.secure_url;
      }

      // Create new user if no duplicates found
      const newUser = new User({
        name,
        email,
        rollNumber,
        adharNumber,
        fee,
        timing,
        months,
        course,
        phone,
        photo: photoUrl,
        certificate: certificateUrl,
        idCard: idCardUrl,
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        user: newUser,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// EDIT ROUTES ///
//only text edit 
// ✅ For normal text update (no files)
router.put("/edit/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, adharNumber, fee, course } = req.body;

    const updateData = { name, email, rollNumber, adharNumber, fee, course };

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//for flile update by ankit singh 2025
// ✅ For photo/certificate/idCard upload (with multer)
router.put("/editFile/:id", verifyToken, isAdmin,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, rollNumber, adharNumber, fee, course } = req.body;

      const updateData = { name, email, rollNumber, adharNumber, fee, course };

      if (req.files.photo && req.files.photo[0]) {
        const result = await streamUpload(req.files.photo[0].buffer);
        updateData.photo = result.secure_url;
      }

      if (req.files.certificate && req.files.certificate[0]) {
        const result = await streamUpload(req.files.certificate[0].buffer);
        updateData.certificate = result.secure_url;
      }

      if (req.files.idCard && req.files.idCard[0]) {
        const result = await streamUpload(req.files.idCard[0].buffer);
        updateData.idCard = result.secure_url;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
);

// ✅ Get All Users
router.get("/all" , async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ✅ Update User by ID


// // ✅ Delete User by ID
// router.delete("/delete/:id", verifyToken, Admin, async (req, res) => {
//   // Timeout handler - 10 seconds
//   const timeout = setTimeout(() => {
//     console.error("Request timed out while deleting user");
//     if (!res.headersSent) {
//       res.status(503).json({ success: false, message: "Request timed out" });
//     }
//   }, 10000); // 10 seconds

//   try {
//     const { id } = req.params;

//     // ✅ Validate ObjectId format (optional but recommended)
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       clearTimeout(timeout);
//       return res.status(400).json({ success: false, message: "Invalid user ID" });
//     }

//     const deletedUser = await User.findByIdAndDelete(id);

//     clearTimeout(timeout); // 🧹 Clear timeout when done

//     if (!deletedUser) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (err) {
//     clearTimeout(timeout); // 🧹 Clear timeout on error
//     console.error("Error deleting user:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID received:", id);
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


//feth by gmail and roll number 
// ✅ Get User by Email (Gmail)
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//LAST EDIT HAI YE //

// ✅ Get User by Roll Number
router.get("/:rollNumber", async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const user = await User.findOne({ rollNumber });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Error fetching user by roll number:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
/// isme login routes hia ye 
// ✅ Login API to check email and roll number
// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, rollNumber } = req.body;  // <-- body se data lena hai

    if (!email || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Email and Roll Number are required.",
      });
    }

    // Check if user exists with both email and roll number
    const user = await User.findOne({ email, rollNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No Account found. Please talk to admin or check credentials.",
      });
    }

    // Return user data if credentials are correct
    res.status(200).json({
      success: true,
      user, // sending full user details
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;



/// mai yaha ataka ho gmail aur rollnumbe se login karne mai toh mujhe
// yaha se start karan hai samaj ?? 
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, required: true }, // ✅ User ka profile photo required

  rollNumber: { type: String, required: true, unique: true }, // ✅ Roll Number required and unique
  adharNumber: {
    type: String,
    // required: true,
    unique: true,               ///edit the adharcard 
    minlength: 12,
    maxlength: 12,
    validate: {
      validator: function (v) {
        return /^\d{12}$/.test(v); // यह regex चेक करेगा कि 12 digits का नंबर हो और केवल digits हों
      },
      message: props => `${props.value} is not a valid Aadhaar Number! Aadhaar must be exactly 12 digits.`,
    }
  },
  
  certificate: { type: String }, // ✅ Certificate photo also required
  fee: { 
    type: String,
    // enum: ['Paid', 'Pending', 'Complete'] // ✅ Only these 3 values allowed
  },
  course: { 
    type: String,
    enum: ['Basic Computer','DCA','Advanced Excel','Photoshop','CorelDraw','Advaanced Basic','ADC','Typing English','Typing Hindi' ,'Web Development', 'Web Design', 'Tally Prime', 'Excel', 'ETEC'], // ✅ Predefined course names
    required: true 
  }, // ✅ Course Name required
  idCard: { type: String }, // ID Card photo URL (optional)

  months: {
    type: String,
    enum: [
      'January', 
      'February', 
      'March', 
      'April', 
      'May', 
      'June', 
      'July', 
      'August', 
      'September', 
      'October', 
      'November', 
      'December'
    ], // ✅ Predefined month names
    // required: true
  },
  phone: {
    type: String,
    // required: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  timing: { 
    type: String,
    enum: ['9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM', '5-6 PM', '6-7 PM', '7-8 PM', '8-9 PM'], // ✅ Predefined timing slots
    // required: true
  }, // ✅ Timing field required

   
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;

///ye last edit hai 28 apirl 2025 // lst
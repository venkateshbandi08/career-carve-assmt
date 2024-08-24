import jwt from "jsonwebtoken";

const authMiddleWare = async (req, res, next) => {
  const studentToken = req.headers['authorization']?.split(' ')[1];

  if (!studentToken) {
    return res.json({
      success: false,
      message: "No token Provided. Login again!",
    });
  }
  
  try {
    const tokenDecode = jwt.verify(studentToken, process.env.JWT_SECRET);
    
    req.body.studentId = tokenDecode.id;
    
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleWare;

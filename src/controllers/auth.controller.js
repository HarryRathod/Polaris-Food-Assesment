const authService = require("./../services/auth.service");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // true in production (HTTPS)
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const register = async (req, res) => {
  try {
    const { email, password, type, name, phone } = req.body;

    if (!email || !password || !type || !name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Name, email, password, phone and type are required",
      });
    }

    const token = await authService.register(req.body);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: { token }, // optional
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({
        success: false,
        error: "Email, password and type are required",
      });
    }

    const token = await authService.login(email, password, type);

    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: { token }, // optional
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
};

const aboutMe = (req, res) => {
  try {
    const user = req.user; // from middleware

    if (!user) {
      return res.status(401).json({ success: false });
    }

    res.json({ success: true, data: user });
  } catch {
    res.status(401).json({ success: false });
  }
};

module.exports = {
  register,
  login,
  aboutMe,
  logout,
};

// For BACKEND BASED CODE ONLY:
/*
const register = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({
        success: false,
        error: "Email, password and type are required",
      });
    }

    const token = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: { token },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({
        success: false,
        error: "Email, password and type are required",
      });
    }

    const token = await authService.login(email, password, type);

    res.status(200).json({
      success: true,
      data: { token },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};

*/

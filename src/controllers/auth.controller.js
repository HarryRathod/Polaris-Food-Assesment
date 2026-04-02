const authService = require("./../services/auth.service");

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

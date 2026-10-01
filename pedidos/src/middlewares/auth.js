import jwt from "jsonwebtoken";

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      mensaje: "Acceso denegado",
    });
  }

  try {
    const tokenLimpio = token.replace("Bearer ", "");

    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

    req.usuario = verificado;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido",
    });
  }
};

export default verificarToken;

const Curriculum = require('../models/cvModel');

const cvController = {
    // Para que el reclutador vea el PDF
    verPDF: async (req, res) => {
        try {
            const { id_candidato } = req.params;
            const archivo = await Curriculum.obtenerPorCandidato(id_candidato);

            if (!archivo) {
                return res.status(404).json({ mensaje: "No hay CV registrado." });
            }

            if (fs.existsSync(rutaArchivo)) {
                res.contentType("application/pdf");
                res.sendFile(rutaArchivo);
            } else {
                console.error("Ruta no encontrada:", rutaArchivo);
                res.status(404).json({ mensaje: "El archivo físico no existe en la carpeta del servidor." });
            }
        } catch (error) {
            console.error("Error al recuperar PDF:", error);
            res.status(500).json({ error: "Error interno al recuperar el archivo" });
        }
    }
};

module.exports = cvController;
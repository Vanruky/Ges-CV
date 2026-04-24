const adminService = require('../services/admin.service');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');


const getDashboard = async (req, res) => {
    try {
        const data = await adminService.getDashboardData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error en dashboard', error });
    }
};


const getHistorial = async (req, res) => {
    try {
        const data = await adminService.getPostulaciones(req.query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error en historial' });
    }
};


const deletePostulaciones = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !ids.length) {
            return res.status(400).json({ message: 'No hay IDs para eliminar' });
        }

        await adminService.deletePostulaciones(ids);

        res.json({ message: 'Eliminadas correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error eliminando postulaciones', error });
    }
};


const exportExcelHistorial = async (req, res) => {
    try {
        const data = await adminService.getPostulaciones(req.query);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Historial');

        sheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Estado', key: 'estado', width: 20 },
            { header: 'Cargo', key: 'cargo', width: 25 },
            { header: 'Candidato', key: 'candidato', width: 35 }
        ];

        data.forEach(r => {
            sheet.addRow({
                id: r.id_postulacion,
                fecha: r.fecha_postulacion,
                estado: r.estado,
                cargo: r.cargo,
                candidato: r.candidato
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=historial.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ message: 'Error export Excel historial', error });
    }
};


const exportPDFHistorial = async (req, res) => {
    try {
        const data = await adminService.getPostulaciones(req.query);

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=historial.pdf'
        );

        doc.pipe(res);

        doc.fontSize(18).text('Historial de Postulaciones', { align: 'center' });
        doc.moveDown();

        data.forEach(p => {
            doc
                .fontSize(10)
                .text(`Fecha: ${p.fecha_postulacion}`)
                .text(`Postulante: ${p.candidato}`)
                .text(`Cargo: ${p.cargo}`)
                .text(`Estado: ${p.estado}`)
                .moveDown();
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: 'Error export PDF historial', error });
    }
};


const getReportes = async (req, res) => {
    try {
        const data = await adminService.getReportes();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error reportes', error });
    }
};


const createReporte = async (req, res) => {
    try {
        const { tipo_reporte, descripcion, id_usuario } = req.body;

        const url_documento = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const result = await adminService.createReporte({
            tipo_reporte,
            descripcion,
            id_usuario,
            url_documento
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: 'Error creando reporte', error });
    }
};


const exportExcelReportes = async (req, res) => {
    try {
        const data = await adminService.getReportes();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Reportes');

        sheet.columns = [
            { header: 'Fecha', key: 'fecha', width: 25 },
            { header: 'Tipo', key: 'tipo', width: 25 },
            { header: 'Descripción', key: 'desc', width: 40 },
            { header: 'Usuario', key: 'user', width: 25 },
            { header: 'Archivo', key: 'file', width: 40 }
        ];

        data.forEach(r => {
            sheet.addRow({
                fecha: r.fecha_generacion,
                tipo: r.tipo_reporte,
                desc: r.descripcion,
                user: r.usuario_correo,
                file: r.url_documento
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=reportes.xlsx'
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ message: 'Error Excel reportes', error });
    }
};


const exportPDFReportes = async (req, res) => {
    try {
        const data = await adminService.getReportes();

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=reportes.pdf'
        );

        doc.pipe(res);

        doc.fontSize(18).text('Reportes del Sistema', { align: 'center' });
        doc.moveDown();

        data.forEach(r => {
            doc
                .fontSize(10)
                .text(`Tipo: ${r.tipo_reporte}`)
                .text(`Fecha: ${r.fecha_generacion}`)
                .text(`Descripción: ${r.descripcion}`)
                .text(`Usuario: ${r.usuario_correo}`)
                .moveDown();
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: 'Error PDF reportes', error });
    }
};


module.exports = {
    getDashboard,

    getHistorial,
    deletePostulaciones,
    exportExcelHistorial,
    exportPDFHistorial,

    getReportes,
    createReporte,
    exportExcelReportes,
    exportPDFReportes
};
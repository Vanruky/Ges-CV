const adminService = require('../services/admin.service');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');


// POSTULACIONES (HISTORIAL)
const getHistorial = async (req, res) => {
    try {
        const data = await adminService.getPostulaciones(req.query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error en historial' });
    }
};

// const getHistorial = async (req, res) => {
//     try {
//         const data = [
//             {
//                 id_postulacion: 1,
//                 fecha: '2026-04-27',
//                 postulante: 'Juan Pérez',
//                 cargo: 'Médico',
//                 estado: 'En proceso'
//             },
//             {
//                 id_postulacion: 2,
//                 fecha: '2026-04-26',
//                 postulante: 'María Soto',
//                 cargo: 'Enfermera',
//                 estado: 'Recomendado'
//             }
//         ];

//         res.json(data);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error en historial' });
//     }
// };


const deletePostulaciones = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !ids.length) {
            return res.status(400).json({ message: 'No hay IDs para eliminar' });
        }

        const MAX_DELETE = 50;

        if (ids.length > MAX_DELETE) {
            return res.status(400).json({
                message: `Solo puedes eliminar hasta ${MAX_DELETE} registros`
            });
        }

        await adminService.deletePostulaciones(ids);

        res.json({ message: 'Eliminadas correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error eliminando postulaciones' });
    }
};

// const deletePostulaciones = async (req, res) => {
//     try {
//         const { ids } = req.body;

//         console.log('Eliminando (mock):', ids);

//         res.json({ message: 'Eliminadas correctamente (mock)' });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error eliminando postulaciones' });
//     }
// };


const exportExcelHistorial = async (req, res) => {
    try {
        const data = await adminService.getPostulaciones(req.query);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Historial');

        sheet.columns = [
            { header: 'ID', key: 'id_postulacion', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Estado', key: 'estado', width: 20 },
            { header: 'Cargo', key: 'cargo', width: 25 },
            { header: 'Postulante', key: 'postulante', width: 35 }
        ];

        data.forEach(r => {
            sheet.addRow(r);
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
        res.status(500).json({ message: 'Error export Excel historial' });
    }
};

// const exportExcelHistorial = async (req, res) => {
//     try {
//         const data = [
//             {
//                 id_postulacion: 1,
//                 fecha: '2026-04-27',
//                 estado: 'En proceso',
//                 cargo: 'Administrativo/a',
//                 postulante: 'Juan Pérez'
//             },
//             {
//                 id_postulacion: 2,
//                 fecha: '2026-04-26',
//                 estado: 'Aprobado',
//                 cargo: 'Enfermero/a',
//                 postulante: 'María Soto'
//             }
//         ];

//         const workbook = new ExcelJS.Workbook();
//         const sheet = workbook.addWorksheet('Historial');

//         sheet.columns = [
//             { header: 'ID', key: 'id_postulacion', width: 10 },
//             { header: 'Fecha', key: 'fecha', width: 20 },
//             { header: 'Estado', key: 'estado', width: 20 },
//             { header: 'Cargo', key: 'cargo', width: 25 },
//             { header: 'Postulante', key: 'postulante', width: 30 }
//         ];

//         data.forEach(r => sheet.addRow(r));

//         res.setHeader(
//             'Content-Type',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         );

//         res.setHeader(
//             'Content-Disposition',
//             'attachment; filename=historial.xlsx'
//         );

//         await workbook.xlsx.write(res);
//         res.end();

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error export Excel historial' });
//     }
// };


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
                .text(`Fecha: ${p.fecha}`)
                .text(`Postulante: ${p.postulante}`)
                .text(`Cargo: ${p.cargo}`)
                .text(`Estado: ${p.estado}`)
                .moveDown();
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: 'Error export PDF historial' });
    }
};

// const exportPDFHistorial = async (req, res) => {
//     try {
//         const data = [
//             {
//                 fecha: '2026-04-27',
//                 postulante: 'Juan Pérez',
//                 cargo: 'Administrativo/a',
//                 estado: 'En proceso'
//             },
//             {
//                 fecha: '2026-04-26',
//                 postulante: 'María Soto',
//                 cargo: 'Enfermero/a',
//                 estado: 'Aprobado'
//             }
//         ];

//         const doc = new PDFDocument();

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader(
//             'Content-Disposition',
//             'attachment; filename=historial.pdf'
//         );

//         doc.pipe(res);

//         doc.fontSize(18).text('Historial de Postulaciones', { align: 'center' });
//         doc.moveDown();

//         data.forEach(p => {
//             doc
//                 .fontSize(10)
//                 .text(`Fecha: ${p.fecha}`)
//                 .text(`Postulante: ${p.postulante}`)
//                 .text(`Cargo: ${p.cargo}`)
//                 .text(`Estado: ${p.estado}`)
//                 .moveDown();
//         });

//         doc.end();

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error export PDF historial' });
//     }
// };



// REPORTES
const getReportes = async (req, res) => {
    try {
        const data = await adminService.getReportes(req.query);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error en reportes' });
    }
};

// const getReportes = async (req, res) => {
//     try {
//         const data = [
//             {
//                 id_reporte: 1,
//                 tipo_reporte: 'REPORTE_GENERAL',
//                 descripcion: 'Reporte de prueba',
//                 fecha_generacion: new Date(),
//                 url_documento: null,
//                 usuario: {
//                     id_usuario: 1,
//                     correo: 'test@correo.com'
//                 }
//             }
//         ];

//         res.json(data);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error reportes' });
//     }
// };


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

// const createReporte = async (req, res) => {
//     try {
//         console.log('Archivo recibido:', req.file);
//         console.log('Body:', req.body);

//         res.json({
//             message: 'Reporte creado (mock)',
//             data: {
//                 tipo_reporte: req.body.tipo_reporte,
//                 descripcion: req.body.descripcion
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error creando reporte' });
//     }
// };


const exportExcelReportes = async (req, res) => {
    try {
        const data = await adminService.getReportes(req.query);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Reportes');

        sheet.columns = [
            { header: 'Fecha', key: 'fecha_generacion', width: 25 },
            { header: 'Tipo', key: 'tipo_reporte', width: 25 },
            { header: 'Descripción', key: 'descripcion', width: 40 },
            { header: 'Usuario', key: 'usuario', width: 25 },
            { header: 'Archivo', key: 'url_documento', width: 40 }
        ];

        data.forEach(r => {
            sheet.addRow({
                fecha_generacion: r.fecha_generacion,
                tipo_reporte: r.tipo_reporte,
                descripcion: r.descripcion,
                usuario: r.usuario.correo,
                url_documento: r.url_documento
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
        res.status(500).json({ message: 'Error Excel reportes' });
    }
};

// const exportExcelReportes = async (req, res) => {
//     try {

//         const data = [
//             {
//                 fecha_generacion: new Date(),
//                 tipo_reporte: 'TEST',
//                 descripcion: 'Mock reporte',
//                 usuario: { correo: 'test@mail.com' },
//                 url_documento: null
//             }
//         ];

//         const workbook = new ExcelJS.Workbook();
//         const sheet = workbook.addWorksheet('Reportes');

//         sheet.columns = [
//             { header: 'Fecha', key: 'fecha_generacion', width: 25 },
//             { header: 'Tipo', key: 'tipo_reporte', width: 25 },
//             { header: 'Descripción', key: 'descripcion', width: 40 },
//             { header: 'Usuario', key: 'usuario', width: 25 }
//         ];

//         data.forEach(r => {
//             sheet.addRow({
//                 fecha_generacion: r.fecha_generacion,
//                 tipo_reporte: r.tipo_reporte,
//                 descripcion: r.descripcion,
//                 usuario: r.usuario.correo
//             });
//         });

//         res.setHeader(
//             'Content-Type',
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//         );

//         res.setHeader(
//             'Content-Disposition',
//             'attachment; filename=reportes.xlsx'
//         );

//         await workbook.xlsx.write(res);
//         res.end();

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error Excel reportes' });
//     }
// };


const exportPDFReportes = async (req, res) => {
    try {
        const data = await adminService.getReportes(req.query);

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
                .text(`Usuario: ${r.usuario.correo}`)
                .moveDown();
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: 'Error PDF reportes' });
    }
};

// const exportPDFReportes = async (req, res) => {
//     try {
//         const data = [
//             {
//                 tipo_reporte: 'DISPONIBILIDAD_POR_CARGO',
//                 fecha_generacion: new Date(),
//                 descripcion: 'Reporte de disponibilidad',
//                 usuario: { correo: 'admin@test.com' }
//             },
//             {
//                 tipo_reporte: 'BAJA_POSTULACION',
//                 fecha_generacion: new Date(),
//                 descripcion: 'Postulaciones eliminadas',
//                 usuario: { correo: 'rrhh@test.com' }
//             }
//         ];

//         const doc = new PDFDocument();

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader(
//             'Content-Disposition',
//             'attachment; filename=reportes.pdf'
//         );

//         doc.pipe(res);

//         doc
//             .fontSize(18)
//             .text('Reportes del Sistema', { align: 'center' });

//         doc.moveDown();

//         data.forEach(r => {
//             doc
//                 .fontSize(12)
//                 .text(`Tipo: ${r.tipo_reporte}`)
//                 .text(`Fecha: ${new Date(r.fecha_generacion).toLocaleString()}`)
//                 .text(`Descripción: ${r.descripcion || '-'}`)
//                 .text(`Usuario: ${r.usuario.correo}`)
//                 .moveDown();
//         });

//         doc.end();

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error PDF reportes' });
//     }
// };


module.exports = {
    getHistorial,
    deletePostulaciones,
    exportExcelHistorial,
    exportPDFHistorial,

    getReportes,
    createReporte,
    exportExcelReportes,
    exportPDFReportes
};
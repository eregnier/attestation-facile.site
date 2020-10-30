import { PDFDocument, StandardFonts } from 'pdf-lib'

import QRCode from 'qrcode'
import pdfBase from '../certificate.pdf'

const generateQR = async (text) => {
    try {
        const opts = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
        }
        return await QRCode.toDataURL(text, opts)
    } catch (err) {
        console.error(err)
    }
}


export default async (profile, reason) => {
    const creationInstant = new Date()
    const creationDate = creationInstant.toLocaleDateString('fr-FR')
    const creationHour = creationInstant
        .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        .replace(':', 'h')

    const {
        lastname,
        firstname,
        birthday,
        lieunaissance,
        address,
        zipcode,
        town,
        destinationtown,
        destinationcounty,
        datesortie,
    } = profile

    const data = [
        `Cree le: ${creationDate} a ${creationHour}`,
        `Nom: ${lastname}`,
        `Prenom: ${firstname}`,
        `Naissance: ${birthday} a ${lieunaissance}`,
        `Adresse: ${address} ${zipcode} ${town}`,
        `Sortie: ${datesortie} vers ${destinationtown} (${destinationcounty})`,
        `Motifs: ${reason}`,
    ].join(';\n ')

    const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // set pdf metadata
    pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
    pdfDoc.setSubject('Déclaration de déplacement en dehors de son département et à plus de 100 km de son domicile')
    pdfDoc.setKeywords(['covid19', 'covid-19', 'attestation', 'déclaration', 'déplacement', 'officielle', 'gouvernement'])
    pdfDoc.setProducer('DNUM/SDIT')
    pdfDoc.setCreator('')
    pdfDoc.setAuthor('Ministère d l\'intérieur')

    const page1 = pdfDoc.getPages()[0]

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const drawText = (text, x, y, size = 11) => {
        page1.drawText(text, { x, y, size, font })
    }

    drawText(`${firstname} ${lastname}`, 120, 620)
    drawText(`${address} ${zipcode} ${town}`, 130, 600)


    if (reason === 'travail') {
        drawText('x', 95, 504, 20)
    }
    if (reason === 'achats') {
        drawText('x', 95, 457, 20)
    }
    if (reason === 'sante') {
        drawText('x', 95, 413, 20)
    }
    if (reason === 'famille') {
        drawText('x', 95, 376, 20)
    }
    if (reason === 'handicap') {
        drawText('x', 95, 340, 20)
    }
    if (reason === 'promenade') {
        drawText('x', 95, 305, 20)
    }
    if (reason === 'judiciaire') {
        drawText('x', 95, 238, 20)
    }
    if (reason === 'missions') {
        drawText('x', 95, 202, 20)
    }
    if (reason === 'ecole') {
        drawText('x', 95, 166, 20)
    }
    drawText(`${creationDate}, ${creationHour}`, 100, 107)
    drawText(town, 110, 134)

    const generatedQR = await generateQR(data)

    const qrImage = await pdfDoc.embedPng(generatedQR)

    page1.drawImage(qrImage, {
        x: page1.getWidth() - 156,
        y: 50,
        width: 92,
        height: 92,
    })

    const page2 = pdfDoc.getPages()[1]
    page2.drawImage(qrImage, {
        x: 50,
        y: page2.getHeight() - 350,
        width: 300,
        height: 300,
    })

    const pdfBytes = await pdfDoc.save()

    return new Blob([pdfBytes], { type: 'application/pdf' })
}

import jsPDF from "jspdf";
import logo from "@/assets/logo.png";

export const generateInvoicePDF = (data: {
    repairId: string,
    issue: string,
    deviceVendor: string,
    deviceModel: string,
    partType: string,
    price: string,
    userDetails: {
        name: string,
        phone: string,
        address: string,
        city: string,
        serviceType: string;
    }
}) => {
    const doc = new jsPDF();

    // Add logo
    const imgProps = {
        x: 150,
        y: 10,
        width: 40,
        height: 20,
    };
    doc.addImage(logo, "PNG", imgProps.x, imgProps.y, imgProps.width, imgProps.height);

    // Title
    doc.setFontSize(16);
    doc.text("Repair Invoice", 20, 20);

    // Details
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${data.repairId}`, 20, 40);
    doc.text(`Repair Type: ${data.issue}`, 20, 50);
    doc.text(`Device: ${data.deviceVendor} - ${data.deviceModel}`, 20, 60);
    doc.text(`Part Type: ${data.partType}`, 20, 70);
    doc.text(`Price: ${data.price}`, 20, 80);

    // Customer Info
    doc.text("Customer Info:", 20, 100);
    doc.text(`Name: ${data.userDetails.name}`, 20, 110);
    doc.text(`Phone: ${data.userDetails.phone}`, 20, 120);
    doc.text(`Address: ${data.userDetails.address}`, 20, 130);
    doc.text(`City: ${data.userDetails.city}`, 20, 140);
    doc.text(`Service Type: ${data.userDetails.serviceType}`, 20, 150);

    // Save
    doc.save(`Invoice-${data.repairId}.pdf`);
}
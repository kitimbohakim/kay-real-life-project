document.addEventListener("DOMContentLoaded", () => {
    const app = window.KRLDashboard;
    if (!app) return;

    const downloadPdfBtn = document.getElementById("downloadPdfBtn");
    if (!downloadPdfBtn) return;

    downloadPdfBtn.addEventListener("click", () => {
        if (!app.selectedSubmissionId || !window.jspdf) return;

        const submission = app.getSubmissions().find(
            (item) => item.id === app.selectedSubmissionId
        );

        if (!submission) return;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const name = submission.name || "-";
        const artist = submission.artist || "-";
        const email = submission.email || "-";
        const phone = submission.phone || "-";
        const country = submission.country || submission.countryCode || "-";
        const status = submission.status || "New";
        const createdAt = submission.createdAt || "-";
        const updatedAt = submission.updatedAt || "-";
        const message = submission.message || "-";
        const notes = submission.notes || "No notes";
        const history = Array.isArray(submission.statusHistory)
            ? submission.statusHistory
            : [];

        doc.setFontSize(20);
        doc.text("Kay Real Life", 20, 20);

        doc.setFontSize(14);
        doc.text("Submission Details", 20, 32);

        doc.setFontSize(11);
        doc.text(`Name: ${name}`, 20, 48);
        doc.text(`Artist: ${artist}`, 20, 56);
        doc.text(`Email: ${email}`, 20, 64);
        doc.text(`Phone: ${phone}`, 20, 72);
        doc.text(`Country: ${country}`, 20, 80);
        doc.text(`Status: ${status}`, 20, 88);
        doc.text(`Submitted: ${createdAt}`, 20, 96);
        doc.text(`Last Updated: ${updatedAt}`, 20, 104);

        doc.setFontSize(12);
        doc.text("Message:", 20, 120);
        doc.setFontSize(11);

        const messageLines = doc.splitTextToSize(message, 170);
        doc.text(messageLines, 20, 130);

        let currentY = 130 + (messageLines.length * 6) + 12;

        doc.setFontSize(12);
        doc.text("Status History:", 20, currentY);
        currentY += 8;

        doc.setFontSize(11);
        if (history.length) {
            history.forEach((entry) => {
                const line = `• ${entry.status} - ${entry.at || "-"}`;
                const lines = doc.splitTextToSize(line, 170);
                doc.text(lines, 20, currentY);
                currentY += lines.length * 6;
            });
        } else {
            doc.text("No status history yet.", 20, currentY);
            currentY += 8;
        }

        currentY += 8;
        doc.setFontSize(12);
        doc.text("Internal Notes:", 20, currentY);
        currentY += 8;

        doc.setFontSize(11);
        const noteLines = doc.splitTextToSize(notes, 170);
        doc.text(noteLines, 20, currentY);

        const safeArtist = String(artist)
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]+/g, "");

        doc.save(`${safeArtist || "submission"}_submission.pdf`);
    });
});
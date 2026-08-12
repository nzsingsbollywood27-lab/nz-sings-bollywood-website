const DEFAULT_TO_EMAILS = "nzsingsbollywood@gmail.com,nzsingsbollywood27@gmail.com";
const DEFAULT_FROM_EMAIL = "NZ Sings Bollywood <onboarding@resend.dev>";
const DEFAULT_REPLY_TO = "nzsingsbollywood@gmail.com";

function buildEmailHtml(form) {
    const safe = (value) =>
        String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    return `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2>New NZ Sings Bollywood website enquiry</h2>
            <p><strong>Enquiry type:</strong> ${safe(form.type)}</p>
            <p><strong>Name:</strong> ${safe(form.name)}</p>
            <p><strong>Organisation:</strong> ${safe(form.organisation || "-")}</p>
            <p><strong>Email:</strong> ${safe(form.email)}</p>
            <p><strong>Phone:</strong> ${safe(form.phone || "-")}</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${safe(form.message)}</p>
        </div>
    `;
}

function validate(form) {
    if (!form.name || !form.email || !form.type || !form.message) {
        return "Name, email, enquiry type and message are required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        return "A valid email address is required.";
    }

    return "";
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ ok: false, error: "Method not allowed." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ ok: false, error: "RESEND_API_KEY is missing." });
    }

    const form = req.body || {};
    const validationError = validate(form);

    if (validationError) {
        return res.status(400).json({ ok: false, error: validationError });
    }

    const toEmails = (process.env.CONTACT_TO_EMAILS || DEFAULT_TO_EMAILS)
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);

    const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;
    const replyTo = process.env.CONTACT_REPLY_TO || DEFAULT_REPLY_TO;

    try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: fromEmail,
                to: toEmails,
                reply_to: form.email || replyTo,
                subject: `[${form.type}] Website enquiry — ${form.name}`,
                html: buildEmailHtml(form),
                text: [
                    "New NZ Sings Bollywood website enquiry",
                    "",
                    `Enquiry type: ${form.type}`,
                    `Name: ${form.name}`,
                    `Organisation: ${form.organisation || "-"}`,
                    `Email: ${form.email}`,
                    `Phone: ${form.phone || "-"}`,
                    "",
                    "Message:",
                    form.message,
                ].join("\n"),
            }),
        });

        const result = await resendResponse.json().catch(() => ({}));

        if (!resendResponse.ok) {
            return res.status(resendResponse.status).json({
                ok: false,
                error: result.message || "Resend failed to send the enquiry.",
            });
        }

        return res.status(200).json({ ok: true, id: result.id });
    } catch (error) {
        return res.status(500).json({ ok: false, error: "Email service error." });
    }
};

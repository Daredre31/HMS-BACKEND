import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendStudentIdEmail = async (
  studentName: string,
  studentEmail: string,
  tokenId: string
) => {
  await resend.emails.send({
    from: 'ApplickHostel <onboarding@resend.dev>', 
    to: studentEmail,
    subject: 'Your HostelOS Login ID',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2 style="color:#0d9488;">Welcome to HostelOS, ${studentName}!</h2>
        <p>Your hostel account has been created. Use the ID below to log in:</p>
        <div style="background:#f1f5f9;border-radius:8px;padding:16px;text-align:center;margin:24px 0;">
          <span style="font-family:monospace;font-size:20px;font-weight:bold;letter-spacing:4px;color:#0f172a;">
            ${tokenId}
          </span>
        </div>
        <p style="color:#64748b;font-size:13px;">
          Keep this ID safe — it's the only way to access your portal. 
          Contact your hostel admin if you have any issues.
        </p>
      </div>
    `
  })
}
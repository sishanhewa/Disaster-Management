<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Verify Your Email - SIDMS</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Verify Your Email</h1>
            <p>Sri Lanka Disaster Management System</p>
        </div>
        <div class="content">
            <h2>Hello,</h2>
            <p>Thank you for registering with SIDMS. To complete your registration and secure your account, please verify your email address using the code below:</p>
            
            <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #666;">Your verification code:</p>
                <div class="otp-code">${otpCode}</div>
            </div>
            
            <div class="warning">
                <strong>⏰ Expires in ${expiryMinutes} minutes</strong><br>
                This code will expire and cannot be used after that time.
            </div>
            
            <p>If you didn't request this verification, please ignore this email or contact support if you're concerned about your account security.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="font-size: 14px; color: #666;">
                <strong>Need help?</strong><br>
                Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2024 SIDMS - Sri Lanka Disaster Management System<br>
            This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

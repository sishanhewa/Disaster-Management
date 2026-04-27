<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIDMS Weather Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
    <tr>
        <td align="center" style="padding: 20px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <tr>
                    <td align="center" style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">SIDMS</h1>
                        <p style="color: #e0e0e0; margin: 5px 0 0; font-size: 14px;">Sri Lanka Disaster Management System</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #1e3a5f; margin-top: 0; margin-bottom: 20px; font-size: 22px;">${alertTitle}</h2>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            ${alertDescription}
                        </p>

                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border: 1px solid #e0e0e0; border-radius: 4px;">
                            <tr>
                                <td style="background-color: #f9f9f9; padding: 15px; font-weight: bold; border-bottom: 1px solid #e0e0e0;" colspan="2">Alert Details</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; width: 40%;">Location:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">${locationName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">Severity:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;"><strong style="color: ${severityColor};">${severity}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">Event Type:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">${eventType}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px;">Time:</td>
                                <td style="padding: 10px 15px;">${alertTime}</td>
                            </tr>
                        </table>

                        <p style="text-align: center; margin-top: 30px;">
                            <a href="${dashboardUrl}" target="_blank" style="background-color: #2d5a87; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">View Dashboard</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 30px; background-color: #eeeeee; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                        <p style="color: #777777; font-size: 12px; margin: 0;">
                            You received this alert because you have notifications enabled for this location.
                        </p>
                        <p style="color: #777777; font-size: 12px; margin: 5px 0 0;">
                            &copy; ${.now?string("yyyy")} SIDMS. All rights reserved.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>

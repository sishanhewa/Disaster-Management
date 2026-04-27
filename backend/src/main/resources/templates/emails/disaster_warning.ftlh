<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIDMS Disaster Warning</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
    <tr>
        <td align="center" style="padding: 20px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <tr>
                    <td align="center" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">⚠️ DISASTER WARNING</h1>
                        <p style="color: #fee2e2; margin: 5px 0 0; font-size: 14px;">Sri Lanka Disaster Management System</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #b91c1c; margin-top: 0; margin-bottom: 20px; font-size: 22px;">${warningHeadline}</h2>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; color: #7f1d1d;">
                            ${warningText}
                        </p>

                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border: 1px solid #fecaca; border-radius: 4px;">
                            <tr>
                                <td style="background-color: #fef2f2; padding: 15px; font-weight: bold; border-bottom: 1px solid #fecaca; color: #991b1b;" colspan="2">Warning Details</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #fee2e2; width: 40%;">Severity:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #fee2e2;"><strong style="color: #dc2626;">${severity}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #fee2e2;">Category:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #fee2e2;">${category}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #fee2e2;">Affected Areas:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #fee2e2;">${areaText}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px;">Expires:</td>
                                <td style="padding: 10px 15px;">${expiresAt}</td>
                            </tr>
                        </table>

                        <#if instructions??>
                        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 15px; margin-bottom: 25px;">
                            <h3 style="color: #166534; margin-top: 0; margin-bottom: 10px; font-size: 16px;">Instructions:</h3>
                            <p style="color: #166534; margin: 0; line-height: 1.5;">${instructions}</p>
                        </div>
                        </#if>

                        <p style="text-align: center; margin-top: 30px;">
                            <a href="${mapUrl}" target="_blank" style="background-color: #dc2626; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">View on Map</a>
                            <a href="${emergencyUrl}" target="_blank" style="background-color: #166534; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; margin-left: 10px;">Emergency Help</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px 30px; background-color: #eeeeee; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                        <p style="color: #777777; font-size: 12px; margin: 0;">
                            This is an official warning from the Sri Lanka Disaster Management System.
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

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIDMS SOS Emergency Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7;">
    <tr>
        <td align="center" style="padding: 20px 0;">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <!-- Emergency Header -->
                <tr>
                    <td align="center" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="padding-right: 15px;">
                                    <div style="width: 50px; height: 50px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-block; text-align: center; line-height: 50px;">
                                        <span style="font-size: 28px;">🚨</span>
                                    </div>
                                </td>
                                <td>
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">EMERGENCY SOS</h1>
                                    <p style="color: #fca5a5; margin: 5px 0 0; font-size: 14px;">Sri Lanka Disaster Management System</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Alert Content -->
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #dc2626; margin-top: 0; margin-bottom: 20px; font-size: 24px; font-weight: 700;">${alertTitle}</h2>

                        <!-- Priority Banner -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
                            <tr>
                                <td style="padding: 15px;">
                                    <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: bold;">⚠️ This is an emergency SOS alert requiring immediate attention.</p>
                                </td>
                            </tr>
                        </table>

                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                            ${alertDescription}
                        </p>

                        <!-- Incident Details -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border: 1px solid #e0e0e0; border-radius: 4px;">
                            <tr>
                                <td style="background-color: #f9f9f9; padding: 15px; font-weight: bold; border-bottom: 1px solid #e0e0e0;" colspan="2">Incident Details</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; width: 40%;">Location:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;"><strong>${locationName}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">GPS Coordinates:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0; font-family: monospace;">${latitude}, ${longitude}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">Status:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;"><strong style="color: ${statusColor};">${status}</strong></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">Triggered By:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">${userName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;">Contact Phone:</td>
                                <td style="padding: 10px 15px; border-bottom: 1px solid #e0e0e0;"><a href="tel:${contactPhone}" style="color: #2d5a87; text-decoration: none;">${contactPhone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 15px;">Time:</td>
                                <td style="padding: 10px 15px;">${alertTime}</td>
                            </tr>
                        </table>

                        <!-- Medical Notes -->
                        <#if medicalNotes?? && medicalNotes?has_content>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border: 1px solid #fecaca; border-radius: 4px; background-color: #fef2f2;">
                            <tr>
                                <td style="background-color: #fee2e2; padding: 12px 15px; font-weight: bold; color: #991b1b;" colspan="2">🩺 Medical / Situational Notes</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px; color: #7f1d1d; font-style: italic;">${medicalNotes}</td>
                            </tr>
                        </table>
                        </#if>

                        <!-- Weather Context -->
                        <#if weatherContext?? && weatherContext?has_content>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border: 1px solid #e0e0e0; border-radius: 4px;">
                            <tr>
                                <td style="background-color: #f0f9ff; padding: 12px 15px; font-weight: bold; color: #0369a1;" colspan="2">🌤️ Current Weather at Location</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px;">${weatherContext}</td>
                            </tr>
                        </table>
                        </#if>

                        <!-- Battery Level Warning -->
                        <#if batteryLevel?? && batteryLevel &lt; 20>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border: 1px solid #fcd34d; border-radius: 4px; background-color: #fffbeb;">
                            <tr>
                                <td style="padding: 12px 15px; color: #92400e;">
                                    <strong>⚠️ Low Battery Warning:</strong> User's device battery is at ${batteryLevel}%. Communication may be lost soon.
                                </td>
                            </tr>
                        </table>
                        </#if>

                        <!-- Action Buttons -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
                            <tr>
                                <td align="center">
                                    <a href="${dashboardUrl}" target="_blank" style="background-color: #dc2626; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; margin-right: 10px;">View in Dashboard</a>
                                    <a href="${mapUrl}" target="_blank" style="background-color: #2d5a87; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">Open Map</a>
                                </td>
                            </tr>
                        </table>

                        <!-- Quick Actions -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px; background-color: #f9fafb; border-radius: 4px;">
                            <tr>
                                <td style="padding: 15px;">
                                    <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280; font-weight: bold;">QUICK ACTIONS:</p>
                                    <p style="margin: 0; font-size: 13px; color: #374151;">
                                        <a href="tel:${contactPhone}" style="color: #dc2626; text-decoration: none; margin-right: 15px;">📞 Call Victim</a>
                                        <a href="${respondUrl}" style="color: #059669; text-decoration: none; margin-right: 15px;">✅ Mark Responding</a>
                                        <a href="${smsUrl}" style="color: #2d5a87; text-decoration: none;">💬 Send SMS</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td align="center" style="padding: 20px 30px; background-color: #fef2f2; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                        <p style="color: #991b1b; font-size: 12px; margin: 0; font-weight: bold;">
                            This is an emergency notification from the SIDMS disaster management system.
                        </p>
                        <p style="color: #7f1d1d; font-size: 11px; margin: 8px 0 0;">
                            Please respond immediately. If you are unable to assist, please forward this alert to available responders.
                        </p>
                        <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 0;">
                            &copy; ${.now?string("yyyy")} SIDMS. Emergency Reference: ${referenceId}
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>

def send_otp_email(email: str, otp_code: str, role: str):
    """
    Mock function to send an email. 
    In production, integrate with SMTP or a service like SendGrid.
    """
    print(f"\n{'='*40}")
    print(f"📧 EMAIL DISPATCHED")
    print(f"To: {email}")
    print(f"Subject: Your TeleCardio {role} Login Code")
    print(f"Body: Your OTP is {otp_code}. It will expire in 5 minutes.")
    print(f"{'='*40}\n")
    return True
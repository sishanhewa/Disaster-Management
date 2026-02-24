import socket
import sys

# Attempting to strictly check TCP port 6543 on all possible pooler hostnames
regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2", "ap-south-1",
    "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1",
    "sa-east-1", "ca-central-1"
]

project_id = "lsifxegbixreyaryskds"
user = f"postgres.{project_id}"
password = "Sishan_SLIIT123"
dbname = "postgres"
port = 6543

success = False
try:
    import psycopg2
    has_psycopg = True
except ImportError:
    has_psycopg = False

if has_psycopg:
    print("Testing via psycopg2...")
    for region in regions:
        host = f"aws-0-{region}.pooler.supabase.com"
        print(f"Testing {host}...")
        try:
            conn = psycopg2.connect(
                host=host,
                database=dbname,
                user=user,
                password=password,
                port=port,
                connect_timeout=2
            )
            print(f"SUCCESS! Found via SQL: {host}")
            conn.close()
            success = True
            break
        except Exception as e:
            if "Tenant or user not found" not in str(e):
                pass
else:
    print("Testing via TCP (less accurate)...")
    import ssl
    import struct
    
    def simulate_pg_startup(host):
        try:
            sock = socket.create_connection((host, port), timeout=2)
            sock.sendall(struct.pack('!ii', 8, 80877103))
            resp = sock.recv(1)
            if resp == b'S':
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                ssl_sock = context.wrap_socket(sock, server_hostname=host)
                
                msg = b""
                msg += b"user\0" + user.encode() + b"\0"
                msg += b"database\0" + dbname.encode() + b"\0"
                msg += b"\0"
                
                msg_len = len(msg) + 8
                ssl_sock.sendall(struct.pack('!ii', msg_len, 196608) + msg)
                
                data = ssl_sock.recv(1024)
                if b"Tenant or user not found" not in data:
                    print(data)
                    return True
        except Exception:
            pass
        return False

    for region in regions:
        host = f"aws-0-{region}.pooler.supabase.com"
        print(f"Testing {host}...")
        if simulate_pg_startup(host):
            print(f"SUCCESS! Found via TCP: {host}")
            success = True
            break
            
if not success:
    print("Failed to find region.")
    sys.exit(1)

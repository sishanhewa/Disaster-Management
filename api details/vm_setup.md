# Virtual Private Server (VPS) Setup Guide

This document outlines the infrastructure and configuration of the production server hosting the Rivernet AI backend. It is intended for administrators or future developers who need to access the server, restart services, or manage the database.

## Server Details
* **Provider:** Microsoft Azure
* **OS:** Ubuntu 22.04 LTS
* **Public IP (IPv4):** `104.208.67.128`
* **Authentication:** SSH via Key Pair (`river-key.pem`)
* **Username:** `azureuser`

### How to Connect (SSH)
To manage the server, open a terminal on your local machine containing the `river-key.pem` file and run:
```bash
ssh -i /path/to/river-key.pem azureuser@104.208.67.128
```

## Internal Services 

### 1. PostgreSQL Database
The database is installed locally on the VPS and runs continuously as a system service.
* **Service Name:** `postgresql`
* **Local Internal Address:** `localhost:5432`
* **Database Name:** `river_levels`
* **Admin User:** `river_user`
* **Password:** `ITP_SE_03`

**External Access:** The `postgresql.conf` has been modified to listen on all addresses (`*`), and `pg_hba.conf` allows connections from `0.0.0.0/0`. To connect via DataGrip or pgAdmin, ensure you map to the Public IP `104.208.67.128` on port `5432`.

### 2. FastAPI Backend (River API)
The Python application handles all API requests (frontend) and background scheduling (ArcGIS).
* **Location on Server:** `~/app`
* **Virtual Environment:** `~/app/venv`
* **Process Manager:** `systemd`

Because the API must run 24/7 independently of the SSH session, it is registered as an Ubuntu background service called `river-api`.

**Useful API Commands:**
* **Check Status:** `sudo systemctl status river-api`
* **Restart API:** `sudo systemctl restart river-api` *(Do this after changing `.env` or pulling new code)*
* **View Live App Logs:** `sudo journalctl -u river-api -f`

## Deployment
If you make changes to the Python code locally on your machine, you must push the changes to the VPS.
We use `rsync` to synchronize the directory securely. 
From your local project root (`Sri-Lanka-River-Level-Prediction`), run:
```bash
rsync -avz -e "ssh -i river-key.pem" --exclude 'venv' --exclude '.git' --exclude '__pycache__' --exclude 'frontend/node_modules' --exclude '.env' ./ azureuser@104.208.67.128:~/app/
```
*(Note: Always exclude `.env` to prevent overwriting production credentials!)*

## Security Networking (Azure NSG)
The Azure Network Security Group (NSG) associated with this VM exposes two specific ports:
1. **Port 8000 (TCP):** Exposes the FastAPI application to the internet so the React frontend can make HTTP requests (`Allow Any`).
2. **Port 5432 (TCP):** Exposes the PostgreSQL database. *(Note: For production security, restrict this rule's Source IP address specifically to your developers' IPs rather than 'Any'.)*

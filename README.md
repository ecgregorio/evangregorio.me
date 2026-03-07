# Deploying FastAPI on AWS EC2 (Ubuntu 24.04)

## Project Overview

This project is a FastAPI backend deployed on an **AWS EC2** instance running Ubuntu 24.04 and connected to a **PostgreSQL** database.  
I'm working on this as a prototype for a future project and for learning **cloud deployment**, **backend development**, and **database integration**.

The API is live and accessible via the web. You can test endpoints directly in your browser or with tools like Postman.

Currently in early early experimentation phase.

## Tech Stack
- Cloud / OS: AWS EC2, Ubuntu 24.04 LTS
- Backend: Python 3.12, FastAPI, Uvicorn, Gunicorn
- Database: PostgreSQL 16+, SQLAlchemy ORM
- Networking / Deployment: Nginx reverse proxy, HTTPS with Certbot, SSH, systemd service management

## Live Server
You can access the API here:

🌐 https://www.evangregorio.me

You can also access the interactive API docs (Swagger UI) directly:

🌐 https://www.evangregorio.me/docs

## Preview

> March 04, 2026 20:44
> Deployment of a live FastAPI API connected to a PostgreSQL database on AWS EC2
<img width="500" height="450" alt="image" src="https://github.com/user-attachments/assets/a81a5ad0-88f0-4ca7-bfbc-7fc12c954342" />

## Notes

- The API is running behind Nginx with HTTPS provided by Certbot.
- FastAPI is served via Gunicorn and managed by systemd for automatic restart and reliability.
- Any changes to code require restarting the FastAPI systemd service: ```sudo systemctl restart fastapi```

# use official python 3.12 image as base
FROM python:3.12-slim

# set working directory in container
WORKDIR /app

# copy reqs (for caching)
COPY requirements.txt .

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy the rest of the app code
COPY . .

# expose the port FastAPI will run on
EXPOSE 8000

# command to run app with Gunicorn
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]

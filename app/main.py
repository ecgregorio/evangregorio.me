from fastapi import FastAPI
<<<<<<< HEAD

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on AWS!"}
=======
from .database import engine
from .models import Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
	return {"message": "Hello from FastAPI on AWS!"}
>>>>>>> 2e7469f (Connected -m Connected FastAPI to PostgreSQL on AWS EC2)

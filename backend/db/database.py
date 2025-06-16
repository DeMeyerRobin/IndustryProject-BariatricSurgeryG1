from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "mysql+pymysql://root:rootuser@localhost:3306/DoctorDb" # local
DATABASE_URL = "mysql+pymysql://root:rootuser@localhost:3307/DoctorDb" # docker

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
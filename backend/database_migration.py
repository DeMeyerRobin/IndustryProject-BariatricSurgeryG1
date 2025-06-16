from db.database import Base, engine
from db import models  # this must be imported so Base sees the models

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")
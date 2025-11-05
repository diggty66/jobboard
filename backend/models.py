from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="seeker")

class Job(db.Model):
    __tablename__ = "job"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    country = db.Column(db.String(120), nullable=False)
    region = db.Column(db.String(120), nullable=False)
    visa_type = db.Column(db.String(120), nullable=True)
    salary = db.Column(db.Integer, nullable=True)
    currency = db.Column(db.String(10), nullable=True)
    description = db.Column(db.Text, nullable=True)
    apply_url = db.Column(db.String(255), nullable=True)
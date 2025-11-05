from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="seeker")

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    country = db.Column(db.String(120))
    region = db.Column(db.String(120))
    visa_type = db.Column(db.String(120))
    salary = db.Column(db.Integer)
    currency = db.Column(db.String(10))
    description = db.Column(db.Text)

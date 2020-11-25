from flask import Flask, render_template, redirect, jsonify
import os
from dotenv import load_dotenv

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# Database info
database_url = f'postgres://wnjhouloendxny:b027f83c1f0723e6c2c0f515d8bcdcd126d8dbd84cfa0ce97a0826379797f553@ec2-54-152-40-168.compute-1.amazonaws.com:5432/d8207vdcs70hmd'
    
# Database Connection
engine = create_engine(database_url)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Destinations = Base.classes.destinations

# Create an instance of Flask
app = Flask(__name__)

# Route to render home.html template
@app.route("/")
def home():
    return render_template("home.html")

# Route to insert destination
@app.route("/api/add_dest")
def locations():

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Queue up the query
    session.add(Destinations(dest_id=1, city='Monterrey', state='NL', longitude=-100.3470249, latitude=25.6753609))

    # Commit() flushes remaining changes remain to the database, and commits the transaction.
    session.commit()

    # Close session
    session.close()

    # Redirect back to home page
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)

import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date, Numeric

from flask import Flask, jsonify, render_template

import datetime as dt

#################################################
# Database1 Setup
#################################################
engine = create_engine("sqlite:///hist.sqlite")
conn = engine.connect()

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Database2 Setup
#################################################
engine2 = create_engine("sqlite:///histcity.sqlite")
conn2 = engine2.connect()

# reflect an existing database into a new model
Base2 = automap_base()

# reflect the tables
Base2.prepare(engine2, reflect=True)

# Create our session (link) from Python to the DB
session2 = Session(engine2)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return (
        f"Welcome to the weather historical!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/wa<br/>"
        f"/api/v1.0/city"

    )

@app.route("/api/v1.0/wa")
def apiwa():
    """Return the data as json"""
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base = declarative_base()

    # Creates Classes which will serve as the anchor points for our Tables
    class historical(Base):
        __tablename__ = 'weather_hist'
        index = Column(Integer, primary_key=True)
        date = Column(String)
        latitude= Column(Integer)
        longitude = Column(Integer)
        uv_index = Column(Integer)
    
    data = session.query(historical)
    session.close()

    # Create a list to hold data'

    list = []
    for result in data:
        row = {}
        row["date"] = result.date
        row["latitude"] = result.latitude
        row["longitude"] = result.longitude
        row["uv_index"] = result.uv_index
        list.append(row)
 
    return jsonify(list)



@app.route("/api/v1.0/city")
def apicity():
    """Return the data as json"""
    # Sets an object to utilize the default declarative base in SQL Alchemy
    Base2 = declarative_base()

    # Creates Classes which will serve as the anchor points for our Tables
    class historicalcity(Base2):
        __tablename__ = 'weather_city_hist'
        index = Column(Integer, primary_key=True)
        date = Column(String)
        city = Column(String)
        latitude= Column(Integer)
        longitude = Column(Integer)
        uv_index = Column(Integer)
    
    data2 = session2.query(historicalcity)
    session2.close()

    # Create a list to hold data'

    listcity = []
    for result in data2:
        row = {}
        row["date"] = result.date
        row["city"] = result.city
        row["latitude"] = result.latitude
        row["longitude"] = result.longitude
        row["uv_index"] = result.uv_index
        listcity.append(row)
 
    return jsonify(listcity)

@app.route("/index")
def index():
    return render_template('index.html')

@app.route("/historical")
def historical():
    return render_template('historical.html')

@app.route("/about")
def about():
    return render_template('about.html')

if __name__ == "__main__":
    app.run(debug=True)
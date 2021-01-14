import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date, Numeric

from flask import Flask, jsonify

import datetime as dt

#################################################
# Database Setup
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
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def api():
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


if __name__ == "__main__":
    app.run(debug=True)
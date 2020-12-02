from flask import Flask, render_template, redirect, jsonify
import os
import math
import psycopg2
import numpy as np
import matplotlib.pyplot as plt
import yellowbrick 
from sklearn.cluster import KMeans
from yellowbrick.cluster import KElbowVisualizer
from sklearn.metrics import silhouette_score 
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import pandas as pd
import random

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
    return render_template("index.html")

# Route to render home.html template
@app.route("/cluster")
def cluster():
    return render_template("app.html")


# Route to insert destination
@app.route("/api/map/<size>/<seed>/<cargomax>/<vehicles>")
def mapping(size, seed, cargomax, vehicles):

    size = int(size)
    seed = int(seed)
    cargomax = int(cargomax)
    vehicles = int(vehicles)

    # Create our session (link) from Python to the DB
    session = Session(engine)

    destinations_data = session.query(Destinations.dest_id, Destinations.address, 
                        Destinations.latitude, Destinations.longitude).all()

    # Close session
    session.close()

    # Convert query results to a dictionary
    dest_ls = []
    for dest_id, address, latitude, longitude in destinations_data:
        dest_dict = {}
        dest_dict["dest_id"] = dest_id
        dest_dict["address"] = address
        dest_dict["latitude"] = latitude
        dest_dict["longitude"] = longitude
        dest_ls.append(dest_dict)

    # Convert list to dataframe
    destinations_df = pd.DataFrame(dest_ls)

    # Sample for project purpose
    sample = destinations_df.sample(n= size, axis=0, random_state = seed)

    # Create Lat and Lon Array
    LatLon = []
    LatLonLists = []
    y_nones = []
    lat = list(sample['latitude'])
    lon = list(sample['longitude'])


    for i in range(len(sample)):
        LatLon.append(lat[i])
        LatLon.append(lon[i])
        LatLonLists.append(LatLon)
        y_nones.append(None)
        LatLon = []
        
    X=np.array(LatLonLists)
    y=np.array(y_nones)

    #Reshape
    y = y.reshape(len(y),1)
    y.shape
    X.shape

    # K Score logic
    minK = math.ceil(max(len(sample)/cargomax,2))
    maxK = min(50,len(sample))
    Ks = range(minK, maxK)
    km = [KMeans(n_clusters=i) for i in Ks]
    score = [silhouette_score(X,km[i].fit(X).predict(X)) for i in range(len(km))]
    maxscore = np.argmax(score)
    index = min(np.argmax(score) + minK,vehicles)
    Ks, score, maxscore, index

    #Kmeans, Fitting and Predicting Clusters
    kmeans = KMeans(n_clusters=index)
    kmeans.fit(X)
    predicted_clusters = kmeans.predict(X)

    #Generate Output

    sample['Route'] = predicted_clusters
    sample.sort_values(by=['Route'],axis=0,ascending=True,inplace=True)

    output_dict = sample.to_dict("records")


# Plot the predicted clusters to see if the model predicted the correct clusters
# This is visual validation that the model was trained correctly.
#plt.scatter(X[:, 0], X[:, 1], c=predicted_clusters, s=50, cmap='viridis')

    return jsonify(output_dict)


if __name__ == "__main__":
    app.run(debug=True)

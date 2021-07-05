# RawVis

RawVis system enables efficient in-situ visual exploration and analytics directly over large raw data files without the need of an underlying DBMS or a query engine.


## Building RawVis
To build the RawVis JAR file run:

```

./mvnw -Pprod clean verify


```

To start the application, run the single executable JAR file that starts an embedded Apache Tomcat:

```

java -jar target/*.jar


```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

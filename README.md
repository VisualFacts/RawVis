# RawVis

RawVis is a data visualization system that enables efficient in-situ visual exploration and analytics directly over large raw data files without the need of an underlying DBMS or a query engine. RawVis employs a novel indexing scheme and adaptive processing techniques allowing
users to perform efficient visual and analytics operations directly
over the data files. RawVis provides real-time interaction, reporting
low response time, over large data files, using commodity hardware.

The index used by RawVis can be found [here](https://github.com/VisualFacts/rawvis-index).

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

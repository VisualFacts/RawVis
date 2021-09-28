# RawVis: In-situ Visual Analytics System

RawVis is an open source data visualization system for in-situ visual exploration and analytics over big raw data.
RawVis implements novel indexing schemes and adaptive processing techniques allowing users to perform efficient visual and analytics operations directly over the data files.
RawVis provides real-time interaction, reporting
low response time, over large data files (e.g., more than 50G & 100M objects), using commodity hardware.

In RawVis, the user selects a raw file to visualize and analyze, the file is parsed and indexed on-the-fly, generating a
“crude” initial version of our index. The user, then, performs visual operations, which are translated to queries evaluated over the index.
Based on the user interaction, the index is adapted incrementally, adjusting its structure and updating statistics.

- RawVis System Backend Source Code (e.g., indexes, query processor): [[Link]](https://github.com/VisualFacts/rawvis-index)

- Online Tool Demo: [[Link]](http://rawviz.imsi.athenarc.gr/visualize/taxi)

- Video Presentation: [[Link]](https://vimeo.com/500596816)

- RawVis Homepage: http://rawvis.net

<br/>
<br/>

## Building RawVis Tool

To build the RawVis JAR file run:

```

./mvnw -Pprod clean verify


```

To start the application, run the single executable JAR file that starts an embedded Apache Tomcat:

```

java -jar target/*.jar


```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

</br>

## Publications

- Bikakis N., Maroulis S., Papastefanatos G., Vassiliadis P.: In-Situ Visual Exploration over Big Raw Data, Information Systems, Elsevier, 2021 [[pdf]](https://www.nbikakis.com/papers/in_situ_big_data_visual_analytics_indexing_IS_2020.pdf)

- Maroulis S., Bikakis N., Papastefanatos G., Vassiliadis P., Vassiliou Y.: RawVis: A System for Efficient In-situ Visual Analytics, intl. conf. on Management of Data (ACM SIGMOD/PODS '21) [[pdf]](https://www.nbikakis.com/papers/RawVis_A_System_for_Efficient_In-situ_Visual_Analytics_SIGMOD2021.pdf)

- Maroulis S., Bikakis N., Papastefanatos G., Vassiliadis P., Vasiliou Y.: Adaptive Indexing for In-situ Visual Exploration and Analytics, 23rd intl. Workshop on Design, Optimization, Languages and Analytical Processing of Big Data (DOLAP '21) [[pdf]](https://www.nbikakis.com/papers/RawVis_Adaptive_Indexing_for_In-situ_Visual_Exploration_and_Analytics_DOLAP2021.pdf)

- Bikakis N., Maroulis S., Papastefanatos G., Vassiliadis P.: RawVis: Visual Exploration over Raw Data, 22nd european conf. on advances in databases & information systems (ADBIS 2018) [[pdf]](http://www.nbikakis.com/papers/RawVis.Visual.Exploration.over.Big.Raw.Data.pdf)

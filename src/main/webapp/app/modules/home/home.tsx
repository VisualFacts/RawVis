import './home.scss';

import React from 'react';
import {NavLink as Link} from 'react-router-dom';


export const Home = () => {

  return (
    <div id="wrapper" className="clearfix">
      <div className='home'>
        <div id="header" className="clearfix">
          <h1 className="logo"></h1>
          <div className="nav">
            <ul>
              <li>in-situ</li>
              <li>visualization</li>
              <li>analytics</li>
            </ul>
            <ul className="menu-side">
              <li><a target="_blank" rel="noopener noreferrer"
                     href="https://github.com/gpapastefanatos/visualfacts">github</a></li>
              <li><a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/RawVis">facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="intro-X"><span> <b>A System for In-situ Visual Exploration &amp; Analytics </b></span></div>
        <div className="three_fifth">
          <div className="intro-2">
                <span>
                    RawVis system enables efficient in-situ visual exploration and analytics directly over large raw data files
                    without the need of an underlying DBMS or a query engine.
                    RawVis exhibited low response time over large datasets (e.g., 50G & 100M objects) using commodity hardware.
                </span>
          </div>
        </div>
        <div className="five_sixth">
          <div className="intro-2">
                <span>
                    <div className="intro-nb"> <span> &gt; Demos</span> </div>
                    <br/>
                    These datasets are running on a single machine with 16GB of RAM.
                  {/* We have tested it on XXXXX Chrome and Firefox XXXXXXX*/}
                  <br/>
                    <br/>

                   <div className="intro-nblink">
                     <Link to="/visualize/taxi"><b>Taxi Use Case</b></Link>
                   </div><br/>
                   <p>Objects from the <a href="https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page"
                                          target="_blank"
                                          rel="noopener noreferrer">NYC Yellow Taxi Trip dataset</a>. <br/>
                    Each object refers to a specific taxi ride described by several attributes, such as:
                    Geographic pick-up location (Lat, Long), Payment type, Passenger count, Tip amount, Trip distance.
                    Each visualized point/cluster corresponds to a pick-up location of a taxi ride.</p>
                  <div className="intro-nblink">
                    <Link to="/visualize/network"><b>Telecommunication Use Case</b></Link>
                  </div><br/>
                  <p>Data are from an anonymized telecommunication dataset containing latency and signal strength measurements.
                    Each visualized point/cluster refers to a network latency and signal measurement, described by several attributes,
                    such as the geographic location (Lat, Long), latency, signal strength and network bandwidth, as well as
                    categorical attributes such as Network type, Network Operator Name, Device Manufacturer, Roaming etc.</p><br/>

          <br/>
          <br/>
          <div className="intro-nb"><span> &gt; Video Demonstration</span></div>
          <br/>
          RawVis basic functionality is presented in this <a href="https://vimeo.com/500596816"
                                                             rel="noopener noreferrer" target="_blank">video</a>.
          <br/><br/><br/>
          <div className="intro-nb"><span> &gt; Open Source</span></div>
          <br/>
          RawVis source code is hosted on <a href="https://github.com/gpapastefanatos/visualfacts"
                                             target="_blank"
                                             rel="noopener noreferrer">GitHub</a> and is available under GNU/GPL
          license.
        </span>
          </div>
        </div>
        <div className="clear"></div>
        <br/>
        <div id="footer">
          <div className="footer-text">
            <p>&copy; 2021 rawvis &nbsp; / &nbsp; in situ | visualization | analytics </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;

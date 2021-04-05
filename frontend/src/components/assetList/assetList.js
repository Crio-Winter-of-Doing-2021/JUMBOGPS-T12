import React from "react";
import styles from "./styles.module.css";
import {

  Link
} from "react-router-dom";

import {connect} from 'react-redux'


class DashboardMainPage extends React.Component {

    state = {
        tableHeaders:[
            "Asset ID",
            "Plnned From",
            "Planned To",
            "Asset location",
            "last timestamp"
        ]
    }

    componentDidMount(){
        console.log(this.props.assetDetails);

    }
 
  render() {
    const { testSuites , assetDetails} = this.props;
    const {tableHeaders} = this.state;
    return (
      <div className={styles["main-container"] + " assetListContainer"}>
        <div className={styles["col"]}>
          <div className={styles["card"] + " " + styles["shadow"]}>
            <div className={styles["card-header"]}>
              <h3 className={styles["mb-0"]}>All Assets List</h3>
              <div className={styles["table-responsive"]}></div>

              <table
                className={
                  styles["table"] +
                  " " +
                  styles["align-items-center"] +
                  " " +
                  styles["table-flush"]
                }
              >
                <thead className={styles["thead-light"]}>
                  <tr>
                    {/* Capture table header via props and render it */}
                    {tableHeaders.map((header) => (
                      <th>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Capture table rows and render */}
                  {assetDetails &&
                    assetDetails.features.map((feature) => (
                      <tr>
                        {tableHeaders.map((header, index) => {
                          if (index === 0) {
                            return (
                              <th scope="row">
                                <div
                                  className={styles["media align-items-center"]}
                                >
                                  <a
                                    to={`/suite?id`}
                                    class={styles["avatar rounded-circle mr-3"]}
                                  >
                                    {/* <img alt="Image placeholder" src="https://raw.githack.com/creativetimofficial/argon-dashboard/master/assets/img/theme/bootstrap.jpg"></img> */}
                                    <div onClick={()=>this.props.onNameClickHandler(feature.properties.id)} class={styles["media-body"]}>
                                      <span class={styles["mb-0 text-sm"]}>
                                     {feature.properties.id}
                                        {/* (testSuite.id)=>this.props.onNameClickHandler */}
                                      </span>
                                    </div>
                                  </a>
                                </div>
                              </th>
                            );
                          } else if (tableHeaders.length - 1 === index) {
                            return (
                              <td>
                                <div
                                  className={
                                    styles["d-flex align-items-center"]
                                  }
                                >
                                  <span className={styles["mr-2"]}>50%</span>
                                  <div>
                                    <div className={styles["progress"]}>
                                    {feature.properties.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            );
                          } else {
                            return (
                              <td>
                                <span
                                  className={styles["badge badge-dot mr-4"]}
                                >
                                  <i className={styles["bg-warning"]}></i>{" "}
                        
                                </span>
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
      assetDetails: state.allAssetStore,
    };
  }

export default connect(mapStateToProps, null)(DashboardMainPage);

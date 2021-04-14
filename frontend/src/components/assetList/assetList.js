import React from "react";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import { Button, message } from "antd";
import CreateAsset from "../createAsset/createAsset";
import { addAsset } from "../../api/apli-client";

class DashboardMainPage extends React.Component {
  constructor() {
    super();

    this.state = {
      tableHeaders: [
        "Asset ID",
        "Asset Name",
        "Plnned From",
        "Planned To",
        "Asset location",
        "Progress",
      ],
      assetModalVisible: false,
      userModalVisible: false,
    };
    this.addAssetRef = React.createRef();
  }

  showAssetModal = () => {
    this.setState({ assetModalVisible: true });
  };
  closeAssetModal = () => {
    this.setState({ assetModalVisible: false });
  };

  showUserModal = () => {
    this.setState({ userModalVisible: true });
  };

  closeUserModal = () => {
    this.setState({ userModalVisible: false });
  };

  componentDidMount() {
    if (!this.props.username) {
      message.info("For viewing and tracking in map. Please login");
    }
    console.log(this.props.assetDetails);
  }
  addAsset = (data) => {
    debugger;
    this.setState({ assetModalVisible: false });
    addAsset(data);
  };
  render() {
    const { assetDetails } = this.props;
    const { tableHeaders } = this.state;
    return (
      <>
        <div className={styles["main-container"] + " assetListContainer"}>
          <div style={{ textAlign: "left", margin: "10px" }}>
            <Button type="primary" onClick={this.showAssetModal}>
              Add asset
            </Button>
          </div>
          <div>
            <div>
              <div>
                <h3>All Assets List</h3>
                <div></div>

                <table className={styles["table"]}>
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
                                  <div>
                                    <a href="#">
                                      <div
                                        onClick={() =>
                                          this.props.onNameClickHandler(
                                            feature.properties.id
                                          )
                                        }
                                        class={styles["media-body"]}
                                      >
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
                                  <div>
                                    <span>50%</span>
                                    <div></div>
                                  </div>
                                </td>
                              );
                            } else {
                              return (
                                <td>
                                  <span></span>
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

        <CreateAsset
          onOk={this.addAsset}
          onCancel={this.closeAssetModal}
          visible={this.state.assetModalVisible}
          ref={this.addAssetRef}
        ></CreateAsset>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    assetDetails: state.allAssetStore,
    username: state.username,
  };
}

export default connect(mapStateToProps, null)(DashboardMainPage);

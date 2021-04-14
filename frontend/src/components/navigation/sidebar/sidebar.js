import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import {
  UnorderedListOutlined,
  LogoutOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import styles from "./styles.module.css";
function Sidebar(props) {
  const handleLogout = () => {
    props.history.push("/login");
    localStorage.removeItem("token");
    debugger;
    props.storeLoginUser(null);
    message.success("User logged out", 5);
  };
  return (
    <nav className={styles["navigation"]}>
      <ul className={styles["navigation-list"]}>
        <li>
          <NavigationLink to="/assetList">
            {" "}
            <UnorderedListOutlined
              style={{
                color: `white`,
                fontSize: "32px",
                "margin-top": "50px",
              }}
            />{" "}
          </NavigationLink>

          {props.username ? (
            <NavigationLink to="/map">
              {" "}
              <CompassOutlined
                style={{
                  color: `white`,
                  fontSize: "32px",
                  "margin-top": "5px",
                }}
              />{" "}
            </NavigationLink>
          ) : (
            ""
          )}
        </li>
      </ul>
      {props.username ? (
        <LogoutOutlined
          onClick={handleLogout}
          style={{ color: `white`, fontSize: "20px" }}
          className={styles["logout-icon"]}
        />
      ) : (
        ""
      )}
    </nav>
  );
}


function NavigationLink({ to, ...props }) {
  return (
    <Link to={to} className={`${styles["navigation-link"]}`} {...props}>
      {props.children}
    </Link>
  );
}

function mapStateToProps(state) {
  return {
    username: state.username,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    storeLoginUser: (payload) => {
      dispatch({ type: "Store_USER_NAME", payload });
    },
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Sidebar);

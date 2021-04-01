import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { withRouter } from "react-router-dom";

import PropTypes from 'prop-types';
import styles from './styles.module.css';

import {connect} from 'react-redux'
import {compose} from 'redux'
  

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }    

    componentDidMount() {               
        // fetchUserDetails()
        // .then(res => {             
        //         this.setState({
        //             user: res.data
        //         });
        //     }
        // )
        // .catch(error => {
        //         console.log(error);
        //     }
        // );
    }

    handleLogout = () => {

     
        this.props.history.push('/login')
        localStorage.removeItem('token');
        
    }

    render() {
      debugger;
        return (

            <header className={styles['header']}>
            <div className={styles['left-container']}>
        
              <div className={styles['text-big']}>Asset Tracking Portal</div>
              {this.props.heading && (
                <h1 className={`${styles['text-big']} ${styles['heading']}`}>
                  {this.props.heading}
                </h1>
              )}
            </div>
                
            <div className={styles['right-container']}>
              {this.props.username ? <div styles={{color:'white'}}><b>{`Logged in user : ${this.props.username}`}</b></div>:'' }
           
        
        {this.props.heading && (
          <h1 className={`${styles['text-big']} ${styles['heading']}`}>
             
          </h1>
          
        )}
      </div>
      
          </header>
        );
    }
}
Navigation.propTypes = {
    heading: PropTypes.string,
  };

  function mapStateToProps(state) {
    return {
      username: state.username,
    };
  }
// export default withRouter(Navigation);
export default compose(
  withRouter,
  connect(mapStateToProps, null)
)(Navigation);

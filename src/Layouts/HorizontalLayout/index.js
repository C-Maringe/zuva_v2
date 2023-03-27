import React from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { Col, Collapse, Row } from 'reactstrap';
// Import Data
import navdata from "../LayoutMenuData";
//i18n
import { withTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { isloggedout } from '../../store/auth.js/Islogged';
import { IsTableloading } from '../../store/auth.js/tableloadingStore';

const HorizontalLayout = (props) => {
    const dispatch = useDispatch()
    const navData = navdata().props.children;
    let menuItems = [];
    let splitMenuItems = [];
    let menuSplitContainer = 6;
    navData.forEach(function (value, key) {
        if (value['isHeader']) {
            menuSplitContainer++;
        }
        if (key >= menuSplitContainer) {
            let val = value;
            val.childItems = value.subItems;
            val.isChildItem = (value.subItems) ? true : false;
            delete val.subItems;
            splitMenuItems.push(val);
        } else {
            menuItems.push(value);
        }
    });

    return (
        <React.Fragment>
            {(menuItems || []).map((item, key) => {
                return (
                    <React.Fragment key={key}>
                        {/* Main Header */}
                        {!item['isHeader'] ?
                            (item.subItems ? (
                                <li className="nav-item">
                                    <Link
                                        onClick={item.click}
                                        className="nav-link menu-link"
                                        to={item.link ? item.link : "/#"}
                                        data-bs-toggle="collapse"
                                    >
                                        <i className={item.icon}></i> <span data-key="t-apps">{props.t(item.label)}</span>
                                    </Link>
                                    <Collapse
                                        className={item.subItems.length > 11 ? "menu-dropdown mega-dropdown-menu" : "menu-dropdown"}
                                        isOpen={item.stateVariables}
                                        id="sidebarApps">
                                        {/* subItms  */}
                                        {item.subItems.length > 11 ? (
                                            <React.Fragment>
                                                <Row>
                                                    {item.subItems && ((item.subItems || []).map((subItem, key) => (
                                                        <React.Fragment key={key}>
                                                            {key % 2 === 0 ? (
                                                                <Col lg={4}>
                                                                    <ul className="nav nav-sm flex-column">
                                                                        <li className="nav-item">
                                                                            <Link to={item.subItems[key].link} className="nav-link">{item.subItems[key].label}</Link>
                                                                        </li>
                                                                    </ul>
                                                                </Col>
                                                            ) : (
                                                                <Col lg={4}>
                                                                    <ul className="nav nav-sm flex-column">
                                                                        <li className="nav-item">
                                                                            <Link to={item.subItems[key].link} className="nav-link">{item.subItems[key].label}</Link>
                                                                        </li>
                                                                    </ul>
                                                                </Col>
                                                            )
                                                            }
                                                        </React.Fragment>
                                                    ))
                                                    )}
                                                </Row>
                                            </React.Fragment>
                                        ) : (
                                            <ul className="nav nav-sm flex-column test">
                                                {item.subItems && ((item.subItems || []).map((subItem, key) => (
                                                    <React.Fragment key={key}>
                                                        {!subItem.isChildItem ? (
                                                            <li className="nav-item">
                                                                <Link
                                                                    to={subItem.link ? subItem.link : "/#"}
                                                                    onClick={() => {
                                                                        if (subItem.link === "/login") {
                                                                            dispatch(isloggedout())
                                                                            dispatch(IsTableloading())
                                                                        }
                                                                    }}
                                                                    className="nav-link"
                                                                >
                                                                    {props.t(subItem.label)}
                                                                </Link>
                                                            </li>
                                                        ) : (
                                                            <li className="nav-item">
                                                                <Link
                                                                    onClick={subItem.click}
                                                                    className="nav-link"
                                                                    to="/#"
                                                                    data-bs-toggle="collapse"
                                                                > {props.t(subItem.label)}
                                                                </Link>
                                                                <Collapse className="menu-dropdown" isOpen={subItem.stateVariables} id="sidebarEcommerce">
                                                                    <ul className="nav nav-sm flex-column">
                                                                        {/* child subItms  */}
                                                                        {subItem.childItems && (
                                                                            (subItem.childItems || []).map((subChildItem, key) => (
                                                                                <React.Fragment key={key}>
                                                                                    {!subChildItem.isChildItem ? (
                                                                                        <li className="nav-item">
                                                                                            <Link
                                                                                                to={subChildItem.link ? subChildItem.link : "/#"}
                                                                                                className="nav-link"
                                                                                            >
                                                                                                {props.t(subChildItem.label)}
                                                                                            </Link>
                                                                                        </li>
                                                                                    ) : (
                                                                                        <li className="nav-item">
                                                                                            <Link
                                                                                                onClick={subChildItem.click}
                                                                                                className="nav-link"
                                                                                                to="/#"
                                                                                                data-bs-toggle="collapse"
                                                                                            > {props.t(subChildItem.label)}
                                                                                            </Link>
                                                                                            <Collapse className="menu-dropdown" isOpen={subChildItem.stateVariables} id="sidebarEcommerce">
                                                                                                <ul className="nav nav-sm flex-column">
                                                                                                    {/* child subItms  */}
                                                                                                    {subChildItem.childItems && (
                                                                                                        (subChildItem.childItems || []).map((subSubChildItem, key) => (
                                                                                                            <li className="nav-item apex" key={key}>
                                                                                                                <Link
                                                                                                                    to={subSubChildItem.link ? subSubChildItem.link : "/#"}
                                                                                                                    className="nav-link"
                                                                                                                >
                                                                                                                    {props.t(subSubChildItem.label)}
                                                                                                                </Link>
                                                                                                            </li>
                                                                                                        ))
                                                                                                    )}
                                                                                                </ul>
                                                                                            </Collapse>
                                                                                        </li>
                                                                                    )}
                                                                                </React.Fragment>
                                                                            ))
                                                                        )}
                                                                    </ul>
                                                                </Collapse>
                                                            </li>
                                                        )}
                                                    </React.Fragment>
                                                ))
                                                )}
                                            </ul>
                                        )}
                                    </Collapse>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link menu-link"
                                        to={item.link ? item.link : "/#"}
                                    >
                                        <i className={item.icon}></i> <span>{props.t(item.label)}</span>
                                    </Link>
                                </li>
                            ))
                            : (<li className="menu-title"><span data-key="t-menu">{props.t(item.label)}</span></li>)}
                    </React.Fragment>
                );
            })}
            {/* menu Items */}
        </React.Fragment >
    );
};

HorizontalLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default (withTranslation()(HorizontalLayout));
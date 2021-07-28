import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { domainService } from '../../../services/domain.service';

export const UrlConversions = ({ conversion }) => {
    const [ conversions, setConversions ] = useState([])

    useEffect(() => {
        fetch();
    }, [])

    const fetch = async () => {
        const response = await domainService.getURLConversions(conversion.full_url);
        setConversions(response.data.data)
    }

    return (
        <React.Fragment>
            <Row>
                <Col>
                        <Card>
                            <Card.Header>{ conversion.full_url }</Card.Header>
                            <Card.Body>
                                <Card.Title>Total Conversions</Card.Title>
                                <h5>
                                    {
                                        conversions.length
                                    }
                                </h5>
                            </Card.Body>
                        </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

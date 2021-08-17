import React from 'react'
import { Form } from 'react-bootstrap'

export const ValidationError = ( { error } ) => (
    error ? (
        <Form.Text className="text-danger">
            { error }
        </Form.Text>
    ) : <React.Fragment></React.Fragment>
)

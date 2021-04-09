import { Button, Col, Row } from 'antd'
import React from 'react'
import FilterControls from './FilterControls'
import SearchByStashInput from './SearchByStashInput'

export const StakeInitInput: React.FC = () => {
    return (
        <Row gutter={8}>
            <Col flex="auto">
                <SearchByStashInput />
            </Col>
            <Col flex="none">
                <FilterControls />
            </Col>
            <Col flex="none">
                <Button type="primary">自选抵押</Button>
            </Col>
        </Row>
    )
}

export default StakeInitInput

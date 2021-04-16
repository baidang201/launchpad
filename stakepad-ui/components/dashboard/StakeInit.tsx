import { Button, Col, Divider, Row } from 'antd'
import React from 'react'
import { FindWorkerFilters } from '../../libs/apis/workers'
import colors from '../../styles/colors.module.css'
import FindFilterSwitches from './ManualStake/FindFilterSwitches'
import { SearchByStashInput } from './ManualStake/SearchByStashInput'
import { RecommendationStakeInit } from './RecommendationInitInput'

export const StakeInit = ({ currentFilters, onFilterChanged }: {
    currentFilters: FindWorkerFilters
    onFilterChanged: (filters: FindWorkerFilters) => void
}): JSX.Element => {
    return (
        <>
            <Row gutter={8}>
                <Col flex="auto">
                    <SearchByStashInput />
                </Col>
                <Col flex="auto">
                    <FindFilterSwitches currentFilters={currentFilters} onFilterChanged={onFilterChanged} />
                </Col>
                <Col flex="none">
                    <Button type="primary">自选抵押</Button>
                </Col>
                <Col flex="none">
                    <Divider className={colors.standardWh03} style={{ height: '2.4em' }} type="vertical" />
                </Col>
                <Col flex="16em">
                    <RecommendationStakeInit />
                </Col>
            </Row>
        </>
    )
}

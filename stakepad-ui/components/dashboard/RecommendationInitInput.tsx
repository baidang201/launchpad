import { Button } from 'baseui/button'
import { Input } from 'baseui/input'
import React from 'react'

export const RecommendationStakeInit: React.FC = () => {
    return (
        <Input
            clearable
            disabled={true}
            endEnhancer={
                <Button
                    disabled={true}
                    overrides={{ BaseButton: { style: () => ({ width: '6em' }) } }}
                >推荐抵押</Button>
            }
            placeholder="抵押总额"
        />
    )
}

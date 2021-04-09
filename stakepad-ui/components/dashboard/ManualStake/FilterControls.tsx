import Space from 'antd/lib/space'
import Switch from 'antd/lib/switch'

export const FilterControls: React.FC = () => {
    return <div>
        <Space size="small">
            <div><Switch defaultChecked /> 不超过 20% 分润</div>
            <div><Switch defaultChecked /> 未满足基础抵押</div>
            <div><Switch defaultChecked /> 运行</div>
            <div><Switch defaultChecked /> 标记</div>
        </Space>
    </div>
}

export default FilterControls

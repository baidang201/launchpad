import Space from 'antd/lib/space'
import Switch from 'antd/lib/switch'
import styles from './FilterControls.module.css'

export const FilterControls: React.FC = () => {
    return (
        <Space size="small">
            <span className={styles.lineHeight2em}><Switch defaultChecked /> 不超过 20% 分润</span>
            <span className={styles.lineHeight2em}><Switch defaultChecked /> 未满足基础抵押</span>
            <span className={styles.lineHeight2em}><Switch defaultChecked /> 运行</span>
            <span className={styles.lineHeight2em}><Switch defaultChecked /> 标记</span>
        </Space >
    )
}

export default FilterControls

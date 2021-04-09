import Search from 'antd/lib/input/Search'
import styles from './SearchByStashInput.module.css'

export const SearchByStashInput: React.FC = () => {
    return (
        <Search allowClear className={styles.search} enterButton placeholder="按 Stash 精确搜索" />
    )
}

export default SearchByStashInput

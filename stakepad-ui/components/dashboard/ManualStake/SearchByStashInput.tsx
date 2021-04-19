import { Search as SearchIcon } from 'baseui/icon'
import { Input } from 'baseui/input'

export const SearchByStashInput: React.FC = () => {
    return (
        <Input
            clearable
            placeholder="按 Stash 精确搜索"
            startEnhancer={<SearchIcon size="1.5rem" />}
        />
    )
}

export default SearchByStashInput

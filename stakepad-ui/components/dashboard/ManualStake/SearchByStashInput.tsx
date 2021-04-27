import { Search as SearchIcon } from 'baseui/icon'
import { Input } from 'baseui/input'
import { ReactElement } from 'react'

export const SearchByStashInput = ({ onStashChanged }: {
    onStashChanged: (stash: string) => void
}): ReactElement => {
    return (
        <Input
            clearable
            onChange={(e) => onStashChanged((e.target as HTMLInputElement).value)}
            placeholder="按 Stash 精确搜索"
            startEnhancer={<SearchIcon size="1.5rem" />}
        />
    )
}

export default SearchByStashInput

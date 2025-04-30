import { FC } from 'react'
import { Input } from '@/Components/ui/input'
import { Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

interface SearchBarProps {
    onSearch: (query: string) => void
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
    const debouncedOnSearch = useDebouncedCallback(onSearch, 500)
    return (
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder="Search devices..."
                className="pl-8 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                onChange={(e) => {
                    debouncedOnSearch(e.target.value)
                }}
            />
        </div>
    )
}

export default SearchBar

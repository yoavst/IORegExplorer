import { FC } from 'react'
import { Input } from '@/Components/ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
    onSearch: (query: string) => void
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder="Search devices..."
                className="pl-8 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500"
                onChange={(e) => {
                    onSearch(e.target.value)
                }}
            />
        </div>
    )
}

export default SearchBar

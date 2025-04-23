import { FC } from 'react'

interface InhertianceChainProps {
    currentClass: string
    inhertianceChain: string[]
}
const InhertianceChain: FC<InhertianceChainProps> = ({ currentClass, inhertianceChain }) => {
    return (
        <div>
            <p className="text-sm text-gray-300">
                <span className="font-semibold">Class:</span> {currentClass}
            </p>{' '}
            <div className="space-y-1 ml-1">
                {inhertianceChain.map((cls) => (
                    <div key={cls} className="flex items-center">
                        <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                            ↑
                        </div>
                        <span className="text-sm text-gray-300">{cls}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InhertianceChain

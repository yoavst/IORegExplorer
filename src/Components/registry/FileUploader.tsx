import { ChangeEvent, FC, useState } from 'react'
import { Button } from '@/Components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { IORegEntry } from '@/types'
import { toast } from 'sonner'

const parseIORegistry = (text: string): IORegEntry[] => {
    const lines = text.split('\n')
    const entries: IORegEntry[] = []
    let currentEntry: IORegEntry | null = null
    const parentStack: { index: number; depth: number }[] = []
    let inProperties = false

    let index = 1
    for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue

        // Check if we're starting a new entry
        const entrymatch =
            /^(?<indentation>[|| ]*)\+-o\s+(?<name>.*)\s+<class\s+(?<classChain>.+?),\s+id\s+(?<id>.+?),\s+(?<status>.+?)>\s*$/.exec(
                line
            )
        if (entrymatch?.groups) {
            // We will have currentEntry if we got an input without properties
            if (currentEntry) {
                entries.push(currentEntry)
                currentEntry = null
            }
            const { indentation, name, classChain, id, status } = entrymatch.groups
            const depth = indentation.length / 2

            // Update parent stack based on depth
            while (parentStack.length > 0 && parentStack[parentStack.length - 1].depth >= depth) {
                parentStack.pop()
            }

            const parentIndex =
                parentStack.length > 0 ? parentStack[parentStack.length - 1].index : null

            // className is classA:classB:classC
            const classes = classChain.split(':')
            const className = classes[0]
            const parentClasses = classes.slice(1)

            currentEntry = {
                name,
                className,
                parentClasses,
                id,
                index,
                status,
                parentIndex,
                properties: {},
            }

            parentStack.push({ index, depth })
            index++
            continue
        }

        // Check if we're entering properties block
        if (/^[| ]*\{\s*$/.exec(line)) {
            if (inProperties || !currentEntry) {
                throw new Error('Unexpected opening brace')
            }
            inProperties = true
            continue
        }

        // Check if we're exiting properties block
        if (/^[| ]*\}\s*$/.exec(line)) {
            if (!inProperties || !currentEntry) {
                throw new Error('Unexpected closing brace')
            }

            entries.push(currentEntry)
            currentEntry = null
            inProperties = false
            continue
        }

        // Parse property
        if (inProperties && currentEntry) {
            const propertyMatch = /^[| ]*"(?<key>[^"]+)" = (?<rawValue>.+)$/.exec(line)
            if (propertyMatch?.groups) {
                const { key, rawValue } = propertyMatch.groups
                const rawValueTrimmed = rawValue.trim()

                // Try to parse the value as JSON if possible
                let value: unknown

                // Handle special cases
                if (rawValueTrimmed === 'Yes' || rawValueTrimmed === 'No') {
                    value = rawValueTrimmed === 'Yes'
                } else if (value === '<>') {
                    value = null
                } else if (!isNaN(Number(value))) {
                    value = Number(value)
                } else {
                    value = rawValueTrimmed
                }

                currentEntry.properties[key] = value
            }
        }
    }

    if (currentEntry != null) {
        throw new Error('Unexpected end of file: missing closing brace for properties')
    }

    return entries
}

interface FileUploaderProps {
    onUploadComplete: (entries: IORegEntry[], name: string) => void
}
const FileUploader: FC<FileUploaderProps> = ({ onUploadComplete }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleFileUpload = async (file: File) => {
        setIsLoading(true)

        try {
            const name = file.name
            const text = await file.text()
            const entries = parseIORegistry(text)

            toast(`File parsed successfully! ${entries.length} entries found.`)
            onUploadComplete(entries, name)
        } catch (error) {
            console.error('Error parsing file:', error)
            toast('Failed to parse the file. Please check the format and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const importFile = () => {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.multiple = false
        fileInput.style.display = 'none'
        fileInput.onchange = (e) => {
            const file = (e as unknown as ChangeEvent<HTMLInputElement>).target.files?.[0]
            if (file) {
                void handleFileUpload(file)
            }
        }
        document.body.appendChild(fileInput)
        fileInput.click()
        document.body.removeChild(fileInput)
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                variant="outline"
                onClick={importFile}
                disabled={isLoading}
                className="w-full bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-gray-100"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Parsing...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload IOReg Log
                    </>
                )}
            </Button>
        </div>
    )
}

export default FileUploader
